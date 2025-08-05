#!/usr/bin/env node

/**
 * Demo script to showcase the calendar-app-tests functionality
 * This script demonstrates how the test suite fetches OpenAPI spec and validates responses
 */

const OpenAPIFetcher = require('./src/utils/openapi-fetcher');
const SchemaValidator = require('./src/utils/schema-validator');
const ApiClient = require('./src/utils/api-client');

async function runDemo() {
  console.log('🚀 Calendar App API Test Suite Demo\n');
  
  try {
    // Step 1: Initialize OpenAPI fetcher
    console.log('1. Initializing OpenAPI fetcher...');
    const fetcher = new OpenAPIFetcher();
    
    // Step 2: Fetch OpenAPI specification
    console.log('2. Fetching OpenAPI specification from server...');
    const openApiSpec = await fetcher.fetchOpenAPISpec();
    
    // Step 3: Initialize schema validator
    console.log('3. Initializing schema validator...');
    const validator = new SchemaValidator(openApiSpec);
    
    // Step 4: Initialize API client
    console.log('4. Initializing API client...');
    const apiClient = new ApiClient();
    
    console.log('\n📊 OpenAPI Specification Summary:');
    console.log(`   Title: ${openApiSpec.info.title}`);
    console.log(`   Version: ${openApiSpec.info.version}`);
    console.log(`   OpenAPI Version: ${openApiSpec.openapi}`);
    
    // Step 5: List all available endpoints
    console.log('\n🔗 Available Endpoints:');
    const paths = validator.getAllPaths();
    paths.forEach(path => {
      const methods = validator.getMethodsForPath(path);
      methods.forEach(method => {
        const operationId = validator.getOperationId(path, method);
        console.log(`   ${method.toUpperCase()} ${path} (${operationId})`);
      });
    });
    
    // Step 6: Test a simple endpoint
    console.log('\n🧪 Testing API endpoints:');
    
    // Test API info endpoint
    const apiInfoResponse = await apiClient.get('/');
    console.log(`   GET / → ${apiInfoResponse.status}`);
    
    // Validate response against schema
    const validation = validator.validateResponse('/', 'get', apiInfoResponse.status, apiInfoResponse.data);
    console.log(`   Schema validation: ${validation.valid ? '✅ PASS' : '❌ FAIL'}`);
    
    // Test health endpoint
    const healthResponse = await apiClient.get('/health');
    console.log(`   GET /health → ${healthResponse.status}`);
    
    const healthValidation = validator.validateResponse('/health', 'get', healthResponse.status, healthResponse.data);
    console.log(`   Schema validation: ${healthValidation.valid ? '✅ PASS' : '❌ FAIL'}`);
    
    // Test events endpoint
    const eventsResponse = await apiClient.get('/api/events');
    console.log(`   GET /api/events → ${eventsResponse.status}`);
    
    const eventsValidation = validator.validateResponse('/api/events', 'get', eventsResponse.status, eventsResponse.data);
    console.log(`   Schema validation: ${eventsValidation.valid ? '✅ PASS' : '❌ FAIL'}`);
    
    console.log('\n✅ Demo completed successfully!');
    console.log('\n💡 To run the full test suite:');
    console.log('   npm test');
    
  } catch (error) {
    console.error('\n❌ Demo failed:', error.message);
    console.error('\n💡 Make sure the calendar-app-api server is running:');
    console.error('   cd ../calendar-app-api && npm run dev');
    process.exit(1);
  }
}

// Run the demo if this script is executed directly
if (require.main === module) {
  runDemo();
}

module.exports = { runDemo };
