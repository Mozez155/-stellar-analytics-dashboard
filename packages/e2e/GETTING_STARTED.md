# Getting Started with E2E Tests - Checklist

## ✅ Phase 1: Installation & Setup (5 minutes)

- [ ] Navigate to project root
  ```bash
  cd /workspaces/-stellar-analytics-dashboard
  ```

- [ ] Install E2E dependencies
  ```bash
  pnpm install
  ```

- [ ] Install Playwright browsers
  ```bash
  pnpm --filter @stellar-analytics/e2e exec playwright install --with-deps
  ```

- [ ] Verify installation
  ```bash
  pnpm --filter @stellar-analytics/e2e exec playwright --version
  ```

## ✅ Phase 2: Environment Setup (5 minutes)

- [ ] Copy environment template
  ```bash
  cp packages/e2e/.env.example packages/e2e/.env.local
  ```

- [ ] Verify database setup
  ```bash
  psql -d stellar_analytics_dev -U stellar_user
  ```

- [ ] Create test user in database (if not exists)
  ```sql
  INSERT INTO users (email, password_hash, name, role, created_at)
  VALUES ('test@example.com', 'hashed_password', 'Test User', 'user', NOW());
  ```

- [ ] Verify services can start
  ```bash
  pnpm dev
  # Wait for services to start, then Ctrl+C
  ```

## ✅ Phase 3: Run Tests Locally (10 minutes)

### Terminal 1: Start Services
- [ ] Start all services
  ```bash
  pnpm dev
  ```
- [ ] Wait for output showing all services running

### Terminal 2: Run Tests
- [ ] Run tests in UI mode (recommended for first time)
  ```bash
  pnpm test:e2e:ui
  ```
  
  **Or** run tests in headless mode
  ```bash
  pnpm test:e2e
  ```

- [ ] View test results
  ```bash
  pnpm --filter @stellar-analytics/e2e exec playwright show-report
  ```

## ✅ Phase 4: Explore Capabilities (15 minutes)

Try different ways to run tests:

- [ ] Debug mode (interactive)
  ```bash
  pnpm test:e2e:debug
  ```

- [ ] Headed mode (see browser)
  ```bash
  pnpm test:e2e:headed
  ```

- [ ] Run specific test file
  ```bash
  pnpm test:e2e -- auth.spec.ts
  ```

- [ ] Run specific test by name
  ```bash
  pnpm test:e2e -- --grep "should login"
  ```

- [ ] Generate test code (record test interactions)
  ```bash
  pnpm test:e2e:codegen
  ```

## ✅ Phase 5: Validate CI/CD (5 minutes)

- [ ] Check CI workflows are in place
  ```bash
  ls .github/workflows/e2e*.yml
  ```

- [ ] Expected files:
  - `.github/workflows/e2e-tests.yml` ✅
  - `.github/workflows/e2e-cross-browser.yml` ✅

- [ ] Verify GitHub workflows are enabled
  - Go to repository settings
  - Check Actions > General
  - Verify "Enable local and third party Actions for this repository" is checked

- [ ] Create a test pull request to verify CI
  ```bash
  git checkout -b test/e2e-verification
  git add .
  git commit -m "test: verify e2e tests in ci"
  git push origin test/e2e-verification
  # Create PR in GitHub UI
  ```

## 📚 Phase 6: Learn Documentation (20 minutes)

Read documentation in order:

1. **[README.md](./README.md)** (5 min)
   - Quick start guide
   - Common commands
   - Key files overview

2. **[E2E_TESTING_GUIDE.md](./E2E_TESTING_GUIDE.md)** (10 min)
   - Comprehensive guide
   - Test coverage details
   - Best practices
   - Debugging techniques

3. **[LOCATORS_AND_ATTRIBUTES.md](./LOCATORS_AND_ATTRIBUTES.md)** (5 min)
   - How to select elements
   - Data attribute recommendations
   - Component patterns

## 🔧 Phase 7: Update Components (optional)

Add `data-testid` attributes to components for better test selectors:

- [ ] Update login form
  ```tsx
  <input data-testid="email-input" type="email" />
  <input data-testid="password-input" type="password" />
  <button data-testid="login-button" type="submit">Login</button>
  ```

- [ ] Update navigation
  ```tsx
  <nav data-testid="main-nav">
    <Link data-testid="nav-dashboard" to="/">Dashboard</Link>
    {/* other links */}
  </nav>
  ```

- [ ] Update tables
  ```tsx
  <table data-testid="transactions-table">
    {/* table content */}
  </table>
  ```

See [LOCATORS_AND_ATTRIBUTES.md](./LOCATORS_AND_ATTRIBUTES.md) for full examples.

## 🚀 Phase 8: Write Your First Test

Create a new test file:

```typescript
// tests/my-feature.spec.ts
import { test, expect } from './fixtures/auth';

test.describe('My Feature', () => {
  test('should do something', async ({ authenticatedPage }) => {
    const page = authenticatedPage;
    
    // Your test here
    await page.goto('/');
    await expect(page.locator('main')).toBeVisible();
  });
});
```

Run your test:
```bash
pnpm test:e2e -- my-feature.spec.ts
```

## 📋 Phase 9: Integrate with Team Workflow

- [ ] Share with team: Copy [README.md](./README.md) link
- [ ] Set up pre-commit hook to run tests
- [ ] Add E2E tests to PR checklist
- [ ] Configure branch protection rules to require E2E tests
- [ ] Set up Slack notification for CI failures

## 🎯 Phase 10: Continuous Improvement

- [ ] Review test results regularly
- [ ] Add tests for new features
- [ ] Improve flaky tests (see [TROUBLESHOOTING.md](./TROUBLESHOOTING.md))
- [ ] Monitor test performance
- [ ] Update test data as needed
- [ ] Share learnings with team

## 📊 Success Indicators

You'll know it's working when:

✅ `pnpm test:e2e` runs all 46 tests
✅ Tests run in < 5 minutes locally
✅ HTML report shows all tests passing
✅ CI runs E2E tests on every PR
✅ Team can run `pnpm test:e2e:ui` and see visual UI
✅ New test failures are caught before production

## 🆘 If Something Goes Wrong

1. **Check Troubleshooting Guide**
   ```bash
   cat packages/e2e/TROUBLESHOOTING.md
   ```

2. **Verify services are running**
   ```bash
   curl http://localhost:5173
   curl http://localhost:4000/graphql
   ```

3. **Check database connection**
   ```bash
   psql -d stellar_analytics_dev -U stellar_user
   ```

4. **Run test with debug flag**
   ```bash
   pnpm test:e2e:debug
   ```

5. **View full test output**
   ```bash
   pnpm test:e2e -- --reporter=verbose
   ```

6. **Check browser console for errors**
   - View test report
   - Click on failed test
   - Check console output

## 💡 Pro Tips

1. **Use UI Mode for Development**
   ```bash
   pnpm test:e2e:ui
   ```
   - Visual test playground
   - Run individual tests
   - Step through code
   - See browser in real-time

2. **Generate Test Code Quickly**
   ```bash
   pnpm test:e2e:codegen
   ```
   - Record user interactions
   - Auto-generates selectors
   - Great for learning

3. **Debug Specific Tests**
   ```bash
   pnpm test:e2e:debug -- auth.spec.ts
   ```
   - Step through test
   - Inspect DOM
   - Execute console commands

4. **Use Helpers for Common Tasks**
   ```typescript
   import { navigate, assert, form } from './helpers';
   
   await navigate.toPage(page, 'Accounts');
   await assert.isVisible(page, '[data-testid="table"]');
   ```

5. **Monitor Test Trends**
   - Save test runs over time
   - Track flaky tests
   - Monitor performance

## 🎓 Learning Resources

- **[Playwright Documentation](https://playwright.dev)** - Official docs
- **[Playwright Best Practices](https://playwright.dev/docs/best-practices)** - Best practices
- **[Locator API](https://playwright.dev/docs/locators)** - Element selection
- **[Debugging Guide](https://playwright.dev/docs/debug)** - Debugging techniques

## 🤝 Next Steps

1. ✅ Install and run tests locally
2. ✅ Explore test capabilities
3. ✅ Read documentation
4. ✅ Write your first test
5. ✅ Share with team
6. ✅ Integrate with CI/CD
7. ✅ Add tests for new features
8. ✅ Monitor and improve

## 📞 Support

Having issues?

1. **Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Most common issues covered
2. **Check GitHub Issues** - Playwright known issues
3. **Run with debug flag** - `pnpm test:e2e:debug`
4. **Check CI logs** - GitHub Actions workflow logs
5. **View test report** - `playwright show-report`

---

**Ready to start?** → `pnpm install && pnpm test:e2e:ui`
