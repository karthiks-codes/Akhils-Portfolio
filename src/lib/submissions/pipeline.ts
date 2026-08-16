import { createHash, randomUUID } from "node:crypto";

import { getProject } from "@/content/projects";
import { deliverSubmission } from "@/lib/email/submissions";
import type { ServerEnv } from "@/lib/env";
import { insertSubmission, type SubmissionRecord, updateDeliveryStatus } from "@/lib/mongodb/submissions";
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
  updateStatus: (record: SubmissionRecord, status: SubmissionRecord["deliveryStatus"]) => Promise<void>;
  deliver: (record: SubmissionRecord) => Promise<void>;
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
    updateStatus: (record, status) =>
      updateDeliveryStatus(record, status, env.MONGODB_URI, env.MONGODB_DB_NAME),
    deliver: (record) =>
      deliverSubmission(record, {
        apiKey: env.RESEND_API_KEY,
        from: env.CONTACT_FROM_EMAIL,
        to: env.CONTACT_TO_EMAIL,
      }),
  };
}

type SubmissionContext = {
  remoteAddress: string;
  abuseIdentifier: string;
};

export async function processSubmission(
  type: "contact" | "suggestion",
  input: ContactInput | SuggestionInput,
  context: SubmissionContext,
  adapters: SubmissionAdapters,
) {
  const rate = adapters.consumeLimit(context.abuseIdentifier);
  if (!rate.allowed) {
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
    throw new SubmissionError("duplicate", "That message was already received.", 409);
  }

  if (!(await adapters.verifyCaptcha(input.turnstileToken, context.remoteAddress))) {
    adapters.releaseDuplicate(duplicateKey);
    throw new SubmissionError("captcha", "Verification could not be completed. Please try again.", 400);
  }

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
    abuseIdentifier: context.abuseIdentifier,
  };

  try {
    await adapters.store(record);
    await adapters.deliver(record);
    await adapters.updateStatus(record, "sent");
    return { id: record._id };
  } catch {
    adapters.releaseDuplicate(duplicateKey);
    try {
      await adapters.updateStatus(record, "failed");
    } catch {
      // Preserve the safe delivery error even if optional persistence is unavailable.
    }
    throw new SubmissionError(
      "delivery",
      "The message could not be delivered right now. Please use the email link instead.",
      502,
    );
  }
}

export function abuseIdentifier(remoteAddress: string, salt: string) {
  return hashIdentifier(remoteAddress, salt);
}
