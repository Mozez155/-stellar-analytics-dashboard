import { test, expect } from './fixtures/auth';

test.describe('Dashboard Navigation', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    const page = authenticatedPage;
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should display dashboard with all main sections', async ({
    authenticatedPage,
  }) => {
    const page = authenticatedPage;

    // Check for main dashboard elements
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
  });

  test('should have working navigation menu', async ({ authenticatedPage }) => {
    const page = authenticatedPage;

    // Check for navigation links
    const navLinks = [
      'dashboard',
      'network',
      'accounts',
      'transactions',
      'ledgers',
      'assets',
    ];

    for (const link of navLinks) {
      const navItem = page.locator(`a:has-text("${link}")`, {
        exact: false,
      });
      await expect(navItem).toBeVisible();
    }
  });

  test('should navigate to network page', async ({ authenticatedPage }) => {
    const page = authenticatedPage;

    // Click network link
    await page.click('a:has-text("Network")', { exact: false });

    // Wait for navigation
    await page.waitForURL(/\/network/, { timeout: 5000 });
    expect(page.url()).toContain('/network');

    // Verify page content loads
    await page.waitForLoadState('networkidle');
  });

  test('should navigate to accounts page', async ({ authenticatedPage }) => {
    const page = authenticatedPage;

    // Click accounts link
    await page.click('a:has-text("Accounts")', { exact: false });

    // Wait for navigation
    await page.waitForURL(/\/accounts/, { timeout: 5000 });
    expect(page.url()).toContain('/accounts');

    // Verify page content loads
    await page.waitForLoadState('networkidle');
  });

  test('should navigate to transactions page', async ({ authenticatedPage }) => {
    const page = authenticatedPage;

    // Click transactions link
    await page.click('a:has-text("Transactions")', { exact: false });

    // Wait for navigation
    await page.waitForURL(/\/transactions/, { timeout: 5000 });
    expect(page.url()).toContain('/transactions');

    // Verify page content loads
    await page.waitForLoadState('networkidle');
  });

  test('should navigate to ledgers page', async ({ authenticatedPage }) => {
    const page = authenticatedPage;

    // Click ledgers link
    await page.click('a:has-text("Ledgers")', { exact: false });

    // Wait for navigation
    await page.waitForURL(/\/ledgers/, { timeout: 5000 });
    expect(page.url()).toContain('/ledgers');

    // Verify page content loads
    await page.waitForLoadState('networkidle');
  });

  test('should navigate to assets page', async ({ authenticatedPage }) => {
    const page = authenticatedPage;

    // Click assets link
    await page.click('a:has-text("Assets")', { exact: false });

    // Wait for navigation
    await page.waitForURL(/\/assets/, { timeout: 5000 });
    expect(page.url()).toContain('/assets');

    // Verify page content loads
    await page.waitForLoadState('networkidle');
  });

  test('should display user menu', async ({ authenticatedPage }) => {
    const page = authenticatedPage;

    // Look for user menu button
    const userMenu = page.locator('[data-testid="user-menu"]');
    await expect(userMenu).toBeVisible();

    // Click to open menu
    await userMenu.click();

    // Check for logout option
    await expect(page.locator('[data-testid="logout-button"]')).toBeVisible();
  });

  test('should have search functionality', async ({ authenticatedPage }) => {
    const page = authenticatedPage;

    // Look for search input
    const searchInput = page.locator(
      'input[type="search"], input[placeholder*="Search"]',
      { exact: false }
    );

    if (await searchInput.isVisible()) {
      // Enter a search term
      await searchInput.fill('test');

      // Wait for results or navigation
      await page.waitForLoadState('networkidle');

      // Verify we can interact with search
      expect(await searchInput.inputValue()).toBe('test');
    }
  });
});
