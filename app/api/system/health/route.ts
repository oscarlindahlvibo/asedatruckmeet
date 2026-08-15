import { NextResponse } from "next/server";
import { getPretixConfig } from "@/lib/pretix";

export async function GET() {
  return NextResponse.json({
    database: process.env.DATABASE_URL ? "configured" : "missing_env",
    pretixApi: getPretixConfig() ? "configured" : "missing_env",
    objectStorage:
      process.env.S3_ENDPOINT && process.env.S3_BUCKET
        ? "configured"
        : "missing_env",
    email: process.env.SMTP_HOST ? "configured" : "missing_env",
    queue: process.env.REDIS_URL ? "configured" : "missing_env",
    webhooks: "ready",
    timestamp: new Date().toISOString(),
  });
}
