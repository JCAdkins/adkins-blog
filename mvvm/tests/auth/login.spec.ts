import { test, expect } from "@playwright/test";
import { seedVerifiedUser, seedUnverifiedUser, cleanTestUsers, TEST_PASSWORD, testEmail } from "../helpers/db";

test.beforeAll(async () => {
  await cleanTestUsers();
  await seedVerifiedUser("login_valid");
  await seedUnverifiedUser("login_unverified");
});

test.afterAll(async () => {
  await cleanTestUsers();
});

test("successful login redirects away from /login", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email Address").fill(testEmail("login_valid"));
  await page.getByLabel("Password").fill(TEST_PASSWORD);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL((url) => !url.pathname.includes("/login"), { timeout: 10000 });
});

test("wrong password shows a toast error", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email Address").fill(testEmail("login_valid"));
  await page.getByLabel("Password").fill("WrongPassword1!");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByText("Invalid credentials!")).toBeVisible({ timeout: 8000 });
});

test("unknown email shows a toast error", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email Address").fill("nobody_e2e@example.com");
  await page.getByLabel("Password").fill(TEST_PASSWORD);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByText("Invalid credentials!")).toBeVisible({ timeout: 8000 });
});

test("unverified user can log in and is redirected away from /login", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email Address").fill(testEmail("login_unverified"));
  await page.getByLabel("Password").fill(TEST_PASSWORD);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL((url) => !url.pathname.includes("/login"), { timeout: 10000 });
});

test("empty form submission stays on login page", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/login/);
});
