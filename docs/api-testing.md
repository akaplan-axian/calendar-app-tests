# API Testing Guide

This guide covers comprehensive API integration testing for the calendar-app-api application. The test suite validates API endpoints against their OpenAPI specification and ensures proper functionality.

## Overview

The test suite is designed to:
- **Fetch OpenAPI specification** from the running server dynamically
- **Validate all API responses** against their OpenAPI schemas
- **Test endpoint functionality** and business logic
- **Verify error handling** and validation
- **Perform integration testing** of complete workflows

## Test Structure

```
tests/
├── setup.js                    # Global test setup and utilities
├── api/                        # Individual endpoint tests
│   ├── general.test.js         # Tests for / and /api/openapi.json
│   ├── health.test.js          # Tests for /health
│   └── events.test.js          # Tests for /api/events
└── integration/                # End-to-end integration tests
    └── full-api.test.js        # Complete workflow tests
```

## Test Categories

### 1. Schema Validation Tests
- Validates all API responses against OpenAPI schemas
- Ensures request/response format compliance
- Detects schema drift between documentation and implementation

### 2. Endpoint Functionality Tests
- Tests business logic and data handling
- Verifies correct status codes and response data
- Tests both success and error scenarios

### 3. Integration Tests
- Tests complete workflows (e.g., create event → fetch events)
- Validates API consistency across multiple requests
- Tests concurrent request handling

### 4. Error Handling Tests
- Validates 400, 404, 500 error responses
- Tests input validation and error messages
- Ensures error responses match OpenAPI specifications

## Key Features

### Dynamic OpenAPI Fetching
The test suite fetches the current OpenAPI specification from the running server at `/api/openapi.json`. This ensures:
- Tests always use the current API specification
- Schema validation reflects the actual running code
- No manual synchronization between tests and API changes

### Strict Failure Mode
If the OpenAPI specification cannot be fetched from the server:
- The entire test suite fails immediately
- Clear error messages guide users to start the server
- No fallback mechanisms that could mask configuration issues

### Custom Jest Matchers
The test suite includes custom Jest matchers for OpenAPI validation:

```javascript
// Validates response against OpenAPI schema
expect(response.data).toMatchOpenAPISchema('/api/events', 'get', 200);
```

### Global Test Utilities
Available in all test files:
- `global.apiClient` - HTTP client for API requests
- `global.schemaValidator` - OpenAPI schema validation
- `global.validateResponse()` - Response validation helper
- `global.validateRequest()` - Request validation helper
- `global.getExpectedStatusCodes()` - Get expected status codes for endpoint
- `global.getOperationId()` - Get OpenAPI operation ID

## Example Test

```javascript
describe('Events API', () => {
  test('should create a new event', async () => {
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

## Running API Tests

```bash
# Run all API tests
npm run test:api

# Run tests in watch mode
npm run test:watch

# Run tests with verbose output
npm run test:verbose

# Run tests with coverage
npm run test:coverage
```

## Dependencies

- **Jest**: Test framework and runner
- **Axios**: HTTP client for API requests
- **AJV**: JSON schema validation
- **AJV-Formats**: Additional format validators for AJV
