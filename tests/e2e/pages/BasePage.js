const path = require('path');

class BasePage {
  constructor() {
    this.page = page;
    this.baseUrl = global.BASE_URL;
  }

  async goto(path = '') {
    const url = `${this.baseUrl}${path}`;
    await this.page.goto(url, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
  }

  async waitForSelector(selector, options = {}) {
    const defaultOptions = { visible: true, timeout: 10000 };
    return await this.page.waitForSelector(selector, { ...defaultOptions, ...options });
  }

  async click(selector, options = {}) {
    await this.waitForSelector(selector);
    return await this.page.click(selector, options);
  }

  async type(selector, text, options = {}) {
    await this.waitForSelector(selector);
    return await this.page.type(selector, text, options);
  }

  async clearAndType(selector, text) {
    await this.waitForSelector(selector);
    await this.page.click(selector, { clickCount: 3 }); // Select all text
    await this.page.keyboard.press('Backspace'); // Clear
    await this.page.type(selector, text);
  }

  async getText(selector) {
    await this.waitForSelector(selector);
    return await this.page.$eval(selector, el => el.textContent.trim());
  }

  async getValue(selector) {
    await this.waitForSelector(selector);
    return await this.page.$eval(selector, el => el.value);
  }

  async isVisible(selector) {
    try {
      await this.page.waitForSelector(selector, { visible: true, timeout: 5000 });
      return true;
    } catch (error) {
      return false;
    }
  }

  async isHidden(selector) {
    try {
      await this.page.waitForSelector(selector, { hidden: true, timeout: 5000 });
      return true;
    } catch (error) {
      return false;
    }
  }

  async waitForText(text, options = {}) {
    const defaultOptions = { timeout: 10000 };
    return await this.page.waitForFunction(
      (text) => document.body.innerText.includes(text),
      { ...defaultOptions, ...options },
      text
    );
  }

  async takeScreenshot(name) {
    const screenshotPath = path.join(__dirname, '../../../screenshots', `${name}.png`);
    await this.page.screenshot({ 
      path: screenshotPath,
      fullPage: true 
    });
    console.log(`📸 Screenshot saved: ${screenshotPath}`);
    return screenshotPath;
  }

  async waitForNavigation(options = {}) {
    const defaultOptions = { waitUntil: 'networkidle0', timeout: 30000 };
    return await this.page.waitForNavigation({ ...defaultOptions, ...options });
  }

  async scrollToElement(selector) {
    await this.waitForSelector(selector);
    await this.page.evaluate((selector) => {
      const element = document.querySelector(selector);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, selector);
    // Wait a bit for smooth scrolling to complete
    await this.page.waitForTimeout(500);
  }

  async hover(selector) {
    await this.waitForSelector(selector);
    return await this.page.hover(selector);
  }

  async selectOption(selector, value) {
    await this.waitForSelector(selector);
    return await this.page.select(selector, value);
  }

  async getElementCount(selector) {
    return await this.page.$$eval(selector, elements => elements.length);
  }

  async waitForElementCount(selector, expectedCount, timeout = 10000) {
    return await this.page.waitForFunction(
      (selector, expectedCount) => {
        const elements = document.querySelectorAll(selector);
        return elements.length === expectedCount;
      },
      { timeout },
      selector,
      expectedCount
    );
  }

  async getPageTitle() {
    return await this.page.title();
  }

  async getCurrentUrl() {
    return this.page.url();
  }

  async reload() {
    await this.page.reload({ waitUntil: 'networkidle0' });
  }

  async goBack() {
    await this.page.goBack({ waitUntil: 'networkidle0' });
  }

  async goForward() {
    await this.page.goForward({ waitUntil: 'networkidle0' });
  }
}

module.exports = BasePage;
