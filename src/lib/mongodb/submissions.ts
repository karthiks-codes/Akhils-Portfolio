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
  deliveryStatus: "pending" | "sent" | "failed";
  abuseIdentifier: string;
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
  uri?: string,
  dbName?: string,
) {
  const target = (await collection(uri, dbName, record.type)) as Collection<SubmissionRecord> | null;
  if (target) await target.updateOne({ _id: record._id }, { $set: { deliveryStatus } });
}
