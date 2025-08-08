module.exports = {
  preset: 'jest-puppeteer',
  setupFilesAfterEnv: ['<rootDir>/tests/e2e/setup.js'],
  testMatch: [
    '<rootDir>/tests/e2e/**/*.e2e.test.js'
  ],
  collectCoverageFrom: [
    'tests/e2e/**/*.js',
    '!tests/e2e/**/*.test.js'
  ],
  coverageDirectory: 'coverage-e2e',
  coverageReporters: ['text', 'lcov', 'html'],
  verbose: true,
  testTimeout: 60000, // 60 seconds for browser operations
  maxWorkers: 1 // Run E2E tests sequentially to avoid conflicts
};
