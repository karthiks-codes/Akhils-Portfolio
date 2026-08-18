import { z } from "zod";

const optionalString = z.preprocess((value) => (value === "" ? undefined : value), z.string().optional());
const optionalAuthSecret = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().min(32).optional(),
);

const authEnvSchema = z.object({
  AUTH_SECRET: optionalAuthSecret,
  AUTH_GOOGLE_ID: optionalString,
  AUTH_GOOGLE_SECRET: optionalString,
  ADMIN_EMAILS: optionalString,
});

const serverEnvSchema = z
  .object({
    RESEND_API_KEY: optionalString,
    RESEND_WEBHOOK_SECRET: optionalString,
    CONTACT_FROM_EMAIL: optionalString,
    CONTACT_TO_EMAIL: z.email().default("akhilkarthikboddupalli@gmail.com"),
    MONGODB_URI: optionalString,
    MONGODB_DB_NAME: z.string().min(1).default("akhil_portfolio"),
    TURNSTILE_SECRET_KEY: optionalString,
    SUBMISSION_HASH_SALT: optionalString,
    R2_ACCOUNT_ID: optionalString,
    R2_ACCESS_KEY_ID: optionalString,
    R2_SECRET_ACCESS_KEY: optionalString,
    R2_BUCKET_NAME: optionalString,
    R2_PUBLIC_BASE_URL: optionalString,
    AUTH_SECRET: optionalString,
    AUTH_GOOGLE_ID: optionalString,
    AUTH_GOOGLE_SECRET: optionalString,
    ADMIN_EMAILS: optionalString,
  })
  .superRefine((env, ctx) => {
    if (env.MONGODB_URI && !env.MONGODB_URI.startsWith("mongodb")) {
      ctx.addIssue({ code: "custom", path: ["MONGODB_URI"], message: "Must be a MongoDB connection string." });
    }
  });

export type ServerEnv = z.infer<typeof serverEnvSchema>;

export function readServerEnv() {
  return serverEnvSchema.safeParse(process.env);
}

export function getSubmissionConfig():
  | { ok: true; env: ServerEnv & Required<Pick<ServerEnv, "RESEND_API_KEY" | "CONTACT_FROM_EMAIL" | "TURNSTILE_SECRET_KEY" | "SUBMISSION_HASH_SALT">> }
  | { ok: false; message: string } {
  const parsed = readServerEnv();

  if (!parsed.success) {
    return { ok: false, message: "The message service is not configured correctly yet." };
  }

  const required = [
    parsed.data.RESEND_API_KEY,
    parsed.data.CONTACT_FROM_EMAIL,
    parsed.data.TURNSTILE_SECRET_KEY,
    parsed.data.SUBMISSION_HASH_SALT,
  ];

  if (required.some((value) => !value)) {
    return {
      ok: false,
      message: "Messaging is not active in this environment yet. Please use the email link instead.",
    };
  }

  return {
    ok: true,
    env: parsed.data as ServerEnv &
      Required<
        Pick<ServerEnv, "RESEND_API_KEY" | "CONTACT_FROM_EMAIL" | "TURNSTILE_SECRET_KEY" | "SUBMISSION_HASH_SALT">
      >,
  };
}

export function getSiteUrl() {
  const value = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  try {
    return new URL(value);
  } catch {
    return new URL("http://localhost:3000");
  }
}

export function getAuthConfig() {
  const parsed = authEnvSchema.safeParse(process.env);
  if (!parsed.success) {
    return { configured: false, adminEmails: [] as string[], env: undefined } as const;
  }

  const adminEmails = (parsed.data.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter((email) => z.email().safeParse(email).success);
  const configured = Boolean(
    parsed.data.AUTH_SECRET &&
      parsed.data.AUTH_GOOGLE_ID &&
      parsed.data.AUTH_GOOGLE_SECRET &&
      adminEmails.length,
  );

  return { configured, adminEmails, env: parsed.data } as const;
}
