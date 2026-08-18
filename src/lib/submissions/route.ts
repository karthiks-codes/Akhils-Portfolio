import { randomUUID } from "node:crypto";
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
  const requestId = request.headers.get("x-request-id")?.slice(0, 128) || randomUUID();
  const response = (body: object, init?: ResponseInit) => {
    const headers = new Headers(init?.headers);
    headers.set("X-Request-Id", requestId);
    return NextResponse.json(body, { ...init, headers });
  };
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_REQUEST_BYTES) {
    return response({ message: "That message is too large." }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return response({ message: "The form data could not be read." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return response(
      {
        message: "Please check the highlighted details and try again.",
        fields: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const config = getSubmissionConfig();
  if (!config.ok) {
    return response({ message: config.message }, { status: 503 });
  }

  const remoteAddress = clientAddress(request.headers);
  try {
    const result = await processSubmission(
      type,
      parsed.data,
      {
        remoteAddress,
        abuseIdentifier: abuseIdentifier(remoteAddress, config.env.SUBMISSION_HASH_SALT),
        requestId,
      },
      runtimeSubmissionAdapters(config.env),
    );
    return response({ ok: true, id: result.id });
  } catch (error) {
    if (error instanceof SubmissionError) {
      const headers = error.retryAfter ? { "Retry-After": String(error.retryAfter) } : undefined;
      return response({ message: error.message }, { status: error.status, headers });
    }
    return response({ message: "The message could not be processed safely." }, { status: 500 });
  }
}
