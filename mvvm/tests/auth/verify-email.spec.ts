import { test, expect } from "@playwright/test";
import { seedUnverifiedUser, seedVerificationToken, cleanTestUsers } from "../helpers/db";

let validToken: string;

test.beforeAll(async () => {
  await cleanTestUsers();
  const userId = await seedUnverifiedUser("verifyemail");
  validToken = await seedVerificationToken(userId);
});

test.afterAll(async () => {
  await cleanTestUsers();
});

test("missing token renders the missing-token error panel", async ({ page }) => {
  await page.goto("/verify-email");
  await expect(
    page.getByText("This verification link is missing a token. Please check your email for the correct link.")
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Back to sign in" })).toBeVisible();
});

test("invalid token — after auto-submit shows the invalid-token panel", async ({ page }) => {
  await page.goto("/verify-email?token=notavalidtoken");
  // Scope to the <p> in the error panel to avoid matching the sonner toast with the same text
  await expect(
    page.locator("p.text-red-800, p.dark\\:text-red-300").filter({
      hasText: "This verification link is invalid or has expired.",
    })
  ).toBeVisible({ timeout: 10000 });
  await expect(page.getByRole("link", { name: "Create a new account" })).toBeVisible();
});

test("valid token — shows success message then redirects to login", async ({ page }) => {
  await page.goto(`/verify-email?token=${validToken}`);
  // The useEffect fires formAction; on success the panel briefly shows before router.push("/login")
  await expect(
    page.getByText("Your email has been verified!")
  ).toBeVisible({ timeout: 10000 });
  await page.waitForURL(/\/login/, { timeout: 10000 });
});
