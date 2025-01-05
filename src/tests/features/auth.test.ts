import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('agent registration and subscription flow', async ({ page }) => {
    await page.goto('/register/agent');
    
    // Fill registration form
    await page.fill('input[name="name"]', 'Test Agent');
    await page.fill('input[name="email"]', 'test.agent@example.com');
    await page.fill('input[name="phone"]', '(604) 555-0123');
    await page.fill('input[name="password"]', 'Password123!');
    await page.fill('input[name="confirmPassword"]', 'Password123!');
    await page.click('button[type="submit"]');

    // Verify redirect to subscription page
    await expect(page).toHaveURL('/subscription');
    
    // Select subscription plan
    await page.click('button:has-text("Subscribe Now")');
    
    // Verify Stripe checkout
    await expect(page).toHaveURL(/checkout.stripe.com/);
  });

  test('password reset flow', async ({ page }) => {
    await page.goto('/forgot-password');
    
    await page.fill('input[type="email"]', 'test@example.com');
    await page.click('button:has-text("Send Reset Link")');
    
    // Verify success message
    await expect(page.locator('text=Check Your Email')).toBeVisible();
  });
});