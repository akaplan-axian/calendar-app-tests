# Contributing Guide

Thank you for your interest in contributing to the Calendar App Tests project! This guide will help you get started with contributing to the test suite.

## Getting Started

### Prerequisites

- Node.js 22+ (specified in `.nvmrc`)
- Git for version control
- Access to the calendar-app-api server for testing

### Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/akaplan-axian/calendar-app-tests.git
   cd calendar-app-tests
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment**:
   ```bash
   # Use the correct Node.js version
   nvm use
   
   # Set environment variables if needed
   export API_SERVER_URL=http://localhost:3000
   export FRONTEND_URL=http://localhost:5173
   ```

4. **Verify setup**:
   ```bash
   # Run tests to ensure everything works
   npm test
   ```

## Project Structure

Understanding the project structure will help you contribute effectively:

```
calendar-app-tests/
├── docs/                       # Documentation
├── src/                        # Source utilities
│   ├── config/                 # Configuration files
│   └── utils/                  # Utility classes
├── tests/                      # Test suites
│   ├── api/                    # API endpoint tests
│   ├── e2e/                    # End-to-end tests
│   └── integration/            # Integration tests
└── screenshots/                # E2E test screenshots
```

## Contributing Guidelines

### Code Style

1. **Follow existing patterns**: Maintain consistency with existing code style
2. **Use meaningful names**: Choose descriptive variable and function names
3. **Add comments**: Document complex logic and test scenarios
4. **Keep tests focused**: Each test should verify a specific behavior

### Test Writing Standards

#### API Tests

1. **Schema validation**: Always validate responses against OpenAPI schemas
2. **Test both success and error cases**: Include positive and negative scenarios
3. **Use global utilities**: Leverage `global.apiClient` and `global.schemaValidator`
4. **Follow naming conventions**: Use descriptive test names

Example:
```javascript
describe('Events API', () => {
  test('should create a new event with valid data', async () => {
    const eventData = {
      title: 'Test Event',
      startDate: '2024-12-01T10:00:00.000Z',
      endDate: '2024-12-01T11:00:00.000Z'
    };
    
    const response = await global.apiClient.post('/api/events', eventData);
    
    expect(response.status).toBe(201);
    expect(response.data).toMatchOpenAPISchema('/api/events', 'post', 201);
    expect(response.data.event.title).toBe(eventData.title);
  });
});
```

#### E2E Tests

1. **Use Page Object Model**: Keep selectors and interactions in page classes
2. **Wait for elements**: Always wait for elements before interacting
3. **Handle dynamic content**: Use appropriate waits for loading states
4. **Clean up test data**: Remove test data after tests complete
5. **Take screenshots**: Capture visual evidence at key points

Example:
```javascript
describe('Calendar Navigation', () => {
  test('should navigate to next month', async () => {
    const calendarPage = new CalendarPage();
    await calendarPage.goto('/');
    await calendarPage.waitForCalendarToLoad();
    
    const currentMonth = await calendarPage.getCurrentMonth();
    await calendarPage.navigateToNextPeriod();
    const newMonth = await calendarPage.getCurrentMonth();
    
    expect(newMonth).not.toBe(currentMonth);
    await calendarPage.takeScreenshot('next-month-navigation');
  });
});
```

### Adding New Tests

#### API Tests

1. **Create test file**: Add new test files in `tests/api/`
2. **Follow naming convention**: Use `*.test.js` suffix
3. **Include setup**: Use existing global setup and utilities
4. **Test all endpoints**: Cover all HTTP methods and status codes

#### E2E Tests

1. **Create test file**: Add new test files in `tests/e2e/specs/`
2. **Follow naming convention**: Use `*.e2e.test.js` suffix
3. **Use page objects**: Create or extend page objects as needed
4. **Include cleanup**: Ensure tests clean up after themselves

### Extending the Framework

#### Adding New Utilities

1. **API utilities**: Add to `src/utils/` directory
2. **E2E utilities**: Add to `tests/e2e/utils/` directory
3. **Follow patterns**: Maintain consistency with existing utilities
4. **Document usage**: Include JSDoc comments and examples

#### Adding New Page Objects

1. **Extend BasePage**: All page objects should extend the base class
2. **Define selectors**: Use flexible selectors that work across implementations
3. **Implement methods**: Create methods for common page interactions
4. **Export properly**: Ensure page objects are properly exported

### Testing Your Changes

Before submitting contributions:

1. **Run all tests**:
   ```bash
   npm test
   ```

2. **Run specific test types**:
   ```bash
   npm run test:api
   npm run test:e2e
   ```

3. **Test with different environments**:
   ```bash
   export API_SERVER_URL=http://localhost:8080
   npm run test:api
   ```

4. **Check for regressions**: Ensure existing tests still pass

## Submission Process

### Pull Request Guidelines

1. **Create feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make focused commits**: Keep commits small and focused on specific changes

3. **Write descriptive commit messages**:
   ```
   Add API tests for event deletion endpoint
   
   - Add tests for successful event deletion
   - Add tests for error cases (404, validation)
   - Include schema validation for all responses
   ```

4. **Update documentation**: Update relevant documentation for your changes

5. **Test thoroughly**: Ensure all tests pass and new functionality works

### Pull Request Template

When creating a pull request, include:

- **Description**: Clear description of what the PR does
- **Testing**: How you tested the changes
- **Documentation**: Any documentation updates needed
- **Breaking changes**: Note any breaking changes

### Review Process

1. **Automated checks**: Ensure all CI checks pass
2. **Code review**: Address feedback from reviewers
3. **Testing**: Verify tests pass in different environments
4. **Documentation**: Ensure documentation is up to date

## Best Practices

### General

1. **Keep it simple**: Write clear, readable code
2. **Test edge cases**: Consider boundary conditions and error scenarios
3. **Be consistent**: Follow established patterns and conventions
4. **Document changes**: Update documentation for new features

### API Testing

1. **Validate schemas**: Always use OpenAPI schema validation
2. **Test error responses**: Verify error handling and status codes
3. **Use realistic data**: Create meaningful test data
4. **Clean up**: Remove test data after tests complete

### E2E Testing

1. **Wait appropriately**: Use proper wait conditions for dynamic content
2. **Handle failures gracefully**: Include error handling and recovery
3. **Capture evidence**: Take screenshots for debugging
4. **Test user workflows**: Focus on real user scenarios

## Getting Help

### Resources

- **Documentation**: Check the docs/ directory for detailed guides
- **Examples**: Look at existing tests for patterns and examples
- **Issues**: Check GitHub issues for known problems and solutions

### Communication

- **GitHub Issues**: Report bugs and request features
- **Pull Requests**: Submit code changes and improvements
- **Discussions**: Ask questions and share ideas

### Common Questions

**Q: How do I add a new API endpoint test?**
A: Create a new test file in `tests/api/` following the existing patterns. Include schema validation and test both success and error cases.

**Q: How do I debug E2E test failures?**
A: Run tests in headful mode (`CI=false npm run test:e2e`), check screenshots, and review console logs.

**Q: How do I update documentation?**
A: Update the relevant files in the `docs/` directory and ensure the main README links are correct.

Thank you for contributing to the Calendar App Tests project!
