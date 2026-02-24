// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/index.js";
import pg from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined in .env");
}

const pool = new pg.Pool({
  connectionString: connectionString,
  // ssl: { rejectUnauthorized: false }, // if needed
});

const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter, log: ["warn", "error"] });

// Store in global for hot-reload in dev
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
