import { chromium } from 'playwright';
import { test, expect } from '@playwright/test';

// Configure concurrent users
const CONCURRENT_USERS = 100;
const RAMP_UP_TIME = 60; // seconds
const TEST_DURATION = 300; // seconds

async function simulateUserActions(page: any, userType: 'agent' | 'client') {
  // Login
  await page.goto('/login/' + userType);
  await page.fill('input[type="email"]', `test_${userType}_${Date.now()}@example.com`);
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');

  if (userType === 'agent') {
    // Agent actions
    await page.goto('/agent/properties');
    await page.click('button:has-text("Add Property")');
    // Fill property form...

    await page.goto('/agent/calendar');
    await page.click('button:has-text("Add Time Slot")');
    // Add availability...
  } else {
    // Client actions
    await page.goto('/client/search');
    await page.fill('input[placeholder="Search properties..."]', 'Vancouver');
    await page.click('button:has-text("Search")');
    
    await page.goto('/client/viewings');
    // Book viewing...
  }
}

test('Load test - concurrent users', async () => {
  const browser = await chromium.launch();
  const users = [];

  // Create concurrent user sessions
  for (let i = 0; i < CONCURRENT_USERS; i++) {
    const context = await browser.newContext();
    const page = await context.newPage();
    users.push(page);
  }

  // Run user actions concurrently
  const userActions = users.map((page, index) => 
    simulateUserActions(page, index % 2 === 0 ? 'agent' : 'client')
  );

  await Promise.all(userActions);
  await browser.close();
});