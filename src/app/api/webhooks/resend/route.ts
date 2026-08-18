import type { NextRequest } from "next/server";
import { Resend, type WebhookEventPayload } from "resend";

import { readServerEnv } from "@/lib/env";
import {
  type DeliveryEventStatus,
  type SubmissionRecord,
  updateDeliveryEvent,
} from "@/lib/mongodb/submissions";
import { errorName, logger } from "@/lib/observability/logger";

export const runtime = "nodejs";

const trackedStatuses: Partial<
  Record<WebhookEventPayload["type"], Exclude<DeliveryEventStatus, "pending">>
> = {
  "email.sent": "sent",
  "email.delivered": "delivered",
  "email.delivery_delayed": "delayed",
  "email.failed": "failed",
  "email.bounced": "bounced",
  "email.complained": "complained",
  "email.suppressed": "suppressed",
};

function trackedSubmission(tags: Record<string, string> | undefined) {
  const submissionId = tags?.submission_id;
  const submissionType = tags?.submission_type;
  const messageKind = tags?.message_kind;
  if (!submissionId || !["contact", "suggestion"].includes(submissionType ?? "")) return null;
  if (!messageKind || !["notification", "acknowledgement"].includes(messageKind)) return null;

  return {
    submissionId,
    submissionType: submissionType as SubmissionRecord["type"],
    channel: messageKind as keyof SubmissionRecord["delivery"],
  };
}

export async function POST(request: NextRequest) {
  const parsedEnv = readServerEnv();
  if (!parsedEnv.success || !parsedEnv.data.RESEND_API_KEY || !parsedEnv.data.RESEND_WEBHOOK_SECRET) {
    return Response.json({ message: "Webhook processing is not configured." }, { status: 503 });
  }

  const webhookId = request.headers.get("svix-id");
  const timestamp = request.headers.get("svix-timestamp");
  const signature = request.headers.get("svix-signature");
  if (!webhookId || !timestamp || !signature) {
    return Response.json({ message: "Missing webhook signature." }, { status: 400 });
  }

  const payload = await request.text();
  let event: WebhookEventPayload;
  try {
    event = new Resend(parsedEnv.data.RESEND_API_KEY).webhooks.verify({
      payload,
      headers: { id: webhookId, timestamp, signature },
      webhookSecret: parsedEnv.data.RESEND_WEBHOOK_SECRET,
    });
  } catch (error) {
    logger.warn("resend.webhook_rejected", { webhookId, failureType: errorName(error) });
    return Response.json({ message: "Invalid webhook signature." }, { status: 400 });
  }

  const status = trackedStatuses[event.type];
  const data = event.data;
  if (!status || !("email_id" in data) || !("tags" in data)) {
    return Response.json({ ok: true, tracked: false });
  }

  const tracked = trackedSubmission(data.tags);
  if (!tracked) return Response.json({ ok: true, tracked: false });

  try {
    const updated = await updateDeliveryEvent(
      {
        ...tracked,
        status,
        emailId: data.email_id,
        webhookId,
        occurredAt: new Date(event.created_at),
      },
      parsedEnv.data.MONGODB_URI,
      parsedEnv.data.MONGODB_DB_NAME,
    );
    logger.info("resend.delivery_event", {
      webhookId,
      submissionType: tracked.submissionType,
      channel: tracked.channel,
      deliveryStatus: status,
      updated,
    });
    return Response.json({ ok: true, tracked: true, updated });
  } catch (error) {
    logger.error("resend.webhook_failed", { webhookId, failureType: errorName(error) });
    return Response.json({ message: "Webhook processing failed." }, { status: 500 });
  }
}
