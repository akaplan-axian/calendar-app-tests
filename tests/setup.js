const OpenAPIFetcher = require('../src/utils/openapi-fetcher');
const SchemaValidator = require('../src/utils/schema-validator');
const ApiClient = require('../src/utils/api-client');

// Global test variables
global.openApiFetcher = null;
global.schemaValidator = null;
global.apiClient = null;
global.openApiSpec = null;

// Setup before all tests
beforeAll(async () => {
  console.log('🚀 Setting up API test suite...');
  
  try {
    // Initialize OpenAPI fetcher
    global.openApiFetcher = new OpenAPIFetcher();
    
    // Fetch OpenAPI specification from running server
    console.log('📋 Fetching OpenAPI specification from server...');
    global.openApiSpec = await global.openApiFetcher.fetchOpenAPISpec();
    
    // Initialize schema validator with the fetched spec
    global.schemaValidator = new SchemaValidator(global.openApiSpec);
    console.log('✓ Schema validator initialized');
    
    // Initialize API client
    global.apiClient = new ApiClient();
    console.log(`✓ API client initialized (${global.apiClient.getBaseURL()})`);
    
    console.log('✅ Test suite setup complete');
    console.log(`📊 API Info: ${global.openApiSpec.info.title} v${global.openApiSpec.info.version}`);
    console.log(`🔗 Testing against: ${global.openApiFetcher.getServerUrl()}`);
    
  } catch (error) {
    console.error('❌ Test suite setup failed:', error.message);
    console.error('\n💡 Make sure the calendar-app-api server is running before executing tests.');
    console.error('   You can start it with: npm run dev');
    process.exit(1);
  }
});

// Cleanup after all tests
afterAll(async () => {
  console.log('🧹 Cleaning up test suite...');
  // Add any cleanup logic here if needed
});

// Helper function to validate response against OpenAPI schema
global.validateResponse = (path, method, statusCode, responseData) => {
  if (!global.schemaValidator) {
    throw new Error('Schema validator not initialized');
  }
  
  const validation = global.schemaValidator.validateResponse(path, method, statusCode, responseData);
  
  if (!validation.valid) {
    const errorDetails = validation.errors.map(error => 
      `  - ${error.instancePath || 'root'}: ${error.message}`
    ).join('\n');
    
    throw new Error(
      `Response validation failed for ${method.toUpperCase()} ${path} (${statusCode}):\n${errorDetails}`
    );
  }
  
  return validation;
};

// Helper function to validate request against OpenAPI schema
global.validateRequest = (path, method, requestData) => {
  if (!global.schemaValidator) {
    throw new Error('Schema validator not initialized');
  }
  
  const validation = global.schemaValidator.validateRequest(path, method, requestData);
  
  if (!validation.valid) {
    const errorDetails = validation.errors.map(error => 
      `  - ${error.instancePath || 'root'}: ${error.message}`
    ).join('\n');
    
    throw new Error(
      `Request validation failed for ${method.toUpperCase()} ${path}:\n${errorDetails}`
    );
  }
  
  return validation;
};

// Helper function to get expected status codes for an endpoint
global.getExpectedStatusCodes = (path, method) => {
  if (!global.schemaValidator) {
    throw new Error('Schema validator not initialized');
  }
  
  return global.schemaValidator.getExpectedStatusCodes(path, method);
};

// Helper function to get operation ID
global.getOperationId = (path, method) => {
  if (!global.schemaValidator) {
    throw new Error('Schema validator not initialized');
  }
  
  return global.schemaValidator.getOperationId(path, method);
};

// Custom Jest matchers
expect.extend({
  toMatchOpenAPISchema(received, path, method, statusCode) {
    try {
      global.validateResponse(path, method, statusCode, received);
      return {
        message: () => `Expected response not to match OpenAPI schema`,
        pass: true
      };
    } catch (error) {
      return {
        message: () => `Expected response to match OpenAPI schema: ${error.message}`,
        pass: false
      };
    }
  }
});
