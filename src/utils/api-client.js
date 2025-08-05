const axios = require('axios');
const config = require('../config/test-config');

class ApiClient {
  constructor(baseURL = config.serverUrl) {
    this.baseURL = baseURL;
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: config.timeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    // Add response interceptor for logging
    this.client.interceptors.response.use(
      (response) => {
        console.log(`✓ ${response.config.method.toUpperCase()} ${response.config.url} → ${response.status}`);
        return response;
      },
      (error) => {
        if (error.response) {
          console.log(`✗ ${error.config.method.toUpperCase()} ${error.config.url} → ${error.response.status}`);
        } else {
          console.log(`✗ ${error.config.method.toUpperCase()} ${error.config.url} → ${error.message}`);
        }
        return Promise.reject(error);
      }
    );
  }

  async get(path, options = {}) {
    try {
      const response = await this.client.get(path, options);
      return {
        status: response.status,
        data: response.data,
        headers: response.headers
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async post(path, data = {}, options = {}) {
    try {
      const response = await this.client.post(path, data, options);
      return {
        status: response.status,
        data: response.data,
        headers: response.headers
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async put(path, data = {}, options = {}) {
    try {
      const response = await this.client.put(path, data, options);
      return {
        status: response.status,
        data: response.data,
        headers: response.headers
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async patch(path, data = {}, options = {}) {
    try {
      const response = await this.client.patch(path, data, options);
      return {
        status: response.status,
        data: response.data,
        headers: response.headers
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async delete(path, options = {}) {
    try {
      const response = await this.client.delete(path, options);
      return {
        status: response.status,
        data: response.data,
        headers: response.headers
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response) {
      // Server responded with error status
      return {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
        error: true
      };
    } else if (error.request) {
      // Request was made but no response received
      throw new Error(`No response received from server: ${error.message}`);
    } else {
      // Something else happened
      throw new Error(`Request failed: ${error.message}`);
    }
  }

  getBaseURL() {
    return this.baseURL;
  }
}

module.exports = ApiClient;
