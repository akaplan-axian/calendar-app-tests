const axios = require('axios');
const config = require('../config/test-config');

class OpenAPIFetcher {
  constructor() {
    this.openApiSpec = null;
    this.serverUrl = config.serverUrl;
  }

  async fetchOpenAPISpec() {
    try {
      // First, verify server is running by checking health endpoint
      await this.checkServerHealth();
      
      // Fetch the OpenAPI specification
      const response = await axios.get(`${this.serverUrl}${config.openApiEndpoint}`, {
        timeout: config.timeout,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.data || typeof response.data !== 'object') {
        throw new Error('Invalid OpenAPI specification received - not a valid JSON object');
      }

      // Basic validation that this looks like an OpenAPI spec
      if (!response.data.openapi && !response.data.swagger) {
        throw new Error('Response does not appear to be a valid OpenAPI specification');
      }

      this.openApiSpec = response.data;
      console.log(`✓ Successfully fetched OpenAPI spec (version: ${response.data.info?.version || 'unknown'})`);
      
      return this.openApiSpec;
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        throw new Error(
          `Cannot connect to calendar-app-api server at ${this.serverUrl}. ` +
          `Please ensure the server is running before executing tests.`
        );
      }
      
      if (error.response) {
        throw new Error(
          `Failed to fetch OpenAPI schema from ${this.serverUrl}${config.openApiEndpoint}. ` +
          `Server responded with status ${error.response.status}: ${error.response.statusText}`
        );
      }
      
      throw new Error(
        `Failed to fetch OpenAPI schema from ${this.serverUrl}${config.openApiEndpoint}. ` +
        `Error: ${error.message}`
      );
    }
  }

  async checkServerHealth() {
    try {
      const response = await axios.get(`${this.serverUrl}${config.healthEndpoint}`, {
        timeout: config.timeout
      });
      
      if (response.status !== 200) {
        throw new Error(`Health check failed with status ${response.status}`);
      }
      
      console.log('✓ Server health check passed');
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        throw new Error(
          `Cannot connect to calendar-app-api server at ${this.serverUrl}. ` +
          `Please start the server before running tests.`
        );
      }
      throw error;
    }
  }

  getOpenAPISpec() {
    if (!this.openApiSpec) {
      throw new Error('OpenAPI specification not loaded. Call fetchOpenAPISpec() first.');
    }
    return this.openApiSpec;
  }

  getServerUrl() {
    return this.serverUrl;
  }
}

module.exports = OpenAPIFetcher;
