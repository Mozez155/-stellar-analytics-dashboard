import { test, expect } from './fixtures/auth';

test.describe('Detail Pages', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    const page = authenticatedPage;
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should navigate to transaction detail page', async ({
    authenticatedPage,
  }) => {
    const page = authenticatedPage;

    // Navigate to transactions page
    await page.click('a:has-text("Transactions")', { exact: false });
    await page.waitForURL(/\/transactions/, { timeout: 5000 });
    await page.waitForLoadState('networkidle');

    // Click on first transaction if available
    const transactionLinks = page.locator(
      'table tbody tr:first-child a, [data-testid="transaction-link"]:first-of-type'
    );

    if ((await transactionLinks.count()) > 0) {
      await transactionLinks.first().click();

      // Wait for transaction detail page to load
      await page.waitForURL(/\/transactions\//, { timeout: 5000 });
      expect(page.url()).toMatch(/\/transactions\/.+/);
    }
  });

  test('should navigate to account detail page', async ({ authenticatedPage }) => {
    const page = authenticatedPage;

    // Navigate to accounts page
    await page.click('a:has-text("Accounts")', { exact: false });
    await page.waitForURL(/\/accounts/, { timeout: 5000 });
    await page.waitForLoadState('networkidle');

    // Click on first account if available
    const accountLinks = page.locator(
      'table tbody tr:first-child a, [data-testid="account-link"]:first-of-type'
    );

    if ((await accountLinks.count()) > 0) {
      await accountLinks.first().click();

      // Wait for account detail page to load
      await page.waitForURL(/\/accounts\//, { timeout: 5000 });
      expect(page.url()).toMatch(/\/accounts\/.+/);
    }
  });

  test('should display transaction detail information', async ({
    authenticatedPage,
  }) => {
    const page = authenticatedPage;

    // Navigate to transactions
    await page.click('a:has-text("Transactions")', { exact: false });
    await page.waitForURL(/\/transactions/, { timeout: 5000 });
    await page.waitForLoadState('networkidle');

    // Try to navigate to first transaction
    const transactionLink = page.locator(
      'table tbody tr:first-child a, [data-testid="transaction-link"]:first-of-type'
    );

    if ((await transactionLink.count()) > 0) {
      await transactionLink.first().click();
      await page.waitForLoadState('networkidle');

      // Verify detail page has content
      const content = page.locator('main');
      await expect(content).toBeVisible();

      // Check for detail information
      const headings = page.locator('h1, h2, h3');
      const headingCount = await headings.count();
      expect(headingCount).toBeGreaterThan(0);
    }
  });

  test('should display account detail information', async ({
    authenticatedPage,
  }) => {
    const page = authenticatedPage;

    // Navigate to accounts
    await page.click('a:has-text("Accounts")', { exact: false });
    await page.waitForURL(/\/accounts/, { timeout: 5000 });
    await page.waitForLoadState('networkidle');

    // Try to navigate to first account
    const accountLink = page.locator(
      'table tbody tr:first-child a, [data-testid="account-link"]:first-of-type'
    );

    if ((await accountLink.count()) > 0) {
      await accountLink.first().click();
      await page.waitForLoadState('networkidle');

      // Verify detail page has content
      const content = page.locator('main');
      await expect(content).toBeVisible();

      // Check for detail information
      const headings = page.locator('h1, h2, h3');
      const headingCount = await headings.count();
      expect(headingCount).toBeGreaterThan(0);
    }
  });

  test('should handle back navigation from detail pages', async ({
    authenticatedPage,
  }) => {
    const page = authenticatedPage;

    // Navigate to transactions
    await page.click('a:has-text("Transactions")', { exact: false });
    await page.waitForURL(/\/transactions/, { timeout: 5000 });
    const initialUrl = page.url();

    // Try to navigate to detail page
    const transactionLink = page.locator(
      'table tbody tr:first-child a, [data-testid="transaction-link"]:first-of-type'
    );

    if ((await transactionLink.count()) > 0) {
      await transactionLink.first().click();
      await page.waitForURL(/\/transactions\//, { timeout: 5000 });

      // Navigate back
      await page.goBack();

      // Verify we're back on transactions list
      expect(page.url()).toBe(initialUrl);
    }
  });

  test('should display 404 for invalid detail page', async ({
    authenticatedPage,
  }) => {
    const page = authenticatedPage;

    // Try to navigate to invalid transaction
    await page.goto('/transactions/invalid-hash-12345', {
      waitUntil: 'networkidle',
    });

    // Check for error message or 404 indication
    const errorMessage = page.locator('[data-testid="error-message"]').or(
      page.locator('text=Not Found').or(page.locator('text=404'))
    );

    const notFoundPage = page.locator('[data-testid="not-found-page"]').or(
      page.locator('text=Not Found')
    );

    // Either show error message or navigate to not found page
    const hasError = (await errorMessage.count()) > 0;
    const hasNotFound = (await notFoundPage.count()) > 0;

    expect(hasError || hasNotFound || page.url().includes('/not-found')).toBeTruthy();
  });
});
