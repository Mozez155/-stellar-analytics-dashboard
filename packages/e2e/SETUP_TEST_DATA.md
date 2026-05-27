# Setup Test Data & Database

## Pre-requisites

Before running E2E tests, ensure:

1. **Services running**
```bash
pnpm dev
```

2. **Database migrated**
```bash
pnpm --filter @stellar-analytics/api exec npm run migrate
```

3. **Test user created**
```bash
# Create test user via GraphQL mutation
pnpm --filter @stellar-analytics/api exec npm run seed-test-data
```

## Creating Test Users

### Option 1: Via GraphQL

```graphql
mutation {
  signup(
    email: "test@example.com"
    password: "TestPassword123!"
    name: "Test User"
  ) {
    user {
      id
      email
      name
      role
    }
    token
  }
}
```

### Option 2: Via Database

```sql
INSERT INTO users (email, password_hash, name, role, created_at)
VALUES (
  'test@example.com',
  'hashed-password-here',
  'Test User',
  'user',
  NOW()
);
```

### Option 3: Via Seed Script

```bash
# Create seed file: packages/api/src/scripts/seed-test-data.ts
pnpm --filter @stellar-analytics/api exec ts-node src/scripts/seed-test-data.ts
```

## Sample Test Data

### Transactions
```graphql
mutation {
  createTransaction(input: {
    sourceAccount: "GCXVLRYPFQN2FLAEFZ3O7YBXABRX6ICWDJN27ZPKZ7JNAJWHBXCZ5HQ"
    destinationAccount: "GBQCBYUXOFR4CVKBXLXIWB2DUSN35PMHRDQXZMKXAAVQJCX3ZCXWKAB"
    amount: "100.00"
    asset: "USD"
  }) {
    id
    hash
  }
}
```

### Ledgers
```graphql
mutation {
  createLedger(input: {
    sequence: 1000
    timestamp: "2024-01-01T00:00:00Z"
    transactionCount: 50
  }) {
    id
    sequence
  }
}
```

### Accounts
```graphql
mutation {
  createAccount(input: {
    address: "GCXVLRYPFQN2FLAEFZ3O7YBXABRX6ICWDJN27ZPKZ7JNAJWHBXCZ5HQ"
    name: "Test Account"
    balance: "1000.00"
  }) {
    id
    address
  }
}
```

## Resetting Test Data

### Clear all test data
```bash
# Via API
pnpm --filter @stellar-analytics/api exec npm run reset-db

# Via direct database query
psql -d stellar_analytics_dev -c "TRUNCATE TABLE transactions, ledgers, accounts CASCADE;"
```

### Restore to initial state
```bash
# Re-run migrations
pnpm --filter @stellar-analytics/api exec npm run migrate
```

## Authentication Setup

The E2E tests use the `authenticatedPage` fixture which automatically handles login:

```typescript
test('authenticated test', async ({ authenticatedPage }) => {
  // User is automatically logged in
  const page = authenticatedPage;
  
  // Use the page...
});
```

### Custom Login

For custom authentication scenarios:

```typescript
import { loginViaGraphQL, clearAuth } from './fixtures/auth';

test('custom auth', async ({ page }) => {
  // Manual login
  await loginViaGraphQL(page, 'user@example.com', 'password');
  
  // Or clear auth
  await clearAuth(page);
});
```

## Environment Variables

Create `.env.local` in `packages/e2e/`:

```env
BASE_URL=http://localhost:5173
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=TestPassword123!
API_URL=http://localhost:4000/graphql
DATABASE_URL=postgresql://stellar_user:stellar_password@localhost:5432/stellar_analytics_dev
```

## Debugging Database Issues

### Check database connection
```bash
psql -d stellar_analytics_dev -U stellar_user
```

### View tables
```bash
\dt
```

### View test data
```bash
SELECT * FROM users WHERE email = 'test@example.com';
SELECT * FROM transactions LIMIT 5;
SELECT * FROM accounts LIMIT 5;
```

## Seeding Strategies

### Minimal Setup
- Create 1 test user
- Minimal transactions
- Fast, suitable for CI

### Standard Setup
- Create test user with profile
- 10-20 sample transactions
- 5 sample ledgers
- Suitable for development

### Comprehensive Setup
- Multiple test users with different roles
- Full transaction history
- Complete ledger data
- Use for performance testing

See `packages/api/src/scripts/` for seed implementation details.
