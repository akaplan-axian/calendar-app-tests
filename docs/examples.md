# Examples and Usage Patterns

This document provides practical examples and usage patterns for the Calendar App Tests suite.

## API Testing Examples

### Basic API Test Structure

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

### Schema Validation Examples

```javascript
// Validate response against OpenAPI schema
expect(response.data).toMatchOpenAPISchema('/api/events', 'get', 200);

// Validate request data
expect(requestData).toMatchOpenAPISchema('/api/events', 'post', 'requestBody');

// Get expected status codes for an endpoint
const expectedCodes = global.getExpectedStatusCodes('/api/events', 'post');
expect(expectedCodes).toContain(response.status);

// Get operation ID
const operationId = global.getOperationId('/api/events', 'post');
expect(operationId).toBe('createCalendarEvent');
```

### Error Handling Tests

```javascript
describe('Error Handling', () => {
  test('should return 400 for missing required fields', async () => {
    const invalidData = {
      // Missing required title field
      startDate: '2024-12-01T10:00:00.000Z',
      endDate: '2024-12-01T11:00:00.000Z'
    };
    
    try {
      await global.apiClient.post('/api/events', invalidData);
      fail('Expected request to fail');
    } catch (error) {
      expect(error.response.status).toBe(400);
      expect(error.response.data).toMatchOpenAPISchema('/api/events', 'post', 400);
    }
  });
  
  test('should return 404 for non-existent endpoints', async () => {
    try {
      await global.apiClient.get('/api/non-existent');
      fail('Expected request to fail');
    } catch (error) {
      expect(error.response.status).toBe(404);
    }
  });
});
```

### Integration Test Examples

```javascript
describe('Complete Event Workflow', () => {
  test('should create, fetch, and validate event', async () => {
    // Create event
    const eventData = {
      title: 'Integration Test Event',
      startDate: '2024-12-01T10:00:00.000Z',
      endDate: '2024-12-01T11:00:00.000Z'
    };
    
    const createResponse = await global.apiClient.post('/api/events', eventData);
    expect(createResponse.status).toBe(201);
    
    // Fetch all events
    const fetchResponse = await global.apiClient.get('/api/events');
    expect(fetchResponse.status).toBe(200);
    expect(fetchResponse.data.events).toContainEqual(
      expect.objectContaining({
        title: eventData.title
      })
    );
    
    // Validate both responses
    expect(createResponse.data).toMatchOpenAPISchema('/api/events', 'post', 201);
    expect(fetchResponse.data).toMatchOpenAPISchema('/api/events', 'get', 200);
  });
});
```

## E2E Testing Examples

### Basic Page Object Usage

```javascript
const { CalendarPage } = require('../pages/CalendarPage');

describe('Calendar Navigation', () => {
  let calendarPage;
  
  beforeEach(async () => {
    calendarPage = new CalendarPage();
    await calendarPage.goto('/');
    await calendarPage.waitForCalendarToLoad();
  });
  
  test('should navigate to next month', async () => {
    const currentMonth = await calendarPage.getCurrentMonth();
    await calendarPage.navigateToNextPeriod();
    const newMonth = await calendarPage.getCurrentMonth();
    
    expect(newMonth).not.toBe(currentMonth);
    await calendarPage.takeScreenshot('next-month-navigation');
  });
});
```

### Custom Page Object Example

```javascript
const { BasePage } = require('./BasePage');

class EventFormPage extends BasePage {
  constructor() {
    super();
    this.selectors = {
      titleInput: '#event-title, [data-testid="event-title"]',
      startDateInput: '#start-date, [data-testid="start-date"]',
      endDateInput: '#end-date, [data-testid="end-date"]',
      submitButton: '.submit-btn, [data-testid="submit-event"]',
      cancelButton: '.cancel-btn, [data-testid="cancel-event"]'
    };
  }
  
  async fillEventForm(eventData) {
    await this.type(this.selectors.titleInput, eventData.title);
    await this.type(this.selectors.startDateInput, eventData.startDate);
    await this.type(this.selectors.endDateInput, eventData.endDate);
  }
  
  async submitEvent() {
    await this.click(this.selectors.submitButton);
    await this.waitForSelector('.success-message, .error-message');
  }
  
  async cancelEvent() {
    await this.click(this.selectors.cancelButton);
  }
}

module.exports = { EventFormPage };
```

### Browser Interaction Examples

```javascript
describe('Event Creation', () => {
  test('should create event through UI', async () => {
    const eventFormPage = new EventFormPage();
    
    // Navigate to event creation page
    await eventFormPage.goto('/events/new');
    
    // Fill out the form
    await eventFormPage.fillEventForm({
      title: 'UI Test Event',
      startDate: '2024-12-01T10:00',
      endDate: '2024-12-01T11:00'
    });
    
    // Take screenshot before submission
    await eventFormPage.takeScreenshot('before-event-submission');
    
    // Submit the form
    await eventFormPage.submitEvent();
    
    // Verify success
    const successMessage = await page.$('.success-message');
    expect(successMessage).toBeTruthy();
    
    // Take screenshot after submission
    await eventFormPage.takeScreenshot('after-event-submission');
  });
});
```

### Network Monitoring Example

```javascript
const { BrowserHelpers } = require('../utils/browser-helpers');

describe('API Integration', () => {
  test('should monitor network requests during event creation', async () => {
    const browserHelpers = new BrowserHelpers();
    
    // Start monitoring network requests
    await browserHelpers.startNetworkMonitoring();
    
    // Perform UI actions that trigger API calls
    const eventFormPage = new EventFormPage();
    await eventFormPage.goto('/events/new');
    await eventFormPage.fillEventForm({
      title: 'Network Test Event',
      startDate: '2024-12-01T10:00',
      endDate: '2024-12-01T11:00'
    });
    await eventFormPage.submitEvent();
    
    // Get captured network requests
    const requests = await browserHelpers.getNetworkRequests();
    
    // Verify API call was made
    const createEventRequest = requests.find(req => 
      req.url.includes('/api/events') && req.method === 'POST'
    );
    
    expect(createEventRequest).toBeTruthy();
    expect(createEventRequest.response.status).toBe(201);
  });
});
```

## Test Data Examples

### API Test Data

```javascript
// Valid event data
const validEventData = {
  title: 'Test Event',
  description: 'This is a test event',
  startDate: '2024-12-01T10:00:00.000Z',
  endDate: '2024-12-01T11:00:00.000Z',
  location: 'Test Location'
};

// Invalid event data for error testing
const invalidEventData = [
  {
    name: 'missing title',
    data: {
      startDate: '2024-12-01T10:00:00.000Z',
      endDate: '2024-12-01T11:00:00.000Z'
    }
  },
  {
    name: 'invalid date format',
    data: {
      title: 'Test Event',
      startDate: 'invalid-date',
      endDate: '2024-12-01T11:00:00.000Z'
    }
  },
  {
    name: 'title too long',
    data: {
      title: 'x'.repeat(256), // Assuming 255 char limit
      startDate: '2024-12-01T10:00:00.000Z',
      endDate: '2024-12-01T11:00:00.000Z'
    }
  }
];
```

### E2E Test Data

```javascript
const { TestData } = require('../utils/test-data');

describe('Event Management', () => {
  test('should handle various event types', async () => {
    const testData = new TestData();
    
    // Generate different types of events
    const events = [
      testData.generateEventData('meeting'),
      testData.generateEventData('appointment'),
      testData.generateEventData('reminder')
    ];
    
    for (const eventData of events) {
      // Create event through UI
      await createEventThroughUI(eventData);
      
      // Verify event appears in calendar
      await verifyEventInCalendar(eventData);
    }
    
    // Clean up test data
    await testData.cleanupTestEvents();
  });
});
```

## Configuration Examples

### Environment-Specific Testing

```javascript
// Test configuration for different environments
const testConfig = {
  local: {
    apiUrl: 'http://localhost:3000',
    frontendUrl: 'http://localhost:5173',
    timeout: 30000
  },
  staging: {
    apiUrl: 'https://api-staging.example.com',
    frontendUrl: 'https://staging.example.com',
    timeout: 60000
  },
  production: {
    apiUrl: 'https://api.example.com',
    frontendUrl: 'https://example.com',
    timeout: 60000
  }
};

// Usage in tests
const config = testConfig[process.env.NODE_ENV || 'local'];
```

### Custom Jest Matchers

```javascript
// Custom matcher for OpenAPI validation
expect.extend({
  toMatchOpenAPISchema(received, path, method, statusCode) {
    const isValid = global.schemaValidator.validateResponse(
      received, path, method, statusCode
    );
    
    if (isValid) {
      return {
        message: () => `Expected response not to match OpenAPI schema`,
        pass: true
      };
    } else {
      return {
        message: () => `Expected response to match OpenAPI schema`,
        pass: false
      };
    }
  }
});
```

## Advanced Patterns

### Parallel Test Execution

```javascript
describe('Concurrent API Tests', () => {
  test('should handle multiple simultaneous requests', async () => {
    const requests = Array.from({ length: 5 }, (_, i) => 
      global.apiClient.get('/api/events')
    );
    
    const responses = await Promise.all(requests);
    
    responses.forEach(response => {
      expect(response.status).toBe(200);
      expect(response.data).toMatchOpenAPISchema('/api/events', 'get', 200);
    });
  });
});
```

### Conditional Testing

```javascript
describe('Feature-Dependent Tests', () => {
  test('should test advanced features if available', async () => {
    const calendarPage = new CalendarPage();
    await calendarPage.goto('/');
    
    // Check if advanced features are available
    const hasAdvancedFeatures = await calendarPage.isVisible('.advanced-features');
    
    if (hasAdvancedFeatures) {
      // Test advanced functionality
      await calendarPage.click('.advanced-features');
      await calendarPage.waitForSelector('.advanced-panel');
      // ... additional tests
    } else {
      // Test basic functionality only
      await calendarPage.testBasicFeatures();
    }
  });
});
```

### Retry Logic

```javascript
const { retry } = require('../utils/retry-helper');

describe('Flaky Tests', () => {
  test('should retry flaky operations', async () => {
    await retry(async () => {
      const response = await global.apiClient.get('/api/events');
      expect(response.status).toBe(200);
      expect(response.data.events).toHaveLength(0);
    }, {
      retries: 3,
      delay: 1000
    });
  });
});
```

These examples demonstrate the key patterns and practices used throughout the test suite. Use them as templates when creating new tests or extending existing functionality.
