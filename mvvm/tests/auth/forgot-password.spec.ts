import { test, expect } from "@playwright/test";
import { seedVerifiedUser, cleanTestUsers } from "../helpers/db";

test.beforeAll(async () => {
  await cleanTestUsers();
  await seedVerifiedUser("forgotpw");
});

test.afterAll(async () => {
  await cleanTestUsers();
});

test("submitting a registered email shows the success panel", async ({ page }) => {
  await page.goto("/forgot-password");
  await page.getByLabel("Email Address").fill("e2e_test_forgotpw@example.com");
  await page.getByRole("button", { name: "Send Reset Link" }).click();
  await expect(page.getByText("Check your inbox!")).toBeVisible({ timeout: 8000 });
  await expect(page.getByText("The link will expire in 1 hour.")).toBeVisible();
});

test("submitting an unknown email still shows the success panel (no enumeration)", async ({ page }) => {
  await page.goto("/forgot-password");
  await page.getByLabel("Email Address").fill("nobody_e2e_noemail@example.com");
  await page.getByRole("button", { name: "Send Reset Link" }).click();
  await expect(page.getByText("Check your inbox!")).toBeVisible({ timeout: 8000 });
});

test("empty form submission stays on page", async ({ page }) => {
  await page.goto("/forgot-password");
  await page.getByRole("button", { name: "Send Reset Link" }).click();
  await expect(page).toHaveURL(/\/forgot-password/);
});

test("sign in link navigates to login", async ({ page }) => {
  await page.goto("/forgot-password");
  await page.getByRole("link", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/login/);
});
