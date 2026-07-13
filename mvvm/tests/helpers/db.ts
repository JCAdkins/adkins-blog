import { Client } from "pg";
import { randomBytes } from "crypto";

const DB_URL = "postgresql://jordy@localhost:5432/mydb";
const BACKEND_URL = "http://localhost:3000/api";

export const TEST_PASSWORD = "TestPassword1!";
export const TEST_EMAIL_PREFIX = "e2e_test_";

export function testEmail(label: string) {
  return `${TEST_EMAIL_PREFIX}${label}@example.com`;
}

async function getClient() {
  const client = new Client({ connectionString: DB_URL });
  await client.connect();
  return client;
}

/** Remove all test users (and cascade-related data) created by E2E tests. */
export async function cleanTestUsers() {
  const client = await getClient();
  try {
    await client.query(
      `DELETE FROM "User" WHERE email LIKE '${TEST_EMAIL_PREFIX}%'`,
    );
  } finally {
    await client.end();
  }
}

/**
 * Seed a user via the real backend registration endpoint so the password hash
 * is produced by the same bcryptjs code that the auth flow expects.
 * Returns the user's id, then marks them verified directly in the DB.
 */
export async function seedVerifiedUser(label: string): Promise<string> {
  const email = testEmail(label);
  const username = `e2e_${label}`.substring(0, 20);

  console.log(`Seeding verified user ${email}...`);

  // Register through the backend so the hash matches what authorize() compares
  const res = await fetch(`${BACKEND_URL}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password: TEST_PASSWORD,
      username,
      role: "user",
      firstName: "E2E",
      lastName: "Test",
    }),
  });

  if (!res.ok && res.status !== 409) {
    throw new Error(
      `Failed to register test user ${email}: ${res.status} ${await res.text()}`,
    );
  }

  // Mark as verified directly — no email flow needed in tests
  const client = await getClient();
  try {
    const result = await client.query(
      `UPDATE "User" SET "isVerified" = true, "verificationToken" = NULL, "verificationTokenExpiry" = NULL
       WHERE email = $1 RETURNING id`,
      [email],
    );
    if (result.rows.length === 0)
      throw new Error(`User ${email} not found after seeding`);
    return result.rows[0].id;
  } finally {
    await client.end();
  }
}

/**
 * Seed an unverified user via the backend registration endpoint.
 * Returns the user's id. The user is intentionally left unverified.
 */
export async function seedUnverifiedUser(label: string): Promise<string> {
  const email = testEmail(label);
  const username = `e2e_unv_${label}`.substring(0, 20);

  console.log(`Seeding unverified user ${email}...`);

  const res = await fetch(`${BACKEND_URL}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password: TEST_PASSWORD,
      username,
      role: "user",
      firstName: "E2E",
      lastName: "Unverified",
    }),
  });

  if (!res.ok && res.status !== 409) {
    throw new Error(
      `Failed to register unverified test user ${email}: ${res.status} ${await res.text()}`,
    );
  }

  const client = await getClient();
  try {
    const result = await client.query(
      `SELECT id FROM "User" WHERE email = $1`,
      [email],
    );
    if (result.rows.length === 0)
      throw new Error(`User ${email} not found after seeding`);
    return result.rows[0].id;
  } finally {
    await client.end();
  }
}

/** Seed a password reset token for an existing user. Returns the raw token. */
export async function seedResetToken(userId: string): Promise<string> {
  const client = await getClient();
  try {
    const token = randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour
    await client.query(
      `UPDATE "User" SET "resetToken" = $1, "resetTokenExpiry" = $2 WHERE id = $3`,
      [token, expiry, userId],
    );
    return token;
  } finally {
    await client.end();
  }
}

/** Seed an email verification token for an existing unverified user. Returns the raw token. */
export async function seedVerificationToken(userId: string): Promise<string> {
  const client = await getClient();
  try {
    const token = randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(); // 48 hours
    await client.query(
      `UPDATE "User" SET "verificationToken" = $1, "verificationTokenExpiry" = $2 WHERE id = $3`,
      [token, expiry, userId],
    );
    return token;
  } finally {
    await client.end();
  }
}
