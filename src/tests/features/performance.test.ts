import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('load testing', async ({ page }) => {
    const startTime = Date.now();
    
    // Load main pages
    await Promise.all([
      page.goto('/client/search'),
      page.goto('/client/rankings'),
      page.goto('/client/viewings')
    ]);

    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000); // Max 3s load time

    // Test search responsiveness
    const searchStartTime = Date.now();
    await page.fill('input[placeholder="Search properties..."]', 'Vancouver');
    await page.waitForResponse(response => 
      response.url().includes('/api/properties') && 
      response.status() === 200
    );
    
    const searchTime = Date.now() - searchStartTime;
    expect(searchTime).toBeLessThan(1000); // Max 1s search time
  });

  test('concurrent users', async ({ browser }) => {
    const NUM_USERS = 10;
    const contexts = await Promise.all(
      Array(NUM_USERS).fill(0).map(() => browser.newContext())
    );

    const pages = await Promise.all(
      contexts.map(context => context.newPage())
    );

    // Simulate concurrent searches
    await Promise.all(
      pages.map(page => 
        page.goto('/client/search')
          .then(() => page.fill('input[placeholder="Search properties..."]', 'Vancouver'))
      )
    );

    // Verify all requests completed successfully
    const responses = await Promise.all(
      pages.map(page => 
        page.waitForResponse(response => 
          response.url().includes('/api/properties')
        )
      )
    );

    responses.forEach(response => {
      expect(response.status()).toBe(200);
    });
  });
});