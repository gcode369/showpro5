import { test, expect } from '@playwright/test';

test.describe('Agent Rankings', () => {
  test('ranking calculation and display', async ({ page }) => {
    await page.goto('/client/rankings');
    
    // Test area filter
    await page.selectOption('select[aria-label="Select Area"]', 'Vancouver');
    
    // Verify ranking elements
    await expect(page.locator('.ranking-card')).toHaveCount(10);
    await expect(page.locator('.ranking-stats')).toBeVisible();
    
    // Verify sorting
    const rankings = await page.$$eval('.ranking-position', 
      elements => elements.map(el => parseInt(el.textContent || '0'))
    );
    expect(rankings).toEqual([...rankings].sort((a, b) => a - b));
  });

  test('following agents', async ({ page }) => {
    await page.goto('/client/rankings');
    
    // Follow top agent
    await page.click('.ranking-card:first-child button:has-text("Follow")');
    
    // Verify follow status
    await expect(page.locator('.ranking-card:first-child button:has-text("Following")')).toBeVisible();
    
    // Check feed
    await page.goto('/client/feed');
    await expect(page.locator('.property-card')).toBeVisible();
  });
});