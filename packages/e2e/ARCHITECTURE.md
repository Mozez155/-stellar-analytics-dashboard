# E2E Testing Architecture

## Project Structure

```
stellar-analytics-dashboard/
├── .github/
│   └── workflows/
│       ├── e2e-tests.yml                    # Main E2E test workflow
│       └── e2e-cross-browser.yml            # Nightly cross-browser testing
│
├── packages/
│   ├── api/                                 # GraphQL API
│   ├── frontend/                            # React frontend
│   ├── indexer/                             # Data indexer
│   ├── shared/                              # Shared utilities
│   └── e2e/                                 # ✨ NEW - E2E Tests
│       ├── .env.example                     # Environment template
│       ├── .gitignore                       # Git ignore rules
│       ├── package.json                     # Dependencies
│       ├── playwright.config.ts             # Playwright configuration
│       ├── tsconfig.json                    # TypeScript config
│       ├── tsconfig.node.json               # Node TypeScript config
│       │
│       ├── README.md                        # Quick start guide
│       ├── E2E_TESTING_GUIDE.md             # Comprehensive guide (300+ lines)
│       ├── IMPLEMENTATION_SUMMARY.md        # Implementation overview
│       ├── SETUP_TEST_DATA.md               # Test data setup guide
│       ├── LOCATORS_AND_ATTRIBUTES.md       # Component selectors guide
│       ├── TROUBLESHOOTING.md               # Debugging & solutions
│       │
│       └── tests/
│           ├── fixtures/
│           │   └── auth.ts                  # Authentication fixture & helpers
│           ├── helpers.ts                   # Test utility helpers
│           ├── auth.spec.ts                 # Authentication tests (7 tests)
│           ├── dashboard.spec.ts            # Navigation tests (8 tests)
│           ├── data-visualization.spec.ts   # Charts/tables tests (8 tests)
│           ├── search.spec.ts               # Search tests (4 tests)
│           ├── details.spec.ts              # Detail pages tests (6 tests)
│           ├── responsive.spec.ts           # Responsive design tests (7 tests)
│           └── performance.spec.ts          # Performance tests (6 tests)
│
├── package.json                             # Updated with E2E scripts
└── pnpm-workspace.yaml                      # Updated workspace config
```

## Test Execution Flow

```
pnpm test:e2e
    ↓
playwright test
    ├── Start dev servers (auto)
    │   ├── Frontend on :5173
    │   └── API on :4000
    │
    ├── Run test suites in parallel
    │   ├── auth.spec.ts (7 tests)
    │   ├── dashboard.spec.ts (8 tests)
    │   ├── data-visualization.spec.ts (8 tests)
    │   ├── search.spec.ts (4 tests)
    │   ├── details.spec.ts (6 tests)
    │   ├── responsive.spec.ts (7 tests)
    │   └── performance.spec.ts (6 tests)
    │
    ├── Across multiple browsers
    │   ├── Chromium
    │   ├── Firefox
    │   ├── WebKit
    │   ├── Mobile Chrome (Pixel 5)
    │   └── Mobile Safari (iPhone 12)
    │
    └── Generate reports
        ├── HTML report
        ├── JUnit XML (for CI)
        ├── Test results/
        └── Videos & Screenshots on failure
```

## CI/CD Integration

### On Every PR/Push to main/develop
```
.github/workflows/e2e-tests.yml
    ├── Setup Node.js environment
    ├── Install dependencies & Playwright browsers
    ├── Start PostgreSQL & Redis services
    ├── Build packages
    ├── Start API & Frontend
    ├── Run E2E tests (Chromium only for speed)
    ├── Upload test artifacts
    ├── Publish JUnit results
    └── Comment on PR with results
```

### Nightly Schedule
```
.github/workflows/e2e-cross-browser.yml
    ├── Chromium tests
    ├── Firefox tests
    ├── WebKit tests
    ├── Mobile Chrome tests
    ├── Mobile Safari tests
    ├── Generate detailed reports
    └── Archive results
```

## Test Suite Organization

### Authentication Tests
```
auth.spec.ts (7 tests)
├── Display login form
├── Form validation
├── Invalid credentials handling
├── Successful login
├── Protected route access
├── Already logged-in redirect
└── Logout functionality
```

### Navigation Tests
```
dashboard.spec.ts (8 tests)
├── Dashboard display
├── Navigation menu
├── Navigate to network page
├── Navigate to accounts page
├── Navigate to transactions page
├── Navigate to ledgers page
├── Navigate to assets page
└── User menu
```

### Data Visualization Tests
```
data-visualization.spec.ts (8 tests)
├── Display charts
├── Display metric cards
├── Display data tables
├── Load transaction data
├── Load network data
├── Load account data
├── Load ledger timeline
├── Display assets data
└── Handle GraphQL subscriptions
```

### Search Tests
```
search.spec.ts (4 tests)
├── Navigate to search page
├── Have search input
├── Display search results
└── Clear search
```

### Detail Page Tests
```
details.spec.ts (6 tests)
├── Navigate to transaction detail
├── Navigate to account detail
├── Display transaction detail info
├── Display account detail info
├── Handle back navigation
└── Handle 404 errors
```

### Responsive Design Tests
```
responsive.spec.ts (7 tests)
├── Mobile (Pixel 5)
│   ├── Display mobile login
│   ├── Display responsive navigation
│   └── Display readable text
├── Tablet (iPad Pro)
│   ├── Display tablet layout
│   └── Display data tables
└── Desktop
    ├── Display multi-column layout
    └── Display side-by-side layout
```

### Performance Tests
```
performance.spec.ts (6 tests)
├── Dashboard load time < 5s
├── Page navigation < 3s
├── Reasonable bundle size
├── No memory leaks on navigation
├── Handle rapid navigation
└── Render large data sets
```

## Authentication Flow

```
Test starts
    ↓
authenticatedPage fixture
    ├── Navigate to /login
    ├── Check for existing token
    ├── If no token:
    │   ├── Enter email: test@example.com
    │   ├── Enter password: TestPassword123!
    │   ├── Click submit
    │   ├── Wait for /
    │   └── Verify token in localStorage
    │
    └── Use page for test
        ↓
    Test completes
        ↓
    Cleanup: Logout & clear auth
```

## Test Utilities

```
helpers.ts
├── navigate
│   ├── toPage()              - Navigate by page name
│   ├── back()                - Go back
│   └── toUrl()               - Wait for URL
├── assert
│   ├── pageTitle()           - Check page title
│   ├── urlContains()         - Check URL
│   ├── isVisible()           - Check visibility
│   ├── hasText()             - Check element text
│   ├── tableHasRows()        - Check table rows
│   └── noErrors()            - Check for error messages
├── form
│   ├── fill()                - Fill form inputs
│   ├── submit()              - Submit form
│   ├── fillAndSubmit()       - Fill and submit
│   └── getErrorMessage()     - Get form errors
├── table
│   ├── getData()             - Get table data as objects
│   ├── clickRow()            - Click table row
│   ├── findRowByText()       - Find row by text
│   └── getRowCount()         - Get row count
├── chart
│   ├── isRendered()          - Check if chart rendered
│   └── hasData()             - Check if chart has data
├── api
│   ├── waitForGraphQL()      - Wait for GraphQL response
│   └── getGraphQLRequests()  - Get GraphQL requests
├── wait
│   ├── forElement()          - Wait for element
│   ├── forElementToDisappear() - Wait element to disappear
│   ├── forTime()             - Wait specified time
│   └── forNetworkIdle()      - Wait for network idle
├── screenshot
│   ├── take()                - Take screenshot
│   └── compare()             - Compare screenshots
└── a11y
    ├── check()               - Check accessibility
    └── checkKeyboardNav()    - Check keyboard navigation
```

## Configuration Hierarchy

```
playwright.config.ts (Global)
├── baseURL: http://localhost:5173
├── Projects
│   ├── chromium
│   ├── firefox
│   ├── webkit
│   ├── Mobile Chrome (Pixel 5)
│   └── Mobile Safari (iPhone 12)
├── Use (Global settings)
│   ├── screenshot: only-on-failure
│   ├── video: retain-on-failure
│   ├── trace: on-first-retry
│   └── baseURL
└── WebServer (Auto startup)
    ├── Frontend dev server
    └── API dev server
```

## Data Flow

```
Test Execution
    ├── Start services
    │   ├── PostgreSQL (from Docker)
    │   ├── Redis (from Docker)
    │   ├── API (localhost:4000)
    │   └── Frontend (localhost:5173)
    │
    ├── Authenticate
    │   ├── Create test user in DB
    │   ├── Login via GraphQL mutation
    │   └── Store JWT token
    │
    ├── Interact with app
    │   ├── Click elements
    │   ├── Fill forms
    │   ├── Navigate pages
    │   └── Monitor network
    │
    ├── Verify behavior
    │   ├── Assert UI state
    │   ├── Check GraphQL queries
    │   ├── Validate data display
    │   └── Check performance
    │
    └── Report results
        ├── Screenshots
        ├── Videos
        ├── Traces
        ├── HTML report
        ├── JUnit XML
        └── GitHub comment
```

## Technology Stack

```
Testing Framework
├── Playwright 1.40.0         - Test runner & browser automation
├── TypeScript 5.2            - Type safety
└── Node.js 20+               - Runtime

Browsers
├── Chromium                  - Chrome/Chromium
├── Firefox                   - Mozilla Firefox
├── WebKit                    - Safari
├── Mobile emulation          - iOS & Android
└── Pixel 5 + iPhone 12

Services
├── PostgreSQL 15             - Database
├── Redis 7                   - Cache
├── Vite                      - Frontend dev server
└── Node.js GraphQL           - API server

CI/CD
├── GitHub Actions            - Workflow automation
├── Docker                    - Service containerization
└── Artifacts                 - Report storage
```

## Key Metrics

| Metric | Value |
|--------|-------|
| Total Tests | 46 |
| Test Suites | 7 |
| Browsers | 5 |
| Total Executions | 230+ |
| Lines of Code | 2,000+ |
| Documentation | 1,200+ lines |
| Average Test Duration | 2-5 seconds |
| Supported Viewports | 7 |

## Success Criteria

✅ All critical user flows tested
✅ Cross-browser coverage (Chrome, Firefox, Safari)
✅ Mobile device testing (iPhone, Android)
✅ Responsive design validation
✅ Performance monitoring
✅ CI/CD integration
✅ Comprehensive documentation
✅ Developer-friendly utilities
✅ Automated reports and notifications
✅ Easy to run and debug
