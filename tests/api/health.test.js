describe('Health API Endpoint', () => {
  describe('GET /health', () => {
    test('should return health status', async () => {
      const response = await global.apiClient.get('/health');
      
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      
      // Validate response against OpenAPI schema
      expect(response.data).toMatchOpenAPISchema('/health', 'get', 200);
      
      // Verify required fields are present
      expect(response.data).toHaveProperty('status');
      expect(response.data).toHaveProperty('timestamp');
      
      // Verify status value
      expect(response.data.status).toBe('healthy');
      
      // Verify timestamp is a valid ISO date string
      expect(response.data.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      
      // Verify timestamp is recent (within last 5 seconds)
      const timestampDate = new Date(response.data.timestamp);
      const now = new Date();
      const timeDiff = now.getTime() - timestampDate.getTime();
      expect(timeDiff).toBeLessThan(5000); // 5 seconds
    });

    test('should return correct content type', async () => {
      const response = await global.apiClient.get('/health');
      
      expect(response.headers['content-type']).toMatch(/application\/json/);
    });

    test('should match expected status codes from OpenAPI spec', async () => {
      const expectedStatusCodes = global.getExpectedStatusCodes('/health', 'get');
      expect(expectedStatusCodes).toContain(200);
    });

    test('should have correct operation ID', async () => {
      const operationId = global.getOperationId('/health', 'get');
      expect(operationId).toBe('getHealthStatus');
    });

    test('should be consistently healthy on multiple calls', async () => {
      // Make multiple health check calls
      const responses = await Promise.all([
        global.apiClient.get('/health'),
        global.apiClient.get('/health'),
        global.apiClient.get('/health')
      ]);
      
      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.data.status).toBe('healthy');
        expect(response.data).toMatchOpenAPISchema('/health', 'get', 200);
      });
    });

    test('should return unique timestamps on rapid calls', async () => {
      const response1 = await global.apiClient.get('/health');
      const response2 = await global.apiClient.get('/health');
      
      expect(response1.data.timestamp).not.toBe(response2.data.timestamp);
    });
  });
});
