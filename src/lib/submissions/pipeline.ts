import { createHash, randomUUID } from "node:crypto";

import { getProject } from "@/content/projects";
import { deliverSubmission } from "@/lib/email/submissions";
import type { ServerEnv } from "@/lib/env";
import {
  insertSubmission,
  type DeliveryReceipt,
  type SubmissionRecord,
  updateDeliveryStatus,
} from "@/lib/mongodb/submissions";
import { logger } from "@/lib/observability/logger";
import { consumeRateLimit, hashIdentifier, releaseDuplicate, reserveDuplicate } from "@/lib/security/request";
import { verifyTurnstile } from "@/lib/security/turnstile";
import type { ContactInput, SuggestionInput } from "@/lib/validation/submissions";

export class SubmissionError extends Error {
  constructor(
    public code: "rate_limit" | "duplicate" | "captcha" | "delivery",
    message: string,
    public status: number,
    public retryAfter?: number,
  ) {
    super(message);
  }
}

export type SubmissionAdapters = {
  now: () => Date;
  id: () => string;
  verifyCaptcha: (token: string, remoteAddress: string) => Promise<boolean>;
  consumeLimit: (key: string) => { allowed: boolean; retryAfter: number };
  reserveDuplicate: (key: string) => boolean;
  releaseDuplicate: (key: string) => void;
  store: (record: SubmissionRecord) => Promise<void>;
  updateStatus: (
    record: SubmissionRecord,
    status: SubmissionRecord["deliveryStatus"],
    receipt?: DeliveryReceipt,
  ) => Promise<void>;
  deliver: (record: SubmissionRecord) => Promise<DeliveryReceipt>;
  observe?: (event: string, fields: Record<string, string | number | boolean | undefined>) => void;
};

export function runtimeSubmissionAdapters(
  env: ServerEnv &
    Required<Pick<ServerEnv, "RESEND_API_KEY" | "CONTACT_FROM_EMAIL" | "TURNSTILE_SECRET_KEY" | "SUBMISSION_HASH_SALT">>,
): SubmissionAdapters {
  return {
    now: () => new Date(),
    id: randomUUID,
    verifyCaptcha: (token, remoteAddress) => verifyTurnstile(token, env.TURNSTILE_SECRET_KEY, remoteAddress),
    consumeLimit: (key) => consumeRateLimit(key),
    reserveDuplicate,
    releaseDuplicate,
    store: (record) => insertSubmission(record, env.MONGODB_URI, env.MONGODB_DB_NAME),
    updateStatus: (record, status, receipt) =>
      updateDeliveryStatus(record, status, receipt, env.MONGODB_URI, env.MONGODB_DB_NAME),
    deliver: (record) =>
      deliverSubmission(record, {
        apiKey: env.RESEND_API_KEY,
        from: env.CONTACT_FROM_EMAIL,
        to: env.CONTACT_TO_EMAIL,
      }),
    observe: (event, fields) => logger.info(event, fields),
  };
}

type SubmissionContext = {
  remoteAddress: string;
  abuseIdentifier: string;
  requestId?: string;
};

export async function processSubmission(
  type: "contact" | "suggestion",
  input: ContactInput | SuggestionInput,
  context: SubmissionContext,
  adapters: SubmissionAdapters,
) {
  const startedAt = Date.now();
  const telemetry = (event: string, fields: Record<string, string | number | boolean | undefined> = {}) =>
    adapters.observe?.(event, { requestId: context.requestId, submissionType: type, ...fields });
  telemetry("submission.received");

  const rate = adapters.consumeLimit(context.abuseIdentifier);
  if (!rate.allowed) {
    telemetry("submission.rejected", { reason: "rate_limit", retryAfter: rate.retryAfter });
    throw new SubmissionError(
      "rate_limit",
      "Too many messages were sent from this connection. Please try again later.",
      429,
      rate.retryAfter,
    );
  }

  const message = type === "contact" ? (input as ContactInput).message : (input as SuggestionInput).suggestion;
  const duplicateKey = createHash("sha256")
    .update(`${context.abuseIdentifier}:${input.email}:${message}`)
    .digest("hex");

  if (!adapters.reserveDuplicate(duplicateKey)) {
    telemetry("submission.rejected", { reason: "duplicate" });
    throw new SubmissionError("duplicate", "That message was already received.", 409);
  }

  const captchaStartedAt = Date.now();
  if (!(await adapters.verifyCaptcha(input.turnstileToken, context.remoteAddress))) {
    adapters.releaseDuplicate(duplicateKey);
    telemetry("submission.captcha", { outcome: "failed", durationMs: Date.now() - captchaStartedAt });
    throw new SubmissionError("captcha", "Verification could not be completed. Please try again.", 400);
  }
  telemetry("submission.captcha", { outcome: "passed", durationMs: Date.now() - captchaStartedAt });

  const suggestion = type === "suggestion" ? (input as SuggestionInput) : undefined;
  const project = suggestion ? getProject(suggestion.projectSlug) : undefined;
  const contact = type === "contact" ? (input as ContactInput) : undefined;
  const record: SubmissionRecord = {
    _id: adapters.id(),
    type,
    name: input.name,
    email: input.email,
    subject: contact?.subject || undefined,
    message,
    projectSlug: suggestion?.projectSlug,
    projectName: project?.title,
    createdAt: adapters.now(),
    deliveryStatus: "pending",
    delivery: {
      notification: { status: "pending", updatedAt: adapters.now() },
      acknowledgement: { status: "pending", updatedAt: adapters.now() },
    },
    abuseIdentifier: context.abuseIdentifier,
  };

  const failSafely = async (failureStage: "storage" | "delivery", error: unknown) => {
    adapters.releaseDuplicate(duplicateKey);
    telemetry("submission.completed", {
      outcome: "failed",
      failureStage,
      durationMs: Date.now() - startedAt,
      failureType: error instanceof Error ? error.name : "UnknownError",
    });
    try {
      await adapters.updateStatus(record, "failed");
    } catch {
      telemetry("submission.status_persistence", { outcome: "failed" });
    }
    throw new SubmissionError(
      "delivery",
      "The message could not be delivered right now. Please use the email link instead.",
      502,
    );
  };

  const storageStartedAt = Date.now();
  try {
    await adapters.store(record);
    telemetry("submission.storage", { outcome: "success", durationMs: Date.now() - storageStartedAt });
  } catch (error) {
    telemetry("submission.storage", { outcome: "failed", durationMs: Date.now() - storageStartedAt });
    return failSafely("storage", error);
  }

  const deliveryStartedAt = Date.now();
  let receipt: DeliveryReceipt;
  try {
    receipt = await adapters.deliver(record);
    telemetry("submission.delivery", { outcome: "sent", durationMs: Date.now() - deliveryStartedAt });
  } catch (error) {
    telemetry("submission.delivery", { outcome: "failed", durationMs: Date.now() - deliveryStartedAt });
    return failSafely("delivery", error);
  }

  try {
    await adapters.updateStatus(record, "sent", receipt);
  } catch {
    telemetry("submission.status_persistence", { outcome: "failed" });
  }
  telemetry("submission.completed", { outcome: "success", durationMs: Date.now() - startedAt });
  return { id: record._id };
}

export function abuseIdentifier(remoteAddress: string, salt: string) {
  return hashIdentifier(remoteAddress, salt);
}
