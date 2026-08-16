import type { NextRequest } from "next/server";

import { handleSubmissionRoute } from "@/lib/submissions/route";
import { contactSchema } from "@/lib/validation/submissions";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  return handleSubmissionRoute(request, "contact", contactSchema);
}
