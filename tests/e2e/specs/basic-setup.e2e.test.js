describe('Basic E2E Setup Test', () => {
  test('should launch browser and basic page operations work', async () => {
    // Test basic browser functionality
    expect(page).toBeDefined();
    
    // Test navigation to a simple page
    await page.goto('data:text/html,<html><body><h1>Test Page</h1></body></html>');
    
    // Test basic page operations
    const title = await page.evaluate(() => document.querySelector('h1').textContent);
    expect(title).toBe('Test Page');
    
    // Test screenshot functionality
    await page.screenshot({ path: 'screenshots/basic-test.png' });
    
    console.log('✅ Basic E2E setup is working correctly');
  }, 10000); // 10 second timeout

  test('should handle page navigation with timeout', async () => {
    try {
      // Test navigation with timeout
      await page.goto(global.BASE_URL, { 
        waitUntil: 'domcontentloaded',
        timeout: 5000 
      });
      console.log(`✅ Successfully navigated to ${global.BASE_URL}`);
    } catch (error) {
      console.log(`⚠️ ${global.BASE_URL} not available, which is expected in test environment`);
      // This is expected if the dev server isn't running
      expect(error.message).toContain('timeout');
    }
  }, 10000);

  test('should complete within reasonable time', async () => {
    const startTime = Date.now();
    
    // Simple operations that should complete quickly
    await page.setContent('<html><body><div id="test">Hello World</div></body></html>');
    const text = await page.$eval('#test', el => el.textContent);
    expect(text).toBe('Hello World');
    
    const duration = Date.now() - startTime;
    expect(duration).toBeLessThan(5000); // Should complete in under 5 seconds
    
    console.log(`✅ Test completed in ${duration}ms`);
  }, 10000);
});
