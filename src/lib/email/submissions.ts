import { Resend } from "resend";

import type { SubmissionRecord } from "@/lib/mongodb/submissions";

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    };
    return entities[character];
  });
}

export async function deliverSubmission(
  record: SubmissionRecord,
  config: { apiKey: string; from: string; to: string },
) {
  const resend = new Resend(config.apiKey);
  const isSuggestion = record.type === "suggestion";
  const label = isSuggestion ? `Project suggestion: ${record.projectName}` : record.subject || "Portfolio contact";
  const details = [
    `Name: ${record.name}`,
    `Email: ${record.email}`,
    isSuggestion ? `Project: ${record.projectName}` : undefined,
    record.subject ? `Subject: ${record.subject}` : undefined,
    "",
    record.message,
  ].filter((line): line is string => line !== undefined);

  const messageHtml = escapeHtml(record.message).replace(/\n/g, "<br />");
  const { error } = await resend.batch.send([
    {
      from: config.from,
      to: [config.to],
      replyTo: record.email,
      subject: label,
      text: details.join("\n"),
      html: `<h1>${escapeHtml(label)}</h1><p><strong>From:</strong> ${escapeHtml(record.name)} &lt;${escapeHtml(record.email)}&gt;</p>${isSuggestion ? `<p><strong>Project:</strong> ${escapeHtml(record.projectName ?? "")}</p>` : ""}<p>${messageHtml}</p>`,
    },
    {
      from: config.from,
      to: [record.email],
      replyTo: [config.to],
      subject: isSuggestion ? `Your idea for ${record.projectName} was received` : "Thanks for reaching out",
      text: "Thanks for reaching out. I've received your message and will get back to you soon.",
      html: `<p>Hi ${escapeHtml(record.name)},</p><p>Thanks for reaching out. I've received your message and will get back to you soon.</p><p>— Akhil</p>`,
    },
  ]);

  if (error) throw new Error("Email delivery failed.");
}
