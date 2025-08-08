# E2E Testing Guide

This document describes the End-to-End (E2E) testing framework implemented using **Puppeteer** and **Jest** for testing the calendar web application.

## Overview

The E2E testing framework provides comprehensive browser-based testing capabilities for the calendar application running at `http://localhost:5173`. It includes:

- **Puppeteer** for browser automation
- **Jest** as the test runner
- **Page Object Model** for maintainable test code
- **Custom utilities** for common testing operations
- **Screenshot capture** for visual debugging
- **Network monitoring** for API integration testing

## Project Structure

```
tests/e2e/
├── global-setup.js          # Global test environment setup
├── global-teardown.js       # Global test environment cleanup
├── setup.js                 # Test suite setup and utilities
├── pages/                   # Page Object Models
│   ├── BasePage.js         # Base page class with common methods
│   └── CalendarPage.js     # Calendar-specific page interactions
├── utils/                   # Utility classes
│   ├── browser-helpers.js  # Browser automation helpers
│   └── test-data.js        # Test data generation utilities
└── specs/                   # Test specifications
    ├── basic-setup.e2e.test.js
    └── home-page.e2e.test.js
```

## Configuration Files

- `jest-e2e.config.js` - Jest configuration for E2E tests
- `jest-puppeteer.config.js` - Puppeteer browser configuration
- `package.json` - Updated with E2E dependencies and scripts

## Prerequisites

1. **Node.js** >= 22.0.0
2. **Calendar Web Application** running at `http://localhost:5173`
3. **Calendar API** running (for full integration testing)

## Installation

The E2E testing dependencies are already included in `package.json`:

```bash
npm install
```

This will install:
- `puppeteer` - Browser automation
- `jest-puppeteer` - Jest preset for Puppeteer
- `expect-puppeteer` - Additional Jest matchers

## Running E2E Tests

### Basic Commands

```bash
# Run all E2E tests
npm run test:e2e

# Run E2E tests in watch mode
npm run test:e2e:watch

# Run E2E tests with debugging
npm run test:e2e:debug
```

### Advanced Options

```bash
# Run specific test file
npx jest --config=jest-e2e.config.js tests/e2e/specs/calendar-navigation.e2e.test.js

# Run tests with specific pattern
npx jest --config=jest-e2e.config.js --testNamePattern="should load"

# Run tests in headful mode (show browser)
CI=false npm run test:e2e

# Run tests with verbose output
npx jest --config=jest-e2e.config.js --verbose
```

## Test Categories

### 1. Basic Setup Tests (`basic-setup.e2e.test.js`)

Tests fundamental browser functionality:
- Browser launch and basic operations
- Page navigation with timeout handling
- Screenshot functionality
- Performance verification

### 2. Home Page Tests (`home-page.e2e.test.js`)

Tests application loading:
- Home page navigation and loading
- Page title and URL verification
- Fallback testing when application is not running
- Screenshot capture for verification

## Page Object Model

### BasePage Class

Provides common browser interaction methods:
- `goto(path)` - Navigate to a page
- `click(selector)` - Click an element
- `type(selector, text)` - Type text into an input
- `waitForSelector(selector)` - Wait for element to appear
- `takeScreenshot(name)` - Capture screenshot
- `isVisible(selector)` - Check if element is visible

### CalendarPage Class

Extends BasePage with calendar-specific methods:
- `waitForCalendarToLoad()` - Wait for calendar to initialize
- `createEvent(eventData)` - Create a new event
- `getEvents()` - Get all visible events
- `navigateToNextPeriod()` - Navigate to next time period
- `switchToMonthView()` - Switch to month view

## Utility Classes

### BrowserHelpers

Advanced browser automation utilities:
- Network request monitoring
- API response mocking
- Console log capture
- Screenshot management
- Local storage manipulation

### TestData

Test data generation utilities:
- `generateEventData()` - Create sample event data
- `generateInvalidEventData()` - Create invalid data for testing
- `cleanupTestEvents()` - Remove test data after tests

## Configuration

### Browser Configuration

The browser is configured in `jest-puppeteer.config.js`:
- **Headless mode** in CI, visible browser in development
- **Viewport** set to 1280x720
- **Slow motion** enabled in development for visibility
- **Security flags** for testing environment

### Test Timeouts

- **Global timeout**: 60 seconds for browser operations
- **Page load timeout**: 30 seconds
- **Element wait timeout**: 10 seconds

## Screenshots

Screenshots are automatically captured:
- **On test failures** for debugging
- **At key test points** for verification
- **Stored in** `screenshots/` directory

## Best Practices

### Writing Tests

1. **Use Page Object Model** - Keep selectors and interactions in page classes
2. **Wait for elements** - Always wait for elements before interacting
3. **Handle dynamic content** - Use appropriate waits for loading states
4. **Clean up test data** - Remove test data after tests complete
5. **Take screenshots** - Capture visual evidence at key points

### Selectors

The framework uses flexible selectors that work with various implementations:
```javascript
// Multiple selector options for robustness
addEventButton: '.add-event, .create-event, [data-testid="add-event-button"]'
```

### Error Handling

Tests are designed to be resilient:
- **Graceful degradation** when elements don't exist
- **Conditional testing** based on available features
- **Comprehensive logging** for debugging

## Debugging

### Visual Debugging

1. **Run in headful mode**: `CI=false npm run test:e2e`
2. **Enable slow motion**: Configured automatically in development
3. **Check screenshots**: Review captured screenshots in `screenshots/`

### Console Debugging

1. **Monitor console logs**: Automatically captured during tests
2. **Network monitoring**: Track API requests and responses
3. **Verbose output**: Use `--verbose` flag for detailed test output

### Common Issues

1. **Element not found**: Check if selectors match the actual application
2. **Timeout errors**: Increase timeouts or improve wait conditions
3. **Network issues**: Ensure the web application is running at `http://localhost:5173`

## Integration with Existing Tests

The E2E framework integrates with your existing API testing setup:
- **Shares API client** for backend operations
- **Uses same test data patterns** for consistency
- **Maintains separate test suites** to avoid conflicts

## Continuous Integration

For CI/CD environments:
- Tests run in **headless mode** automatically
- **Screenshots** captured on failures
- **Parallel execution** disabled to avoid conflicts
- **Network timeouts** configured for CI environment

## Extending the Framework

### Adding New Page Objects

1. Create new page class extending `BasePage`
2. Define selectors for the page elements
3. Implement page-specific interaction methods
4. Export the class for use in tests

### Adding New Test Utilities

1. Add utility functions to existing classes
2. Create new utility classes as needed
3. Follow the established patterns for consistency
4. Document new utilities in this README

### Adding New Test Suites

1. Create new test files in `tests/e2e/specs/`
2. Follow the naming convention: `*.e2e.test.js`
3. Use the established test structure and patterns
4. Include appropriate setup and cleanup

## Troubleshooting

### Common Solutions

1. **Clear browser cache**: Tests start with clean browser state
2. **Check application state**: Ensure the web app is running and accessible
3. **Update selectors**: Modify selectors if the UI has changed
4. **Increase timeouts**: Adjust timeouts for slower environments

### Getting Help

1. **Check console output**: Review test logs for error details
2. **Examine screenshots**: Visual evidence of test state
3. **Review network logs**: Check API interactions
4. **Run individual tests**: Isolate problematic tests

## Performance Considerations

- **Sequential execution**: Tests run one at a time to avoid conflicts
- **Resource cleanup**: Browser instances are properly cleaned up
- **Selective testing**: Run specific test suites as needed
- **Timeout optimization**: Balanced timeouts for reliability and speed

---

This E2E testing framework provides comprehensive coverage of your calendar application's user interface and interactions, ensuring a robust and reliable user experience.
