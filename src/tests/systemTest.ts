import { test, expect } from '@playwright/test';

test.describe('End-to-end system test', () => {
  test('Complete agent-client interaction flow', async ({ page }) => {
    // Agent flow
    await test.step('Agent creates property listing', async () => {
      await page.goto('/login/agent');
      // Login and create property...
    });

    await test.step('Agent sets availability', async () => {
      await page.goto('/agent/calendar');
      // Set showing times...
    });

    // Client flow
    await test.step('Client books showing', async () => {
      await page.goto('/login/client');
      // Search and book showing...
    });

    // Verify notifications
    await test.step('Verify notifications', async () => {
      // Check agent notification
      await page.goto('/agent/notifications');
      await expect(page.locator('text=New Booking Request')).toBeVisible();

      // Check client notification
      await page.goto('/client/notifications');
      await expect(page.locator('text=Booking Confirmed')).toBeVisible();
    });
  });
});