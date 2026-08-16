import { NextResponse, type NextRequest } from "next/server";
import type { ZodType } from "zod";

import { getSubmissionConfig } from "@/lib/env";
import { clientAddress } from "@/lib/security/request";
import {
  abuseIdentifier,
  processSubmission,
  runtimeSubmissionAdapters,
  SubmissionError,
} from "@/lib/submissions/pipeline";
import type { ContactInput, SuggestionInput } from "@/lib/validation/submissions";

const MAX_REQUEST_BYTES = 16_384;

export async function handleSubmissionRoute(
  request: NextRequest,
  type: "contact" | "suggestion",
  schema: ZodType<ContactInput> | ZodType<SuggestionInput>,
) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_REQUEST_BYTES) {
    return NextResponse.json({ message: "That message is too large." }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "The form data could not be read." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Please check the highlighted details and try again.",
        fields: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const config = getSubmissionConfig();
  if (!config.ok) {
    return NextResponse.json({ message: config.message }, { status: 503 });
  }

  const remoteAddress = clientAddress(request.headers);
  try {
    const result = await processSubmission(
      type,
      parsed.data,
      {
        remoteAddress,
        abuseIdentifier: abuseIdentifier(remoteAddress, config.env.SUBMISSION_HASH_SALT),
      },
      runtimeSubmissionAdapters(config.env),
    );
    return NextResponse.json({ ok: true, id: result.id });
  } catch (error) {
    if (error instanceof SubmissionError) {
      const headers = error.retryAfter ? { "Retry-After": String(error.retryAfter) } : undefined;
      return NextResponse.json({ message: error.message }, { status: error.status, headers });
    }
    return NextResponse.json({ message: "The message could not be processed safely." }, { status: 500 });
  }
}
