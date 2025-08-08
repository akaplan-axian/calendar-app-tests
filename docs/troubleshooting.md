# Troubleshooting Guide

This guide covers common issues and solutions when running the calendar app test suite.

## Common Issues

### API Connection Issues

#### "Cannot connect to calendar-app-api server"
**Symptoms**: Tests fail with connection errors or timeouts
**Solutions**:
- Ensure the calendar-app-api server is running at the configured URL
- Check the `API_SERVER_URL` environment variable
- Verify network connectivity to the server
- Confirm the server is accessible at the expected port

#### "Failed to fetch OpenAPI schema"
**Symptoms**: Tests fail during setup with OpenAPI fetch errors
**Solutions**:
- Confirm the `/api/openapi.json` endpoint is accessible
- Check server logs for errors
- Verify the OpenAPI specification is valid JSON
- Ensure the server is fully started before running tests

### Schema Validation Failures

#### Schema validation errors
**Symptoms**: Tests pass but schema validation fails
**Solutions**:
- Check if API responses match the OpenAPI specification
- Verify the OpenAPI spec is up to date with the current API
- Look for recent changes in API response format
- Compare actual response with expected schema

### E2E Testing Issues

#### Browser launch failures
**Symptoms**: E2E tests fail to start or browser doesn't launch
**Solutions**:
- Ensure Puppeteer is properly installed: `npm install puppeteer`
- Check if Chrome/Chromium is available on the system
- Try running in headful mode: `CI=false npm run test:e2e`
- Clear browser cache and temporary files

#### Element not found errors
**Symptoms**: Tests fail with "Element not found" or timeout errors
**Solutions**:
- Check if selectors match the actual application elements
- Verify the web application is running at `http://localhost:5173`
- Increase timeout values in test configuration
- Use browser developer tools to inspect element selectors

#### Page load timeouts
**Symptoms**: Tests timeout while waiting for pages to load
**Solutions**:
- Ensure the frontend application is running and accessible
- Check network connectivity
- Increase page load timeout in configuration
- Verify the application loads correctly in a regular browser

### Environment Configuration Issues

#### Environment variable problems
**Symptoms**: Tests connect to wrong servers or use incorrect URLs
**Solutions**:
- Verify environment variables are set correctly:
  ```bash
  echo $API_SERVER_URL
  echo $FRONTEND_URL
  ```
- Ensure URLs include the correct protocol (http/https)
- Remove trailing slashes from URLs
- Check for typos in environment variable names

#### Port conflicts
**Symptoms**: Tests fail because servers are running on different ports
**Solutions**:
- Update environment variables to match actual server ports
- Check which ports your servers are actually using
- Ensure no other services are using the expected ports

### Test Execution Issues

#### Tests hang or run indefinitely
**Symptoms**: Test suite doesn't complete or appears stuck
**Solutions**:
- Check for infinite loops in test code
- Verify all async operations have proper timeouts
- Look for unclosed browser instances in E2E tests
- Restart the test process and check for resource leaks

#### Intermittent test failures
**Symptoms**: Tests pass sometimes but fail other times
**Solutions**:
- Add proper wait conditions for dynamic content
- Increase timeouts for slower operations
- Check for race conditions in test code
- Ensure tests clean up properly after execution

## Debugging Strategies

### API Tests

1. **Enable verbose logging**:
   ```bash
   npm run test:verbose
   ```

2. **Check server logs**: Review calendar-app-api server logs for errors

3. **Test individual endpoints**: Use tools like curl or Postman to test API endpoints manually

4. **Validate OpenAPI spec**: Use online validators to check OpenAPI specification format

### E2E Tests

1. **Run in headful mode**:
   ```bash
   CI=false npm run test:e2e
   ```

2. **Enable slow motion**: Configured automatically in development mode

3. **Check screenshots**: Review captured screenshots in `screenshots/` directory

4. **Monitor console logs**: Check browser console for JavaScript errors

5. **Network monitoring**: Use browser dev tools to monitor network requests

### General Debugging

1. **Run specific tests**:
   ```bash
   # Run specific test file
   npm test -- tests/api/events.test.js
   
   # Run tests matching pattern
   npm test -- --testNamePattern="should create"
   ```

2. **Check test output**: Review detailed test output for error messages

3. **Verify dependencies**: Ensure all npm packages are installed correctly

4. **Clear caches**: Clear npm cache and reinstall dependencies if needed

## Getting Help

### Before Asking for Help

1. Check this troubleshooting guide
2. Review test logs and error messages
3. Verify your environment setup
4. Try running tests in isolation
5. Check if the issue is reproducible

### Information to Include

When reporting issues, include:
- Error messages and stack traces
- Environment details (OS, Node.js version)
- Test command used
- Environment variable values
- Server status and logs
- Screenshots (for E2E issues)

### Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Puppeteer Documentation](https://pptr.dev/)
- [OpenAPI Specification](https://swagger.io/specification/)
- Project repository issues and discussions
