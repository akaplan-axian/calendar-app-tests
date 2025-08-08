/**
 * Browser helper utilities for E2E tests
 */

class BrowserHelpers {
  constructor(page) {
    this.page = page;
  }

  /**
   * Wait for network to be idle (no requests for specified time)
   */
  async waitForNetworkIdle(timeout = 2000) {
    await this.page.waitForTimeout(timeout);
  }

  /**
   * Intercept network requests
   */
  async interceptRequests(urlPattern, handler) {
    await this.page.setRequestInterception(true);
    this.page.on('request', handler);
  }

  /**
   * Mock API responses
   */
  async mockApiResponse(url, response) {
    await this.page.setRequestInterception(true);
    this.page.on('request', request => {
      if (request.url().includes(url)) {
        request.respond({
          status: response.status || 200,
          contentType: 'application/json',
          body: JSON.stringify(response.body || {})
        });
      } else {
        request.continue();
      }
    });
  }

  /**
   * Wait for specific network request
   */
  async waitForRequest(urlPattern, timeout = 30000) {
    return await this.page.waitForRequest(urlPattern, { timeout });
  }

  /**
   * Wait for specific network response
   */
  async waitForResponse(urlPattern, timeout = 30000) {
    return await this.page.waitForResponse(urlPattern, { timeout });
  }

  /**
   * Get all network requests made during test
   */
  getNetworkRequests() {
    return this.requests || [];
  }

  /**
   * Start monitoring network requests
   */
  startNetworkMonitoring() {
    this.requests = [];
    this.page.on('request', request => {
      this.requests.push({
        url: request.url(),
        method: request.method(),
        headers: request.headers(),
        postData: request.postData()
      });
    });
  }

  /**
   * Stop monitoring network requests
   */
  stopNetworkMonitoring() {
    this.page.removeAllListeners('request');
    this.requests = [];
  }

  /**
   * Take screenshot with timestamp
   */
  async takeTimestampedScreenshot(name) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${name}_${timestamp}.png`;
    const path = `screenshots/${filename}`;
    
    await this.page.screenshot({ 
      path,
      fullPage: true 
    });
    
    console.log(`📸 Screenshot saved: ${path}`);
    return path;
  }

  /**
   * Scroll to bottom of page
   */
  async scrollToBottom() {
    await this.page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
  }

  /**
   * Scroll to top of page
   */
  async scrollToTop() {
    await this.page.evaluate(() => {
      window.scrollTo(0, 0);
    });
  }

  /**
   * Get console logs
   */
  getConsoleLogs() {
    return this.consoleLogs || [];
  }

  /**
   * Start monitoring console logs
   */
  startConsoleMonitoring() {
    this.consoleLogs = [];
    this.page.on('console', msg => {
      this.consoleLogs.push({
        type: msg.type(),
        text: msg.text(),
        timestamp: new Date().toISOString()
      });
    });
  }

  /**
   * Stop monitoring console logs
   */
  stopConsoleMonitoring() {
    this.page.removeAllListeners('console');
    this.consoleLogs = [];
  }

  /**
   * Wait for element to be stable (not moving)
   */
  async waitForElementStable(selector, timeout = 5000) {
    const element = await this.page.waitForSelector(selector);
    
    let previousPosition = await element.boundingBox();
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      await this.page.waitForTimeout(100);
      const currentPosition = await element.boundingBox();
      
      if (JSON.stringify(previousPosition) === JSON.stringify(currentPosition)) {
        return element;
      }
      
      previousPosition = currentPosition;
    }
    
    return element;
  }

  /**
   * Drag and drop element
   */
  async dragAndDrop(sourceSelector, targetSelector) {
    const source = await this.page.waitForSelector(sourceSelector);
    const target = await this.page.waitForSelector(targetSelector);
    
    const sourceBounds = await source.boundingBox();
    const targetBounds = await target.boundingBox();
    
    await this.page.mouse.move(
      sourceBounds.x + sourceBounds.width / 2,
      sourceBounds.y + sourceBounds.height / 2
    );
    
    await this.page.mouse.down();
    
    await this.page.mouse.move(
      targetBounds.x + targetBounds.width / 2,
      targetBounds.y + targetBounds.height / 2
    );
    
    await this.page.mouse.up();
  }

  /**
   * Clear browser storage
   */
  async clearStorage() {
    await this.page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  }

  /**
   * Set local storage item
   */
  async setLocalStorage(key, value) {
    await this.page.evaluate(
      ({ key, value }) => localStorage.setItem(key, value),
      { key, value }
    );
  }

  /**
   * Get local storage item
   */
  async getLocalStorage(key) {
    return await this.page.evaluate(
      key => localStorage.getItem(key),
      key
    );
  }

  /**
   * Wait for page to be fully loaded
   */
  async waitForPageLoad() {
    await this.page.waitForSelector('body');
    await this.page.waitForTimeout(1000); // Simple wait for network idle
  }
}

module.exports = BrowserHelpers;
