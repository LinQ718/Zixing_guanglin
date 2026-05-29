import { S3Client } from "@aws-sdk/client-s3";

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

if (!accountId || !accessKeyId || !secretAccessKey) {
  // Allow app boot; route handlers will still return a clear configuration error.
  console.warn("R2 environment variables are missing. Upload API will reject requests until configured.");
}

const endpoint = process.env.R2_ENDPOINT || (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : "https://example.r2.cloudflarestorage.com");

export const r2Client = new S3Client({
  region: "auto",
  endpoint,
  credentials: {
    accessKeyId: accessKeyId || "missing-access-key",
    secretAccessKey: secretAccessKey || "missing-secret-key",
  },
});

export const r2Bucket = process.env.R2_BUCKET || "";
export const r2PublicBaseUrl = process.env.R2_PUBLIC_BASE_URL || "";

export function hasR2Config() {
  return Boolean(accountId && accessKeyId && secretAccessKey && r2Bucket);
}
