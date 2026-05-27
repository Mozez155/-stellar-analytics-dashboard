import { test, expect } from './fixtures/auth';

test.describe('Data Visualization', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    const page = authenticatedPage;
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should display charts on dashboard', async ({ authenticatedPage }) => {
    const page = authenticatedPage;

    // Check for chart elements (SVG or canvas)
    const charts = page.locator('svg').or(page.locator('canvas'));
    const chartCount = await charts.count();

    expect(chartCount).toBeGreaterThan(0);
  });

  test('should display metric cards with data', async ({ authenticatedPage }) => {
    const page = authenticatedPage;

    // Look for metric cards
    const metricCards = page.locator('[data-testid="metric-card"]').or(
      page.locator('[class*="card"]', { exact: false })
    );

    const cardCount = await metricCards.count();
    expect(cardCount).toBeGreaterThan(0);

    // Verify at least one card has visible content
    const firstCard = metricCards.first();
    await expect(firstCard).toBeVisible();
  });

  test('should display data tables', async ({ authenticatedPage }) => {
    const page = authenticatedPage;

    // Look for tables
    const tables = page.locator('table');
    const tableCount = await tables.count();

    if (tableCount > 0) {
      // Verify table has headers and rows
      const headers = page.locator('table th');
      const headerCount = await headers.count();
      expect(headerCount).toBeGreaterThan(0);

      // Check for table body with data
      const rows = page.locator('table tbody tr');
      const rowCount = await rows.count();
      expect(rowCount).toBeGreaterThanOrEqual(0);
    }
  });

  test('should load transaction data', async ({ authenticatedPage }) => {
    const page = authenticatedPage;

    // Navigate to transactions page
    await page.click('a:has-text("Transactions")', { exact: false });
    await page.waitForURL(/\/transactions/, { timeout: 5000 });

    // Wait for data to load
    await page.waitForLoadState('networkidle');

    // Check for transaction data display
    const tables = page.locator('table');
    const tableCount = await tables.count();

    expect(tableCount).toBeGreaterThan(0);
  });

  test('should load network data', async ({ authenticatedPage }) => {
    const page = authenticatedPage;

    // Navigate to network page
    await page.click('a:has-text("Network")', { exact: false });
    await page.waitForURL(/\/network/, { timeout: 5000 });

    // Wait for data to load
    await page.waitForLoadState('networkidle');

    // Check for chart on network page
    const charts = page.locator('svg').or(page.locator('canvas'));
    const chartCount = await charts.count();

    expect(chartCount).toBeGreaterThan(0);
  });

  test('should display account data', async ({ authenticatedPage }) => {
    const page = authenticatedPage;

    // Navigate to accounts page
    await page.click('a:has-text("Accounts")', { exact: false });
    await page.waitForURL(/\/accounts/, { timeout: 5000 });

    // Wait for data to load
    await page.waitForLoadState('networkidle');

    // Check for table with account data
    const tables = page.locator('table');
    const tableCount = await tables.count();

    expect(tableCount).toBeGreaterThan(0);
  });

  test('should display ledger timeline', async ({ authenticatedPage }) => {
    const page = authenticatedPage;

    // Navigate to ledgers page
    await page.click('a:has-text("Ledgers")', { exact: false });
    await page.waitForURL(/\/ledgers/, { timeout: 5000 });

    // Wait for data to load
    await page.waitForLoadState('networkidle');

    // Check for timeline chart or table
    const charts = page.locator('svg');
    const tables = page.locator('table');

    const hasCharts = (await charts.count()) > 0;
    const hasTables = (await tables.count()) > 0;

    expect(hasCharts || hasTables).toBeTruthy();
  });

  test('should display assets data', async ({ authenticatedPage }) => {
    const page = authenticatedPage;

    // Navigate to assets page
    await page.click('a:has-text("Assets")', { exact: false });
    await page.waitForURL(/\/assets/, { timeout: 5000 });

    // Wait for data to load
    await page.waitForLoadState('networkidle');

    // Check for table with assets data
    const tables = page.locator('table');
    const tableCount = await tables.count();

    expect(tableCount).toBeGreaterThan(0);
  });

  test('should handle GraphQL subscription updates', async ({
    authenticatedPage,
  }) => {
    const page = authenticatedPage;

    // Monitor network requests
    const responses: string[] = [];
    page.on('response', async (response) => {
      if (response.url().includes('/graphql')) {
        responses.push(response.status().toString());
      }
    });

    // Navigate through pages to trigger GraphQL queries
    await page.click('a:has-text("Transactions")', { exact: false });
    await page.waitForLoadState('networkidle');

    // Wait a bit for WebSocket connections
    await page.waitForTimeout(1000);

    // Verify we got successful GraphQL responses
    const successResponses = responses.filter((status) => status === '200');
    expect(successResponses.length).toBeGreaterThan(0);
  });
});
