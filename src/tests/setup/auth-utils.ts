import { Page } from '@playwright/test';

export async function loginAsAgent(page: Page) {
  await page.goto('/login/agent');
  await page.fill('input[type="email"]', 'agent@example.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');
}

export async function loginAsClient(page: Page) {
  await page.goto('/login/client');
  await page.fill('input[type="email"]', 'client@example.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');
}