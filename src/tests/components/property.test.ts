import { test, expect } from '@playwright/test';

test.describe('Property Components', () => {
  test('property search works', async ({ page }) => {
    await page.goto('/client/search');
    
    // Test search filters
    await page.fill('input[placeholder="Search properties..."]', 'test');
    await page.selectOption('select[name="city"]', 'Vancouver');
    await page.click('button:has-text("Search")');
    
    // Verify property cards are displayed
    await expect(page.locator('.property-card')).toBeVisible();
  });

  test('property booking flow works', async ({ page }) => {
    await page.goto('/client/properties/1');
    
    await page.click('button:has-text("Book Viewing")');
    await expect(page.locator('.booking-modal')).toBeVisible();
    
    // Select time slot and submit booking
    await page.click('.time-slot:first-child');
    await page.fill('input[name="attendees"]', '2');
    await page.click('button:has-text("Confirm Booking")');
  });
});