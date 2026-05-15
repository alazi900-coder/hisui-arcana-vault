import { test, expect, type Page } from "@playwright/test";

/**
 * The app shows a first-run onboarding overlay (5 steps) on a fresh IndexedDB.
 * Each Playwright browser context starts clean, so we click through the overlay
 * before asserting on the main UI.
 */
async function dismissOnboarding(page: Page) {
  // Wait briefly for the React tree to mount; bail quickly if no onboarding shows.
  const finish = page.getByRole("button", { name: /ابدأ الآن|Get Started/ });
  const next = page.getByRole("button", { name: /التالي|^Next$/ });

  for (let i = 0; i < 8; i++) {
    if (await finish.isVisible().catch(() => false)) {
      await finish.click();
      // Wait for overlay to be gone.
      await page.waitForSelector("nav", { timeout: 5000 }).catch(() => {});
      return;
    }
    if (await next.isVisible().catch(() => false)) {
      await next.click();
      await page.waitForTimeout(120);
      continue;
    }
    // If neither button is visible, the overlay isn't showing (or hasn't rendered yet).
    if (i === 0) {
      await page.waitForTimeout(500);
      continue;
    }
    return;
  }
}

test.describe("Home page", () => {
  test("loads the app shell with main navigation", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/PLA Dex X/i);
    await dismissOnboarding(page);
    await expect(page.locator('a[href="/pokemon"]').first()).toBeVisible({ timeout: 15_000 });
  });

  test("navigates to the Pokédex page", async ({ page }) => {
    await page.goto("/pokemon");
    await dismissOnboarding(page);
    await expect(page).toHaveURL(/\/pokemon$/);
    // At least one Pokémon detail link should be rendered once seed data is loaded.
    await expect(page.locator('a[href^="/pokemon/"]').first()).toBeVisible({
      timeout: 30_000,
    });
  });

  test("opens the Type Chart page", async ({ page }) => {
    await page.goto("/type-chart");
    await dismissOnboarding(page);
    await expect(page).toHaveURL(/\/type-chart$/);
  });
});
