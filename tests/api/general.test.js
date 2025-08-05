describe('General API Endpoints', () => {
  describe('GET /', () => {
    test('should return API information', async () => {
      const response = await global.apiClient.get('/');
      
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      
      // Validate response against OpenAPI schema
      expect(response.data).toMatchOpenAPISchema('/', 'get', 200);
      
      // Verify required fields are present
      expect(response.data).toHaveProperty('message');
      expect(response.data).toHaveProperty('version');
      expect(response.data).toHaveProperty('status');
      
      // Verify expected values
      expect(response.data.message).toBe('Calendar App API');
      expect(response.data.version).toBe('1.0.0');
      expect(response.data.status).toBe('running');
    });

    test('should return correct content type', async () => {
      const response = await global.apiClient.get('/');
      
      expect(response.headers['content-type']).toMatch(/application\/json/);
    });

    test('should match expected status codes from OpenAPI spec', async () => {
      const expectedStatusCodes = global.getExpectedStatusCodes('/', 'get');
      expect(expectedStatusCodes).toContain(200);
    });

    test('should have correct operation ID', async () => {
      const operationId = global.getOperationId('/', 'get');
      expect(operationId).toBe('getApiInfo');
    });
  });

  describe('GET /api/openapi.json', () => {
    test('should return OpenAPI specification', async () => {
      const response = await global.apiClient.get('/api/openapi.json');
      
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      
      // Validate response against OpenAPI schema
      expect(response.data).toMatchOpenAPISchema('/api/openapi.json', 'get', 200);
      
      // Verify it's a valid OpenAPI spec
      expect(response.data).toHaveProperty('openapi');
      expect(response.data).toHaveProperty('info');
      expect(response.data).toHaveProperty('paths');
      
      // Verify OpenAPI version
      expect(response.data.openapi).toBe('3.0.3');
      
      // Verify API info
      expect(response.data.info.title).toBe('Calendar App API');
      expect(response.data.info.version).toBe('1.0.0');
      
      // Verify paths are defined
      expect(Object.keys(response.data.paths)).toContain('/');
      expect(Object.keys(response.data.paths)).toContain('/health');
      expect(Object.keys(response.data.paths)).toContain('/api/events');
      expect(Object.keys(response.data.paths)).toContain('/api/openapi.json');
    });

    test('should return correct content type', async () => {
      const response = await global.apiClient.get('/api/openapi.json');
      
      expect(response.headers['content-type']).toMatch(/application\/json/);
    });

    test('should match the spec used for validation', async () => {
      const response = await global.apiClient.get('/api/openapi.json');
      
      // The returned spec should match what we're using for validation
      expect(response.data.info.title).toBe(global.openApiSpec.info.title);
      expect(response.data.info.version).toBe(global.openApiSpec.info.version);
      expect(response.data.openapi).toBe(global.openApiSpec.openapi);
    });

    test('should have correct operation ID', async () => {
      const operationId = global.getOperationId('/api/openapi.json', 'get');
      expect(operationId).toBe('getOpenAPISchema');
    });
  });

  describe('Error handling', () => {
    test('should return 404 for non-existent endpoints', async () => {
      const response = await global.apiClient.get('/non-existent-endpoint');
      
      expect(response.status).toBe(404);
      expect(response.error).toBe(true);
      expect(response.data).toHaveProperty('error');
    });
  });
});
