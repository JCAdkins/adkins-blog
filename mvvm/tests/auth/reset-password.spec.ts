import { test, expect } from "@playwright/test";
import {
  seedVerifiedUser,
  seedResetToken,
  cleanTestUsers,
} from "../helpers/db";

let validToken: string;

test.beforeAll(async () => {
  await cleanTestUsers();
  const userId = await seedVerifiedUser("resetpw");
  validToken = await seedResetToken(userId);
});

test.afterAll(async () => {
  await cleanTestUsers();
});

test("missing token renders the missing-token error panel", async ({
  page,
}) => {
  await page.goto("/reset-password");
  await expect(
    page.getByText(
      "This reset link is missing a token. Please request a new one.",
    ),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Request a new link" }),
  ).toBeVisible();
});

test("valid token — successful reset redirects to login", async ({ page }) => {
  await page.goto(`/reset-password?token=${validToken}`);
  await page.locator("#password").fill("NewTestPassword1!");
  await page.locator("#confirm-password").fill("NewTestPassword1!");
  await page.getByRole("button", { name: "Reset Password" }).click();
  await page.waitForURL(/\/login/, { timeout: 10000 });
});

test("invalid token — submitting shows the invalid-token panel", async ({
  page,
}) => {
  await page.goto("/reset-password?token=thisisnotavalidtoken");
  await page.locator("#password").fill("TestPassword1!");
  await page.locator("#confirm-password").fill("TestPassword1!");
  await page.getByRole("button", { name: "Reset Password" }).click();
  await expect(
    page
      .locator("p")
      .filter({ hasText: "This reset link is invalid or has expired." }),
  ).toBeVisible({ timeout: 8000 });
});

test("invalid token — submitting shows the invalid-token Sonner toast", async ({
  page,
}) => {
  await page.goto("/reset-password?token=thisisnotavalidtoken");
  await page.locator("#password").fill("TestPassword1!");
  await page.locator("#confirm-password").fill("TestPassword1!");
  await page.getByRole("button", { name: "Reset Password" }).click();
  await expect(
    page
      .locator("[data-sonner-toast] [data-title]")
      .filter({ hasText: "This reset link is invalid or has expired." }),
  ).toBeVisible({ timeout: 8000 });
});

test("mismatched passwords shows a toast error", async ({ page }) => {
  const userId2 = await seedVerifiedUser("resetpw2");
  const freshToken = await seedResetToken(userId2);

  await page.goto(`/reset-password?token=${freshToken}`);
  await page.locator("#password").fill("TestPassword1!");
  await page.locator("#confirm-password").fill("DifferentPassword1!");
  await page.getByRole("button", { name: "Reset Password" }).click();
  await expect(page.getByText("Passwords do not match")).toBeVisible({
    timeout: 8000,
  });
});
