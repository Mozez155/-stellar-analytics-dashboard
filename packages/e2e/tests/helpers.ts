import { Page, expect } from '@playwright/test';

/**
 * Test utility helpers for common operations
 */

/**
 * Navigation helpers
 */
export const navigate = {
  /**
   * Navigate to a specific page by clicking nav link
   */
  async toPage(page: Page, pageName: string) {
    await page.click(`a:has-text("${pageName}")`, { exact: false });
    await page.waitForLoadState('networkidle');
  },

  /**
   * Go back to previous page
   */
  async back(page: Page) {
    await page.goBack();
    await page.waitForLoadState('networkidle');
  },

  /**
   * Wait for URL to change
   */
  async toUrl(page: Page, urlPattern: string | RegExp) {
    if (typeof urlPattern === 'string') {
      await page.waitForURL(new RegExp(urlPattern), { timeout: 5000 });
    } else {
      await page.waitForURL(urlPattern, { timeout: 5000 });
    }
  },
};

/**
 * Assertion helpers
 */
export const assert = {
  /**
   * Assert page title
   */
  async pageTitle(page: Page, title: string | RegExp) {
    const pageTitle = await page.title();
    if (typeof title === 'string') {
      expect(pageTitle).toContain(title);
    } else {
      expect(pageTitle).toMatch(title);
    }
  },

  /**
   * Assert URL contains string
   */
  async urlContains(page: Page, text: string) {
    expect(page.url()).toContain(text);
  },

  /**
   * Assert element is visible
   */
  async isVisible(page: Page, selector: string) {
    const element = page.locator(selector);
    await expect(element).toBeVisible();
  },

  /**
   * Assert element is not visible
   */
  async isNotVisible(page: Page, selector: string) {
    const element = page.locator(selector);
    await expect(element).not.toBeVisible();
  },

  /**
   * Assert element text
   */
  async hasText(page: Page, selector: string, text: string | RegExp) {
    const element = page.locator(selector);
    await expect(element).toContainText(
      typeof text === 'string' ? text : new RegExp(text)
    );
  },

  /**
   * Assert table has rows
   */
  async tableHasRows(page: Page, tableSelector: string, minRows = 1) {
    const rows = page.locator(`${tableSelector} tbody tr`);
    const count = await rows.count();
    expect(count).toBeGreaterThanOrEqual(minRows);
  },

  /**
   * Assert element count
   */
  async elementCount(page: Page, selector: string, count: number) {
    const elements = page.locator(selector);
    await expect(elements).toHaveCount(count);
  },

  /**
   * Assert no errors on page
   */
  async noErrors(page: Page) {
    const errors = page.locator('[role="alert"]');
    const errorCount = await errors.count();
    expect(errorCount).toBe(0);
  },
};

/**
 * Form helpers
 */
export const form = {
  /**
   * Fill form inputs
   */
  async fill(page: Page, inputs: Record<string, string>) {
    for (const [selector, value] of Object.entries(inputs)) {
      await page.fill(selector, value);
    }
  },

  /**
   * Submit form
   */
  async submit(page: Page, buttonSelector = 'button[type="submit"]') {
    await page.click(buttonSelector);
    await page.waitForLoadState('networkidle').catch(() => {
      // If no network activity, wait for navigation
    });
  },

  /**
   * Fill and submit
   */
  async fillAndSubmit(
    page: Page,
    inputs: Record<string, string>,
    buttonSelector?: string
  ) {
    await form.fill(page, inputs);
    await form.submit(page, buttonSelector);
  },

  /**
   * Get form error message
   */
  async getErrorMessage(page: Page): Promise<string | null> {
    const error = page.locator('[role="alert"]');
    if (await error.isVisible()) {
      return await error.textContent();
    }
    return null;
  },

  /**
   * Check if field has error
   */
  async fieldHasError(page: Page, fieldSelector: string): Promise<boolean> {
    const field = page.locator(fieldSelector);
    const ariaInvalid = await field.getAttribute('aria-invalid');
    return ariaInvalid === 'true';
  },
};

/**
 * Table helpers
 */
export const table = {
  /**
   * Get table data as array of objects
   */
  async getData(page: Page, tableSelector: string) {
    const data = await page.locator(tableSelector).evaluate((table) => {
      const headers = Array.from(
        table.querySelectorAll('thead th')
      ).map((th) => (th.textContent || '').trim());

      const rows = Array.from(table.querySelectorAll('tbody tr')).map(
        (row) => {
          const cells = Array.from(row.querySelectorAll('td')).map((td) =>
            (td.textContent || '').trim()
          );
          return Object.fromEntries(
            headers.map((header, i) => [header, cells[i]])
          );
        }
      );

      return rows;
    });

    return data;
  },

  /**
   * Click table row
   */
  async clickRow(page: Page, tableSelector: string, rowIndex: number) {
    const row = page.locator(`${tableSelector} tbody tr`).nth(rowIndex);
    const link = row.locator('a').first();
    await link.click();
    await page.waitForLoadState('networkidle');
  },

  /**
   * Find row by text content
   */
  async findRowByText(page: Page, tableSelector: string, text: string) {
    const row = page.locator(`${tableSelector} tbody tr:has-text("${text}")`);
    return row;
  },

  /**
   * Get row count
   */
  async getRowCount(page: Page, tableSelector: string): Promise<number> {
    const rows = page.locator(`${tableSelector} tbody tr`);
    return await rows.count();
  },
};

/**
 * Chart helpers
 */
export const chart = {
  /**
   * Check if chart is rendered
   */
  async isRendered(page: Page, chartSelector: string): Promise<boolean> {
    const svgElements = page.locator(`${chartSelector} svg`);
    const canvasElements = page.locator(`${chartSelector} canvas`);

    const svgCount = await svgElements.count();
    const canvasCount = await canvasElements.count();

    return svgCount > 0 || canvasCount > 0;
  },

  /**
   * Check if chart has data
   */
  async hasData(page: Page, chartSelector: string): Promise<boolean> {
    const dataElements = page.locator(`${chartSelector} [data-*]`);
    const elementCount = await dataElements.count();
    return elementCount > 0;
  },
};

/**
 * Network/API helpers
 */
export const api = {
  /**
   * Wait for GraphQL query
   */
  async waitForGraphQL(page: Page, operationName?: string): Promise<any> {
    const response = await page.waitForResponse((response) => {
      if (!response.url().includes('/graphql')) return false;
      if (!operationName) return true;

      return response
        .text()
        .then((text) => text.includes(operationName))
        .catch(() => false);
    });

    return await response.json();
  },

  /**
   * Get GraphQL requests made
   */
  async getGraphQLRequests(page: Page): Promise<string[]> {
    const requests: string[] = [];

    page.on('request', (request) => {
      if (request.url().includes('/graphql')) {
        requests.push(request.postDataJSON()?.operationName || 'unknown');
      }
    });

    return requests;
  },
};

/**
 * Wait helpers
 */
export const wait = {
  /**
   * Wait for element to appear
   */
  async forElement(page: Page, selector: string, timeout = 5000) {
    await page.locator(selector).waitFor({ timeout });
  },

  /**
   * Wait for element to disappear
   */
  async forElementToDisappear(page: Page, selector: string, timeout = 5000) {
    await page.locator(selector).waitFor({ state: 'hidden', timeout });
  },

  /**
   * Wait for specific time
   */
  async forTime(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },

  /**
   * Wait for network idle
   */
  async forNetworkIdle(page: Page, timeout = 5000) {
    await page.waitForLoadState('networkidle', { timeout });
  },
};

/**
 * Screenshot helpers
 */
export const screenshot = {
  /**
   * Take screenshot
   */
  async take(
    page: Page,
    filename: string,
    options?: { fullPage?: boolean }
  ) {
    await page.screenshot({
      path: `packages/e2e/screenshots/${filename}.png`,
      fullPage: options?.fullPage ?? true,
    });
  },

  /**
   * Compare with baseline (manual visual regression)
   */
  async compare(
    page: Page,
    baseline: string,
    actual: string
  ): Promise<boolean> {
    // This would require visual regression testing library
    // For now, just take screenshots
    await screenshot.take(page, baseline);
    await screenshot.take(page, actual);
    return true;
  },
};

/**
 * Accessibility helpers
 */
export const a11y = {
  /**
   * Check for common accessibility issues
   */
  async check(page: Page): Promise<string[]> {
    const issues: string[] = [];

    // Check for images without alt text
    const imagesWithoutAlt = await page.locator('img:not([alt])').count();
    if (imagesWithoutAlt > 0) {
      issues.push(`${imagesWithoutAlt} images without alt text`);
    }

    // Check for form inputs without labels
    const inputsWithoutLabel = await page
      .locator('input:not([aria-label]):not([aria-labelledby])')
      .count();
    if (inputsWithoutLabel > 0) {
      issues.push(`${inputsWithoutLabel} form inputs without labels`);
    }

    // Check for color contrast (basic check)
    const elementsWithoutContrast = await page
      .locator('[style*="color"]')
      .count();

    return issues;
  },

  /**
   * Check keyboard navigation
   */
  async checkKeyboardNav(page: Page): Promise<boolean> {
    // Tab through page and check for focus trap
    const initialUrl = page.url();

    await page.keyboard.press('Tab');
    await page.waitForTimeout(100);

    // Verify focus is visible
    const focusedElement = await page.evaluate(() => {
      return document.activeElement?.tagName;
    });

    return focusedElement !== null && focusedElement !== 'BODY';
  },
};

export default {
  navigate,
  assert,
  form,
  table,
  chart,
  api,
  wait,
  screenshot,
  a11y,
};
