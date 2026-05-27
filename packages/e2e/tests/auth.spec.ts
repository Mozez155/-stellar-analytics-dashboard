import { test, expect, clearAuth } from './fixtures/auth';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await clearAuth(page);
    await page.goto('/login');
  });

  test('should display login form', async ({ page }) => {
    // Check if login form is visible
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should show validation errors for empty fields', async ({ page }) => {
    // Try to submit empty form
    await page.click('button[type="submit"]');

    // Wait for validation messages
    await page.waitForTimeout(500);

    // Check for error messages
    const errors = await page.locator('[role="alert"]').all();
    expect(errors.length).toBeGreaterThan(0);
  });

  test('should show error for invalid credentials', async ({
    page,
    testUserEmail,
  }) => {
    // Enter invalid credentials
    await page.fill('input[type="email"]', testUserEmail);
    await page.fill('input[type="password"]', 'WrongPassword123!');
    await page.click('button[type="submit"]');

    // Wait for error message
    await page.waitForTimeout(1000);

    // Check for error message
    const errorMessage = page.locator('[role="alert"]');
    await expect(errorMessage).toBeVisible();
  });

  test('should login successfully with correct credentials', async ({
    page,
    testUserEmail,
    testUserPassword,
  }) => {
    // Enter correct credentials
    await page.fill('input[type="email"]', testUserEmail);
    await page.fill('input[type="password"]', testUserPassword);
    await page.click('button[type="submit"]');

    // Wait for navigation to dashboard
    await page.waitForURL('/', { timeout: 10000 });

    // Verify we're on the dashboard
    expect(page.url()).toBe('http://localhost:5173/');

    // Check for auth token in localStorage
    const token = await page.evaluate(() => localStorage.getItem('auth_token'));
    expect(token).toBeTruthy();
  });

  test('should prevent access to protected routes without authentication', async ({
    page,
  }) => {
    // Try to access dashboard without login
    await page.goto('/', { waitUntil: 'networkidle' });

    // Should redirect to login
    expect(page.url()).toContain('/login');
  });

  test('should redirect to dashboard if already logged in', async ({
    page,
    testUserEmail,
    testUserPassword,
  }) => {
    // First, login
    await page.fill('input[type="email"]', testUserEmail);
    await page.fill('input[type="password"]', testUserPassword);
    await page.click('button[type="submit"]');
    await page.waitForURL('/', { timeout: 10000 });

    // Try to access login page again
    await page.goto('/login');

    // Should redirect back to dashboard
    expect(page.url()).toBe('http://localhost:5173/');
  });

  test('should logout successfully', async ({
    authenticatedPage,
  }) => {
    const page = authenticatedPage;

    // Click user menu
    await page.click('[data-testid="user-menu"]');

    // Click logout
    await page.click('[data-testid="logout-button"]');

    // Wait for navigation to login page
    await page.waitForURL('/login', { timeout: 5000 });

    // Verify token is cleared
    const token = await page.evaluate(() => localStorage.getItem('auth_token'));
    expect(token).toBeNull();
  });
});
