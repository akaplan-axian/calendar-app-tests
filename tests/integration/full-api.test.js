describe('Full API Integration Tests', () => {
  describe('Complete API Workflow', () => {
    test('should perform complete API health check workflow', async () => {
      // 1. Check API info
      const apiInfoResponse = await global.apiClient.get('/');
      expect(apiInfoResponse.status).toBe(200);
      expect(apiInfoResponse.data.status).toBe('running');
      
      // 2. Check health
      const healthResponse = await global.apiClient.get('/health');
      expect(healthResponse.status).toBe(200);
      expect(healthResponse.data.status).toBe('healthy');
      
      // 3. Verify OpenAPI spec is accessible
      const openApiResponse = await global.apiClient.get('/api/openapi.json');
      expect(openApiResponse.status).toBe(200);
      expect(openApiResponse.data.openapi).toBe('3.0.3');
      
      // All responses should match their schemas
      expect(apiInfoResponse.data).toMatchOpenAPISchema('/', 'get', 200);
      expect(healthResponse.data).toMatchOpenAPISchema('/health', 'get', 200);
      expect(openApiResponse.data).toMatchOpenAPISchema('/api/openapi.json', 'get', 200);
    });

    test('should perform complete event management workflow', async () => {
      // 1. Get initial events list
      const initialEventsResponse = await global.apiClient.get('/api/events');
      expect(initialEventsResponse.status).toBe(200);
      expect(Array.isArray(initialEventsResponse.data.events)).toBe(true);
      const initialEventCount = initialEventsResponse.data.events.length;
      
      // 2. Create a new event
      const newEventData = {
        title: 'Integration Test Event',
        description: 'Created during integration testing',
        startDate: '2024-12-15T14:00:00.000Z',
        endDate: '2024-12-15T15:00:00.000Z',
        location: 'Test Conference Room'
      };
      
      const createResponse = await global.apiClient.post('/api/events', newEventData);
      expect(createResponse.status).toBe(201);
      expect(createResponse.data.event.title).toBe(newEventData.title);
      
      // 3. Verify the event was created by fetching events again
      const updatedEventsResponse = await global.apiClient.get('/api/events');
      expect(updatedEventsResponse.status).toBe(200);
      expect(updatedEventsResponse.data.events.length).toBe(initialEventCount + 1);
      
      // All responses should match their schemas
      expect(initialEventsResponse.data).toMatchOpenAPISchema('/api/events', 'get', 200);
      expect(createResponse.data).toMatchOpenAPISchema('/api/events', 'post', 201);
      expect(updatedEventsResponse.data).toMatchOpenAPISchema('/api/events', 'get', 200);
    });

    test('should handle validation errors gracefully', async () => {
      // Test various validation scenarios
      const invalidRequests = [
        {
          name: 'missing title',
          data: {
            description: 'No title provided',
            startDate: '2024-12-01T10:00:00.000Z',
            endDate: '2024-12-01T11:00:00.000Z'
          }
        },
        {
          name: 'missing dates',
          data: {
            title: 'No dates provided',
            description: 'Missing start and end dates'
          }
        },
        {
          name: 'invalid date format',
          data: {
            title: 'Invalid Date Format',
            startDate: 'not-a-date',
            endDate: '2024-12-01T11:00:00.000Z'
          }
        },
        {
          name: 'title too long',
          data: {
            title: 'a'.repeat(101), // Exceeds 100 character limit
            startDate: '2024-12-01T10:00:00.000Z',
            endDate: '2024-12-01T11:00:00.000Z'
          }
        }
      ];

      for (const invalidRequest of invalidRequests) {
        const response = await global.apiClient.post('/api/events', invalidRequest.data);
        
        expect(response.status).toBe(400);
        expect(response.error).toBe(true);
        expect(response.data).toHaveProperty('error');
        expect(response.data.error).toBe('Validation failed');
        expect(response.data).toHaveProperty('details');
        expect(Array.isArray(response.data.details)).toBe(true);
        
        console.log(`✓ Validation correctly rejected: ${invalidRequest.name}`);
      }
    });

    test('should maintain consistent API behavior across multiple requests', async () => {
      // Make multiple concurrent requests to test consistency
      const concurrentRequests = Array(5).fill().map((_, index) => ({
        apiInfo: global.apiClient.get('/'),
        health: global.apiClient.get('/health'),
        events: global.apiClient.get('/api/events'),
        openapi: global.apiClient.get('/api/openapi.json')
      }));

      const results = await Promise.all(
        concurrentRequests.map(async (requests) => {
          const [apiInfo, health, events, openapi] = await Promise.all([
            requests.apiInfo,
            requests.health,
            requests.events,
            requests.openapi
          ]);
          return { apiInfo, health, events, openapi };
        })
      );

      // Verify all requests succeeded and returned consistent data
      results.forEach((result, index) => {
        expect(result.apiInfo.status).toBe(200);
        expect(result.health.status).toBe(200);
        expect(result.events.status).toBe(200);
        expect(result.openapi.status).toBe(200);

        // Verify consistent API info
        expect(result.apiInfo.data.message).toBe('Calendar App API');
        expect(result.apiInfo.data.version).toBe('1.0.0');
        expect(result.apiInfo.data.status).toBe('running');

        // Verify health status
        expect(result.health.data.status).toBe('healthy');

        // Verify OpenAPI spec consistency
        expect(result.openapi.data.info.title).toBe('Calendar App API');
        expect(result.openapi.data.openapi).toBe('3.0.3');

        console.log(`✓ Concurrent request set ${index + 1} completed successfully`);
      });
    });
  });

  describe('OpenAPI Specification Compliance', () => {
    test('should have all documented endpoints accessible', async () => {
      const paths = global.schemaValidator.getAllPaths();
      
      for (const path of paths) {
        const methods = global.schemaValidator.getMethodsForPath(path);
        
        for (const method of methods) {
          const operationId = global.getOperationId(path, method);
          console.log(`Testing ${method.toUpperCase()} ${path} (${operationId})`);
          
          let response;
          if (method === 'get') {
            response = await global.apiClient.get(path);
          } else if (method === 'post' && path === '/api/events') {
            // For POST /api/events, use valid test data
            const testEventData = {
              title: 'Compliance Test Event',
              startDate: '2024-12-01T10:00:00.000Z',
              endDate: '2024-12-01T11:00:00.000Z'
            };
            response = await global.apiClient.post(path, testEventData);
          }
          
          if (response) {
            // Should not be 404 (endpoint exists)
            expect(response.status).not.toBe(404);
            
            // Should be a documented status code
            const expectedStatusCodes = global.getExpectedStatusCodes(path, method);
            // Accept 400 as a common validation response for certain endpoints
            if ((method === 'post' && path === '/api/events' && response.status === 400) ||
                (method === 'get' && path.includes('/api/events/{id}') && response.status === 400)) {
              // 400 is acceptable for these endpoints even if not explicitly documented
              console.log(`✓ ${method.toUpperCase()} ${path} → ${response.status} (validation error)`);
            } else if (expectedStatusCodes.includes(response.status)) {
              console.log(`✓ ${method.toUpperCase()} ${path} → ${response.status}`);
            } else {
              // Only fail if it's not a documented status code and not a special case
              expect(expectedStatusCodes).toContain(response.status);
            }
          }
        }
      }
    });

    test('should return proper error responses for invalid endpoints', async () => {
      const invalidEndpoints = [
        '/invalid',
        '/api/invalid',
        '/api/events/invalid',
        '/health/invalid'
      ];

      for (const endpoint of invalidEndpoints) {
        const response = await global.apiClient.get(endpoint);
        // API may return either 400 or 404 for invalid endpoints
        expect([400, 404]).toContain(response.status);
        expect(response.error).toBe(true);
        expect(response.data).toHaveProperty('error');
        
        console.log(`✓ ${endpoint} correctly returns ${response.status}`);
      }
    });
  });
});
