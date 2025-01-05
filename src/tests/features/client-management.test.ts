import { test, expect } from '@playwright/test';

test.describe('Client Management', () => {
  test('adding and managing clients', async ({ page }) => {
    // Login as agent
    await page.goto('/login/agent');
    await page.fill('input[type="email"]', 'agent@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Navigate to clients page
    await page.goto('/agent/clients');
    
    // Add new client
    await page.click('button:has-text("Add Client")');
    await page.fill('input[name="name"]', 'John Doe');
    await page.fill('input[name="email"]', 'john@example.com');
    await page.fill('input[name="phone"]', '(604) 555-0123');
    await page.click('button:has-text("Add Client")');

    // Verify client was added
    await expect(page.locator('text=John Doe')).toBeVisible();
    
    // Test client filtering
    await page.fill('input[placeholder="Search clients..."]', 'John');
    await expect(page.locator('text=John Doe')).toBeVisible();
  });

  test('lead capture from open house', async ({ page }) => {
    await page.goto('/agent/open-houses');
    
    // Create open house
    await page.click('button:has-text("Publish Open House")');
    await page.fill('input[name="address"]', '123 Test St');
    await page.fill('input[name="date"]', '2024-12-31');
    await page.click('button:has-text("Publish")');

    // Register visitor
    await page.goto('/open-house/register');
    await page.fill('input[name="name"]', 'Jane Smith');
    await page.fill('input[name="email"]', 'jane@example.com');
    await page.click('button:has-text("Register")');

    // Verify lead capture
    await page.goto('/agent/clients');
    await expect(page.locator('text=Jane Smith')).toBeVisible();
    await expect(page.locator('text=Open House Lead')).toBeVisible();
  });
});