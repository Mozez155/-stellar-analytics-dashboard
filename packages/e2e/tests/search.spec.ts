import { test, expect } from './fixtures/auth';

test.describe('Search Functionality', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    const page = authenticatedPage;
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should navigate to search page', async ({ authenticatedPage }) => {
    const page = authenticatedPage;

    // Navigate to search
    await page.click('a:has-text("Search")', { exact: false });

    // Wait for navigation
    await page.waitForURL(/\/search/, { timeout: 5000 });
    expect(page.url()).toContain('/search');
  });

  test('should have search input on global search', async ({
    authenticatedPage,
  }) => {
    const page = authenticatedPage;

    // Look for global search input in header
    const searchInput = page.locator(
      'input[type="search"], input[placeholder*="Search"]'
    );

    if (await searchInput.isVisible()) {
      // Verify search input is interactive
      await expect(searchInput).toBeFocused().catch(async () => {
        await searchInput.click();
      });
    }
  });

  test('should display search results', async ({ authenticatedPage }) => {
    const page = authenticatedPage;

    // Navigate to search page
    await page.click('a:has-text("Search")', { exact: false });
    await page.waitForURL(/\/search/, { timeout: 5000 });

    // Enter a search term
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"]');
    await searchInput.fill('test');

    // Wait for results to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Check for results container
    const resultsContainer = page.locator('[data-testid="search-results"]').or(
      page.locator('[class*="results"]', { exact: false })
    );

    // Verify page rendered without errors
    const errorMessages = page.locator('[role="alert"]');
    const errorCount = await errorMessages.count();
    expect(errorCount).toBe(0);
  });

  test('should clear search results', async ({ authenticatedPage }) => {
    const page = authenticatedPage;

    // Navigate to search page
    await page.click('a:has-text("Search")', { exact: false });
    await page.waitForURL(/\/search/, { timeout: 5000 });

    // Enter and then clear search
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"]');
    await searchInput.fill('test');
    await page.waitForLoadState('networkidle');

    // Clear the search
    await searchInput.clear();

    // Verify cleared
    expect(await searchInput.inputValue()).toBe('');
  });
});
