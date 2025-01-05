import { test, expect } from '@playwright/test';

test.describe('Authentication Components', () => {
  test('login form works correctly', async ({ page }) => {
    await page.goto('/login/client');
    
    // Test form validation
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Email is required')).toBeVisible();
    
    // Test login flow
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
  });

  test('registration form works correctly', async ({ page }) => {
    await page.goto('/register/client');
    
    // Fill registration form
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="confirmPassword"]', 'password123');
    await page.click('button[type="submit"]');
  });
});