import { createHash } from "node:crypto";
import { readFile, readdir, stat } from "node:fs/promises";
import { join, relative, sep } from "node:path";

import { HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { z } from "zod";

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
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
};

async function filesUnder(directory: string): Promise<string[]> {
  const entries = await readdir(directory);
  const files = await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry);
      return (await stat(path)).isDirectory() ? filesUnder(path) : [path];
    }),
  );
  return files.flat();
}

async function main() {
  const env = envSchema.parse(process.env);
  const assetRoot = join(process.cwd(), "public", "assets");
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
      if (status !== 404) throw error;
    }

    if (currentHash === sha256) {
      unchanged += 1;
      continue;
    }

    const extension = file.slice(file.lastIndexOf(".")).toLowerCase();
    await client.send(
      new PutObjectCommand({
        Bucket: env.R2_BUCKET_NAME,
        Key: key,
        Body: body,
        ContentType: contentTypes[extension] ?? "application/octet-stream",
        CacheControl: "public, max-age=31536000, immutable",
        Metadata: { sha256 },
      }),
    );
    uploaded += 1;
  }

  console.info(`R2 asset sync complete: ${uploaded} uploaded, ${unchanged} unchanged.`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "R2 asset sync failed.");
  process.exitCode = 1;
});
