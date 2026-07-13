import { Page } from "@playwright/test";
import { testEmail, TEST_PASSWORD } from "./db";

/** Fill and submit the login form with the given credentials. */
export async function login(
  page: Page,
  label: string,
  password = TEST_PASSWORD,
) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(testEmail(label));
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: /sign in/i }).click();
}
