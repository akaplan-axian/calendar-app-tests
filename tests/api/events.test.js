describe('Events API Endpoints', () => {
  describe('GET /api/events', () => {
    test('should return list of events', async () => {
      const response = await global.apiClient.get('/api/events');
      
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      
      // Validate response against OpenAPI schema
      expect(response.data).toMatchOpenAPISchema('/api/events', 'get', 200);
      
      // Verify required fields are present
      expect(response.data).toHaveProperty('events');
      expect(response.data).toHaveProperty('message');
      
      // Verify events is an array
      expect(Array.isArray(response.data.events)).toBe(true);
      
      // Verify message
      expect(response.data.message).toBe('Events retrieved successfully');
    });

    test('should return correct content type', async () => {
      const response = await global.apiClient.get('/api/events');
      
      expect(response.headers['content-type']).toMatch(/application\/json/);
    });

    test('should match expected status codes from OpenAPI spec', async () => {
      const expectedStatusCodes = global.getExpectedStatusCodes('/api/events', 'get');
      expect(expectedStatusCodes).toContain(200);
    });

    test('should have correct operation ID', async () => {
      const operationId = global.getOperationId('/api/events', 'get');
      expect(operationId).toBe('getCalendarEvents');
    });
  });

  describe('POST /api/events', () => {
    const validEventData = {
      title: 'Test Event',
      description: 'A test event for API testing',
      startDate: '2024-12-01T10:00:00.000Z',
      endDate: '2024-12-01T11:00:00.000Z',
      location: 'Test Location'
    };

    test('should create a new event with valid data', async () => {
      const response = await global.apiClient.post('/api/events', validEventData);
      
      expect(response.status).toBe(201);
      expect(response.data).toBeDefined();
      
      // Validate response against OpenAPI schema
      expect(response.data).toMatchOpenAPISchema('/api/events', 'post', 201);
      
      // Verify required fields are present
      expect(response.data).toHaveProperty('id');
      expect(response.data).toHaveProperty('message');
      expect(response.data).toHaveProperty('event');
      
      // Verify the created event data
      expect(response.data.event.title).toBe(validEventData.title);
      expect(response.data.event.description).toBe(validEventData.description);
      expect(response.data.event.startDate).toBe(validEventData.startDate);
      expect(response.data.event.endDate).toBe(validEventData.endDate);
      expect(response.data.event.location).toBe(validEventData.location);
      
      // Verify message
      expect(response.data.message).toBe('Event created successfully');
      
      // Verify ID is present and is a string
      expect(typeof response.data.id).toBe('string');
      expect(response.data.id.length).toBeGreaterThan(0);
    });

    test('should validate request data against OpenAPI schema', async () => {
      // This test validates that our request matches the schema
      expect(() => {
        global.validateRequest('/api/events', 'post', validEventData);
      }).not.toThrow();
    });

    test('should return 400 for missing required fields', async () => {
      const invalidData = {
        description: 'Missing title and dates'
      };
      
      const response = await global.apiClient.post('/api/events', invalidData);
      
      expect(response.status).toBe(400);
      expect(response.error).toBe(true);
      expect(response.data).toHaveProperty('error');
      expect(response.data.error).toBe('Validation failed');
      expect(response.data).toHaveProperty('details');
      expect(Array.isArray(response.data.details)).toBe(true);
    });

    test('should return 400 for invalid date format', async () => {
      const invalidData = {
        ...validEventData,
        startDate: 'invalid-date',
        endDate: 'invalid-date'
      };
      
      const response = await global.apiClient.post('/api/events', invalidData);
      
      expect(response.status).toBe(400);
      expect(response.error).toBe(true);
      expect(response.data).toHaveProperty('error');
    });

    test('should return 400 for title too long', async () => {
      const invalidData = {
        ...validEventData,
        title: 'a'.repeat(101) // Exceeds maxLength of 100
      };
      
      const response = await global.apiClient.post('/api/events', invalidData);
      
      expect(response.status).toBe(400);
      expect(response.error).toBe(true);
      expect(response.data).toHaveProperty('error');
    });

    test('should return 400 for empty title', async () => {
      const invalidData = {
        ...validEventData,
        title: '' // Violates minLength of 1
      };
      
      const response = await global.apiClient.post('/api/events', invalidData);
      
      expect(response.status).toBe(400);
      expect(response.error).toBe(true);
      expect(response.data).toHaveProperty('error');
    });

    test('should accept event without optional fields', async () => {
      const minimalEventData = {
        title: 'Minimal Event',
        startDate: '2024-12-01T10:00:00.000Z',
        endDate: '2024-12-01T11:00:00.000Z'
      };
      
      const response = await global.apiClient.post('/api/events', minimalEventData);
      
      expect(response.status).toBe(201);
      expect(response.data).toMatchOpenAPISchema('/api/events', 'post', 201);
      expect(response.data.event.title).toBe(minimalEventData.title);
    });

    test('should return correct content type', async () => {
      const response = await global.apiClient.post('/api/events', validEventData);
      
      expect(response.headers['content-type']).toMatch(/application\/json/);
    });

    test('should have correct operation ID', async () => {
      const operationId = global.getOperationId('/api/events', 'post');
      expect(operationId).toBe('createCalendarEvent');
    });

    test('should match expected status codes from OpenAPI spec', async () => {
      const expectedStatusCodes = global.getExpectedStatusCodes('/api/events', 'post');
      expect(expectedStatusCodes).toContain(201);
      expect(expectedStatusCodes).toContain(400);
    });
  });
});
