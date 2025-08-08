# Calendar App API Tests

Comprehensive API integration and E2E test suite for the [calendar-app-api](https://github.com/akaplan-axian/calendar-app-api) application. Validates API endpoints against OpenAPI specifications and ensures proper functionality through automated testing.

## Quick Start

### Prerequisites
- Node.js 22+ (specified in `.nvmrc`)
- The `calendar-app-api` server running at `http://localhost:3000`
- The calendar web application running at `http://localhost:5173` (for E2E tests)

### Installation & Usage
```bash
# Clone and install
git clone https://github.com/akaplan-axian/calendar-app-tests.git
cd calendar-app-tests
npm install

# Run all tests
npm test

# Run specific test types
npm run test:api      # API integration tests
npm run test:e2e      # End-to-end browser tests
```

## Documentation

- **[API Testing Guide](docs/api-testing.md)** - Comprehensive API testing with OpenAPI validation
- **[E2E Testing Guide](docs/e2e-testing.md)** - Browser-based testing with Puppeteer
- **[Environment Configuration](docs/environment-config.md)** - Multi-environment setup and configuration
- **[Troubleshooting](docs/troubleshooting.md)** - Common issues and debugging strategies
- **[Contributing](docs/contributing.md)** - Development setup and contribution guidelines
- **[Examples](docs/examples.md)** - Code examples and usage patterns

## License

ISC License - see the [LICENSE](LICENSE) file for details.
