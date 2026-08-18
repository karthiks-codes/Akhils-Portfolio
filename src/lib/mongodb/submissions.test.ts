import { describe, expect, it } from "vitest";

import { deriveDeliveryStatus, type SubmissionRecord } from "@/lib/mongodb/submissions";

const now = new Date("2026-08-18T10:00:00.000Z");

function delivery(
  notification: SubmissionRecord["delivery"]["notification"]["status"],
  acknowledgement: SubmissionRecord["delivery"]["acknowledgement"]["status"],
): SubmissionRecord["delivery"] {
  return {
    notification: { status: notification, updatedAt: now },
    acknowledgement: { status: acknowledgement, updatedAt: now },
  };
}

describe("delivery status derivation", () => {
  it("marks the submission delivered only after both emails arrive", () => {
    expect(deriveDeliveryStatus(delivery("delivered", "sent"))).toBe("sent");
    expect(deriveDeliveryStatus(delivery("delivered", "delivered"))).toBe("delivered");
  });

  it("surfaces delayed and terminal delivery failures", () => {
    expect(deriveDeliveryStatus(delivery("delayed", "sent"))).toBe("delayed");
    expect(deriveDeliveryStatus(delivery("delivered", "bounced"))).toBe("failed");
  });
});
