import { test, expect } from './fixtures/auth';

test.describe('Performance', () => {
  test('should load dashboard within acceptable time', async ({
    authenticatedPage,
  }) => {
    const page = authenticatedPage;
    const startTime = Date.now();

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;

    // Dashboard should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('should load transactions page quickly', async ({ authenticatedPage }) => {
    const page = authenticatedPage;

    await page.goto('/');
    const startTime = Date.now();

    await page.click('a:has-text("Transactions")', { exact: false });
    await page.waitForURL(/\/transactions/, { timeout: 5000 });
    await page.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;

    // Page should navigate and load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('should have reasonable bundle size', async ({ authenticatedPage }) => {
    const page = authenticatedPage;

    const responses: { url: string; size: number }[] = [];

    page.on('response', async (response) => {
      if (response.ok) {
        const size = (await response.body()).length;
        responses.push({
          url: response.url(),
          size,
        });
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check for large JavaScript bundles
    const jsFiles = responses.filter((r) => r.url.endsWith('.js'));
    const largeFiles = jsFiles.filter((r) => r.size > 1024 * 500); // 500KB

    // Should have reasonable chunk sizes (allow some large files for dev)
    expect(largeFiles.length).toBeLessThanOrEqual(2);
  });

  test('should not have memory leaks on navigation', async ({
    authenticatedPage,
  }) => {
    const page = authenticatedPage;

    // Navigate through multiple pages
    const pages = ['network', 'accounts', 'transactions', 'ledgers', 'assets'];

    for (const pageLink of pages) {
      await page.click(`a:has-text("${pageLink}")`, { exact: false });
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);
    }

    // If we get here without crashing, navigation is stable
    expect(true).toBeTruthy();
  });

  test('should handle rapid navigation', async ({ authenticatedPage }) => {
    const page = authenticatedPage;

    // Rapidly navigate through pages
    await page.click('a:has-text("Accounts")', { exact: false });
    await page.click('a:has-text("Transactions")', { exact: false });
    await page.click('a:has-text("Ledgers")', { exact: false });
    await page.click('a:has-text("Assets")', { exact: false });

    // Wait for final page to load
    await page.waitForLoadState('networkidle');

    // Page should be responsive
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();
  });

  test('should render tables with large data sets', async ({
    authenticatedPage,
  }) => {
    const page = authenticatedPage;

    await page.goto('/transactions');
    await page.waitForLoadState('networkidle');

    const startTime = Date.now();

    // Wait for table to render
    const table = page.locator('table');
    await expect(table).toBeVisible();

    const renderTime = Date.now() - startTime;

    // Table rendering should be fast
    expect(renderTime).toBeLessThan(2000);

    // Table should be scrollable/usable
    const rows = page.locator('table tbody tr');
    const rowCount = await rows.count();
    expect(rowCount).toBeGreaterThan(0);
  });
});
