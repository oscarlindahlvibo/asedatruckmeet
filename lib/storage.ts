import { S3Client } from "@aws-sdk/client-s3";

export function getStorageConfig() {
  const endpoint = process.env.S3_ENDPOINT;
  const bucket = process.env.S3_BUCKET;
  const accessKeyId = process.env.S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
  if (!endpoint || !bucket || !accessKeyId || !secretAccessKey) return null;
  return { endpoint, bucket, publicBaseUrl: process.env.S3_PUBLIC_BASE_URL, region: process.env.S3_REGION ?? "auto", accessKeyId, secretAccessKey };
}

export function getStorageClient() {
  const config = getStorageConfig();
  if (!config) return null;
  return { client: new S3Client({ endpoint: config.endpoint, region: config.region, forcePathStyle: true, credentials: { accessKeyId: config.accessKeyId, secretAccessKey: config.secretAccessKey } }), config };
}
