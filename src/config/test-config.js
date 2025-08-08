module.exports = {
  serverUrl: process.env.API_SERVER_URL || 'http://localhost:3000',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  timeout: 10000,
  retries: 0, // No retries - fail fast
  openApiEndpoint: '/api/openapi.json',
  healthEndpoint: '/health'
};
