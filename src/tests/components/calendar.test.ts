import { test, expect } from '@playwright/test';

test.describe('Calendar Components', () => {
  test('agent calendar management works', async ({ page }) => {
    await page.goto('/agent/calendar');
    
    // Test adding availability
    await page.click('button:has-text("Add Time Slot")');
    await page.fill('input[type="time"]', '10:00');
    await page.click('button:has-text("Save")');
    
    // Verify time slot is added
    await expect(page.locator('.time-slot')).toBeVisible();
  });
});