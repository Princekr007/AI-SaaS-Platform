
    const { test, expect } = require('@playwright/test');

    test('Visit https://example.com and check title', async ({ page }) => {
      await page.goto('https://example.com');
      await expect(page).toHaveTitle(/Example Domain/);
    });
  