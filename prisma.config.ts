import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // `prisma generate` runs during frontend builds where the runtime database
    // secret is intentionally unavailable. Migrations/runtime still require
    // DATABASE_URL to be supplied by the deployment environment.
    url: process.env.DATABASE_URL ?? "postgresql://localhost:5432/truckmeet?schema=truckmeet",
  },
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
});
