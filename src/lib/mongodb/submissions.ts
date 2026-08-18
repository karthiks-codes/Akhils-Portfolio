import type { Collection } from "mongodb";

import { getMongoClient } from "@/lib/mongodb/client";

export type SubmissionRecord = {
  _id: string;
  type: "contact" | "suggestion";
  name: string;
  email: string;
  subject?: string;
  message: string;
  projectSlug?: string;
  projectName?: string;
  createdAt: Date;
  deliveryStatus: "pending" | "sent" | "delivered" | "delayed" | "failed";
  delivery: {
    notification: DeliveryAttempt;
    acknowledgement: DeliveryAttempt;
  };
  abuseIdentifier: string;
};

export type DeliveryEventStatus =
  | "pending"
  | "sent"
  | "delivered"
  | "delayed"
  | "failed"
  | "bounced"
  | "complained"
  | "suppressed";

export type DeliveryAttempt = {
  emailId?: string;
  status: DeliveryEventStatus;
  updatedAt: Date;
  lastWebhookId?: string;
};

export type DeliveryReceipt = {
  notificationEmailId: string;
  acknowledgementEmailId: string;
};

async function collection(uri?: string, dbName = "akhil_portfolio", type?: SubmissionRecord["type"]) {
  const client = getMongoClient(uri);
  if (!client) return null;
  const name = type === "suggestion" ? "project_suggestions" : "contact_submissions";
  return (await client).db(dbName).collection<SubmissionRecord>(name);
}

export async function insertSubmission(record: SubmissionRecord, uri?: string, dbName?: string) {
  const target = await collection(uri, dbName, record.type);
  if (target) await target.insertOne(record);
}

export async function updateDeliveryStatus(
  record: Pick<SubmissionRecord, "_id" | "type">,
  deliveryStatus: SubmissionRecord["deliveryStatus"],
  receipt?: DeliveryReceipt,
  uri?: string,
  dbName?: string,
) {
  const target = (await collection(uri, dbName, record.type)) as Collection<SubmissionRecord> | null;
  if (!target) return;

  const now = new Date();
  const update: Partial<SubmissionRecord> = { deliveryStatus };
  if (receipt) {
    update.delivery = {
      notification: { emailId: receipt.notificationEmailId, status: "sent", updatedAt: now },
      acknowledgement: { emailId: receipt.acknowledgementEmailId, status: "sent", updatedAt: now },
    };
  }
  await target.updateOne({ _id: record._id }, { $set: update });
}

export function deriveDeliveryStatus(delivery: SubmissionRecord["delivery"]): SubmissionRecord["deliveryStatus"] {
  const statuses = [delivery.notification.status, delivery.acknowledgement.status];
  if (statuses.some((status) => ["failed", "bounced", "complained", "suppressed"].includes(status))) {
    return "failed";
  }
  if (statuses.every((status) => status === "delivered")) return "delivered";
  if (statuses.some((status) => status === "delayed")) return "delayed";
  if (statuses.some((status) => status === "sent" || status === "delivered")) return "sent";
  return "pending";
}

export async function updateDeliveryEvent(
  event: {
    submissionId: string;
    submissionType: SubmissionRecord["type"];
    channel: keyof SubmissionRecord["delivery"];
    status: Exclude<DeliveryEventStatus, "pending">;
    emailId: string;
    webhookId: string;
    occurredAt: Date;
  },
  uri?: string,
  dbName?: string,
) {
  const target = await collection(uri, dbName, event.submissionType);
  if (!target) return false;

  const updatedAtPath = `delivery.${event.channel}.updatedAt`;
  const channelPath = `delivery.${event.channel}`;
  const result = await target.updateOne(
    {
      _id: event.submissionId,
      $or: [
        { [updatedAtPath]: { $lt: event.occurredAt } },
        { [updatedAtPath]: { $exists: false } },
      ],
    },
    {
      $set: {
        [channelPath]: {
          emailId: event.emailId,
          status: event.status,
          updatedAt: event.occurredAt,
          lastWebhookId: event.webhookId,
        },
      },
    },
  );

  if (!result.modifiedCount) return false;
  const record = await target.findOne(
    { _id: event.submissionId },
    { projection: { delivery: 1 } },
  );
  if (record?.delivery) {
    await target.updateOne(
      { _id: event.submissionId },
      { $set: { deliveryStatus: deriveDeliveryStatus(record.delivery) } },
    );
  }
  return true;
}
