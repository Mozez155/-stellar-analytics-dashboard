# Test Locators and Data Attributes

This guide explains the recommended locators for E2E testing and data attributes to add to components.

## Recommended Data Attributes

Add these `data-testid` attributes to your components for robust test selectors:

### Login Page
```tsx
<input data-testid="email-input" type="email" />
<input data-testid="password-input" type="password" />
<button data-testid="login-button" type="submit">Login</button>
<div data-testid="error-message" role="alert">{error}</div>
```

### Navigation
```tsx
<nav data-testid="main-nav">
  <Link data-testid="nav-dashboard" to="/">Dashboard</Link>
  <Link data-testid="nav-network" to="/network">Network</Link>
  <Link data-testid="nav-accounts" to="/accounts">Accounts</Link>
  <Link data-testid="nav-transactions" to="/transactions">Transactions</Link>
  <Link data-testid="nav-ledgers" to="/ledgers">Ledgers</Link>
  <Link data-testid="nav-assets" to="/assets">Assets</Link>
  <Link data-testid="nav-search" to="/search">Search</Link>
</nav>

<div data-testid="user-menu">
  <button data-testid="user-menu-button">Profile</button>
  <button data-testid="logout-button">Logout</button>
</div>
```

### Search
```tsx
<input data-testid="search-input" type="search" placeholder="Search..." />
<div data-testid="search-results">
  {/* Results */}
</div>
```

### Dashboard Cards
```tsx
<div data-testid="metric-card">
  <div data-testid="metric-label">Total Transactions</div>
  <div data-testid="metric-value">1,234</div>
</div>
```

### Tables
```tsx
<table data-testid="transactions-table">
  <thead>
    <tr>
      <th data-testid="col-hash">Hash</th>
      <th data-testid="col-type">Type</th>
      <th data-testid="col-amount">Amount</th>
    </tr>
  </thead>
  <tbody>
    <tr data-testid="transaction-row-{id}">
      <td>
        <Link data-testid="transaction-link-{id}" to={`/transactions/${id}`}>
          {hash}
        </Link>
      </td>
    </tr>
  </tbody>
</table>
```

### Detail Pages
```tsx
<div data-testid="detail-page">
  <h1 data-testid="detail-title">{title}</h1>
  <div data-testid="detail-content">
    {/* Content */}
  </div>
  <button data-testid="back-button" onClick={() => navigate(-1)}>
    Back
  </button>
</div>

<div data-testid="error-message" role="alert">
  Item not found
</div>
```

### Charts
```tsx
<div data-testid="transaction-chart">
  <ResponsiveLineChart data={data} />
</div>

<div data-testid="network-chart">
  <ResponsiveBarChart data={data} />
</div>
```

## Locator Examples

### By Test ID (RECOMMENDED)
```typescript
page.locator('[data-testid="login-button"]')
page.locator('[data-testid="transactions-table"]')
page.locator('[data-testid="transaction-row-123"]')
```

### By Label Text
```typescript
page.locator('button:has-text("Login")')
page.locator('a:has-text("Transactions")')
```

### By Placeholder
```typescript
page.locator('input[placeholder="Search..."]')
```

### By Role
```typescript
page.locator('[role="button"]')
page.locator('[role="alert"]')
page.locator('[role="navigation"]')
```

### Complex Selectors
```typescript
// Find input with label
page.locator('label:has-text("Email") + input')

// Find button in toolbar
page.locator('[role="toolbar"] button')

// Find table cell in specific row
page.locator('table tbody tr:has-text("value") td:nth-child(2)')
```

## Best Practices

### ✅ DO

```typescript
// Clear, specific locators
page.locator('[data-testid="login-button"]')
page.locator('input[type="email"]')
page.locator('button:has-text("Submit")')

// Semantic HTML
page.locator('nav a:has-text("Home")')
page.locator('[role="alert"]')

// Descriptive names
[data-testid="submit-button"]
[data-testid="error-message"]
```

### ❌ DON'T

```typescript
// Fragile selectors
page.locator('div.container div span:nth-child(3)')
page.locator('button:nth-of-type(2)')

// Whitespace issues
page.locator('text=Click Me')  // Better: :has-text()

// Implementation details
page.locator('.ant-btn')
page.locator('.styled-components-hash')
```

## Testing Data Attributes

### Add to Components
```tsx
// src/components/Button.tsx
export function Button({ children, testId, ...props }) {
  return (
    <button data-testid={testId} {...props}>
      {children}
    </button>
  );
}

// Usage
<Button testId="login-button">Login</Button>
```

### Create a Helper
```typescript
// src/test-utils/selectors.ts
export const selectors = {
  auth: {
    emailInput: '[data-testid="email-input"]',
    passwordInput: '[data-testid="password-input"]',
    loginButton: '[data-testid="login-button"]',
    errorMessage: '[data-testid="error-message"]',
  },
  nav: {
    mainNav: '[data-testid="main-nav"]',
    dashboard: '[data-testid="nav-dashboard"]',
    transactions: '[data-testid="nav-transactions"]',
    userMenu: '[data-testid="user-menu"]',
    logoutButton: '[data-testid="logout-button"]',
  },
  table: {
    transactionsTable: '[data-testid="transactions-table"]',
    transactionRow: (id) => `[data-testid="transaction-row-${id}"]`,
    transactionLink: (id) => `[data-testid="transaction-link-${id}"]`,
  },
};

// Usage in tests
page.locator(selectors.auth.loginButton).click();
page.locator(selectors.table.transactionLink('123')).click();
```

## Accessibility Attributes

Use semantic HTML and ARIA attributes:

```tsx
// Form
<form role="form" aria-label="Login Form">
  <label htmlFor="email">Email</label>
  <input id="email" type="email" aria-required="true" />
  <span role="alert">{error}</span>
</form>

// Navigation
<nav role="navigation" aria-label="Main Navigation">
  {/* Links */}
</nav>

// Table
<table role="table" aria-label="Transactions">
  <caption>Recent Transactions</caption>
</table>

// Status
<div role="status" aria-live="polite" aria-atomic="true">
  Loading data...
</div>
```

These attributes help both accessibility and test selectors:

```typescript
// Can use ARIA attributes in selectors
page.locator('[aria-label="Main Navigation"]')
page.locator('[role="status"]')
page.locator('[aria-required="true"]')
```

## Dynamic IDs

For items with dynamic IDs (transactions, accounts, etc.):

```typescript
// Instead of
[data-testid="transaction-5f4a2c"]

// Use data attributes
<tr data-testid="transaction-row" data-id="5f4a2c">

// Or selector with partial match
page.locator('[data-testid="transaction-row-123"]')

// Or use text content
page.locator('table tbody tr:has-text("USD")')
```

## Performance Optimization

Use CSS selectors (faster):
```typescript
page.locator('[data-testid="button"]')  // CSS - faster
page.locator('text="Click Me"')          // Text - slower
```

Cache frequently used locators:
```typescript
const button = page.locator('[data-testid="login-button"]');
await button.click();
await expect(button).toBeDisabled();
```
