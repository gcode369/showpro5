import { test, expect } from '@playwright/test';

test.describe('Property Bookings', () => {
  test('booking flow', async ({ page }) => {
    // Login as client
    await page.goto('/login/client');
    await page.fill('input[type="email"]', 'client@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Search and select property
    await page.goto('/client/search');
    await page.fill('input[placeholder="Search properties..."]', 'Test Property');
    await page.click('.property-card button:has-text("Book Viewing")');

    // Select time slot
    await page.click('.time-slot:not(.booked)');
    
    // Fill booking details
    await page.fill('input[name="attendees"]', '2');
    await page.fill('textarea[name="notes"]', 'Test viewing');
    await page.click('button:has-text("Confirm Booking")');

    // Verify booking
    await page.goto('/client/viewings');
    await expect(page.locator('text=Test Property')).toBeVisible();
    await expect(page.locator('text=Upcoming')).toBeVisible();
  });

  test('agent booking management', async ({ page }) => {
    await page.goto('/agent/calendar');
    
    // Check booking request
    await expect(page.locator('text=New Booking Request')).toBeVisible();
    
    // Accept booking
    await page.click('button:has-text("Accept")');
    
    // Verify notification sent
    await expect(page.locator('text=Booking Confirmed')).toBeVisible();
  });
});