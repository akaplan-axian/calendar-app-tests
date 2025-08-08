const path = require('path');
const fs = require('fs');

// Import existing API utilities for integration
const ApiClient = require('../../src/utils/api-client');
const config = require('../../src/config/test-config');

// Global E2E test variables
global.BASE_URL = config.frontendUrl;
global.apiClient = null;

// Setup before all E2E tests
beforeAll(async () => {
  console.log('🎭 Setting up E2E test suite...');
  
  try {
    // Initialize API client for backend operations during E2E tests
    global.apiClient = new ApiClient();
    console.log(`✓ API client initialized (${global.apiClient.getBaseURL()})`);
    
    // Ensure screenshots directory exists
    const screenshotsDir = path.join(__dirname, '../../screenshots');
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }
    
    console.log('✅ E2E test suite setup complete');
    
  } catch (error) {
    console.error('❌ E2E test suite setup failed:', error.message);
    process.exit(1);
  }
});

// Setup before each test
beforeEach(async () => {
  try {
    // Navigate to the base URL before each test with reduced wait conditions
    await page.goto(global.BASE_URL, { 
      waitUntil: 'domcontentloaded',
      timeout: 10000 
    });
  } catch (error) {
    console.warn(`⚠️ Failed to navigate to ${global.BASE_URL}: ${error.message}`);
    // Continue with test - some tests might not need the actual page
  }
});

// Cleanup after each test
afterEach(async () => {
  // Take screenshot on test failure - Jest doesn't have jasmine.currentSpec
  // Screenshots will be taken manually in tests when needed
});

// Cleanup after all tests
afterAll(async () => {
  console.log('🧹 Cleaning up E2E test suite...');
  // Add any cleanup logic here if needed
});

// Helper functions for E2E tests
global.waitForSelector = async (selector, options = {}) => {
  const defaultOptions = { visible: true, timeout: 10000 };
  return await page.waitForSelector(selector, { ...defaultOptions, ...options });
};

global.waitForText = async (text, options = {}) => {
  const defaultOptions = { timeout: 10000 };
  return await page.waitForFunction(
    (text) => document.body.innerText.includes(text),
    { ...defaultOptions, ...options },
    text
  );
};

global.takeScreenshot = async (name) => {
  const screenshotPath = path.join(__dirname, '../../screenshots', `${name}.png`);
  await page.screenshot({ 
    path: screenshotPath,
    fullPage: true 
  });
  console.log(`📸 Screenshot saved: ${screenshotPath}`);
  return screenshotPath;
};

global.clearAndType = async (selector, text) => {
  await page.click(selector, { clickCount: 3 }); // Select all text
  await page.keyboard.press('Backspace'); // Clear
  await page.type(selector, text);
};

global.waitForNavigation = async (options = {}) => {
  const defaultOptions = { waitUntil: 'networkidle0', timeout: 30000 };
  return await page.waitForNavigation({ ...defaultOptions, ...options });
};

// Custom Jest matchers for E2E testing
expect.extend({
  async toBeVisible(selector) {
    try {
      await page.waitForSelector(selector, { visible: true, timeout: 5000 });
      return {
        message: () => `Expected element ${selector} not to be visible`,
        pass: true
      };
    } catch (error) {
      return {
        message: () => `Expected element ${selector} to be visible`,
        pass: false
      };
    }
  },

  async toHaveText(selector, expectedText) {
    try {
      await page.waitForSelector(selector, { timeout: 5000 });
      const element = await page.$(selector);
      const actualText = await page.evaluate(el => el.textContent, element);
      
      const pass = actualText.includes(expectedText);
      return {
        message: () => pass 
          ? `Expected element ${selector} not to contain text "${expectedText}"`
          : `Expected element ${selector} to contain text "${expectedText}", but got "${actualText}"`,
        pass
      };
    } catch (error) {
      return {
        message: () => `Expected element ${selector} to contain text "${expectedText}", but element was not found`,
        pass: false
      };
    }
  }
});
