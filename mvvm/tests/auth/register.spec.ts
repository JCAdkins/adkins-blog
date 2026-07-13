import { test, expect } from "@playwright/test";
import { cleanTestUsers } from "../helpers/db";

test.beforeAll(async () => {
  await cleanTestUsers();
});

test.afterAll(async () => {
  await cleanTestUsers();
});

// Use #password to avoid strict-mode ambiguity with the Confirm Password field
async function fillRegisterForm(
  page: any,
  email: string,
  password: string,
  username: string
) {
  await page.goto("/register");
  await page.getByLabel("Email Address").fill(email);
  await page.locator("#password").fill(password);
  await page.locator("#confirm-password").fill(password);
  await page.getByLabel("Username").fill(username);
}

test("successful registration redirects to home", async ({ page }) => {
  await fillRegisterForm(page, "e2e_test_register_new@example.com", "TestPassword1!", "e2e_newuser1");
  await page.getByRole("button", { name: "Register" }).click();
  await page.waitForURL((url) => !url.pathname.includes("/register"), { timeout: 10000 });
});

test("duplicate email shows a toast error", async ({ page }) => {
  await fillRegisterForm(page, "e2e_test_register_dup@example.com", "TestPassword1!", "e2e_dupuser1");
  await page.getByRole("button", { name: "Register" }).click();
  await page.waitForURL((url) => !url.pathname.includes("/register"), { timeout: 10000 });

  await fillRegisterForm(page, "e2e_test_register_dup@example.com", "TestPassword1!", "e2e_dupuser2");
  await page.getByRole("button", { name: "Register" }).click();
  await expect(page.getByText("Email already in use")).toBeVisible({ timeout: 8000 });
});

test("duplicate username shows a toast error", async ({ page }) => {
  await fillRegisterForm(page, "e2e_test_register_dupusr@example.com", "TestPassword1!", "e2e_dupuser1");
  await page.getByRole("button", { name: "Register" }).click();
  await expect(page.getByText("Username already exists")).toBeVisible({ timeout: 8000 });
});

test("weak password shows a toast with validation details", async ({ page }) => {
  await fillRegisterForm(page, "e2e_test_register_weakpw@example.com", "short", "e2e_weakpwuser");
  await page.getByRole("button", { name: "Register" }).click();
  await expect(page.getByText("Failed validating your submission!")).toBeVisible({ timeout: 8000 });
});

test("mismatched passwords disables the submit button", async ({ page }) => {
  await page.goto("/register");
  await page.locator("#password").fill("TestPassword1!");
  await page.locator("#confirm-password").fill("DifferentPassword1!");
  await expect(page.getByRole("button", { name: "Register" })).toBeDisabled();
  await expect(page.getByText("Passwords do not match.")).toBeVisible();
});
