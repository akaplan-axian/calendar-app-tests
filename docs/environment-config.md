# Environment Configuration

This test suite uses environment variables to configure base URLs, making it possible to run tests against different environments (local, staging, production, etc.).

## Environment Variables

### Required Environment Variables

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `API_SERVER_URL` | Backend API server URL | `http://localhost:3000` |
| `FRONTEND_URL` | Frontend application URL | `http://localhost:5173` |

## Usage Examples

### Local Development (Default)
```bash
# These are the default values, no need to set explicitly
npm run test:api
npm run test:e2e
```

### Custom Local Ports
```bash
# If your servers are running on different ports
export API_SERVER_URL=http://localhost:8080
export FRONTEND_URL=http://localhost:3000
npm run test:api
npm run test:e2e
```

### Staging Environment
```bash
export API_SERVER_URL=https://api-staging.example.com
export FRONTEND_URL=https://staging.example.com
npm run test:api
npm run test:e2e
```

### Production Environment
```bash
export API_SERVER_URL=https://api.example.com
export FRONTEND_URL=https://example.com
npm run test:api
npm run test:e2e
```

### CI/CD Pipeline
```bash
# Set environment variables in your CI/CD configuration
API_SERVER_URL=https://api-test.example.com
FRONTEND_URL=https://test.example.com
```

## Test Types and URL Usage

- **API Tests** (`tests/api/`): Use `API_SERVER_URL` for backend API calls
- **E2E Tests** (`tests/e2e/`): Use `FRONTEND_URL` for browser navigation and `API_SERVER_URL` for API operations
- **Integration Tests** (`tests/integration/`): Use `API_SERVER_URL` for backend API calls

## Configuration Files

The environment variables are centrally managed in:
- `src/config/test-config.js` - Main configuration file that reads environment variables
- `tests/e2e/setup.js` - E2E test setup that uses the configuration
- `tests/setup.js` - API test setup that uses the configuration

## Troubleshooting

If tests fail with connection errors, verify:
1. The target servers are running and accessible
2. Environment variables are set correctly
3. URLs include the correct protocol (http/https)
4. No trailing slashes in the URLs
