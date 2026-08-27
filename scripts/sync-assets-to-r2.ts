import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import { extname, join, relative, sep } from "node:path";

import { HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { z } from "zod";

// Real environment variables win; `.env.local` wins over `.env`.
for (const file of [".env.local", ".env"]) {
  const path = join(process.cwd(), file);
  if (existsSync(path)) process.loadEnvFile(path);
}

const envSchema = z.object({
  R2_ACCOUNT_ID: z.string().min(1),
  R2_ACCESS_KEY_ID: z.string().min(1),
  R2_SECRET_ACCESS_KEY: z.string().min(1),
  R2_BUCKET_NAME: z.string().min(1),
});

const contentTypes: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
};

async function filesUnder(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? filesUnder(path) : [path];
    }),
  );
  return files.flat();
}

function readEnv() {
  const parsed = envSchema.safeParse(process.env);
  if (parsed.success) return parsed.data;

  const missing = parsed.error.issues.map((issue) => issue.path.join("."));
  throw new Error(
    `Missing R2 configuration: ${missing.join(", ")}. ` +
      "Set these in .env.local (see .env.example) or in the environment before running assets:sync.",
  );
}

async function main() {
  const env = readEnv();
  const assetRoot = join(process.cwd(), "public", "assets");

  if (!existsSync(assetRoot)) {
    throw new Error(`Asset directory not found: ${assetRoot}`);
  }

  const client = new S3Client({
    region: "auto",
    endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: env.R2_ACCESS_KEY_ID,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    },
  });

  let uploaded = 0;
  let unchanged = 0;

  for (const file of await filesUnder(assetRoot)) {
    const body = await readFile(file);
    const sha256 = createHash("sha256").update(body).digest("hex");
    const key = `assets/${relative(assetRoot, file).split(sep).join("/")}`;
    let currentHash: string | undefined;

    try {
      const head = await client.send(new HeadObjectCommand({ Bucket: env.R2_BUCKET_NAME, Key: key }));
      currentHash = head.Metadata?.sha256;
    } catch (error) {
      const status = (error as { $metadata?: { httpStatusCode?: number } }).$metadata?.httpStatusCode;
      const name = (error as { name?: string }).name;
      if (status !== 404 && name !== "NotFound" && name !== "NoSuchKey") throw error;
    }

    if (currentHash === sha256) {
      unchanged += 1;
      continue;
    }

    await client.send(
      new PutObjectCommand({
        Bucket: env.R2_BUCKET_NAME,
        Key: key,
        Body: body,
        ContentType: contentTypes[extname(file).toLowerCase()] ?? "application/octet-stream",
        CacheControl: "public, max-age=31536000, immutable",
        Metadata: { sha256 },
      }),
    );
    console.info(`uploaded ${key}`);
    uploaded += 1;
  }

  console.info(`R2 asset sync complete: ${uploaded} uploaded, ${unchanged} unchanged.`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "R2 asset sync failed.");
  process.exitCode = 1;
});
