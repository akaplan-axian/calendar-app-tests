const { execSync } = require('child_process');
const config = require('../../src/config/test-config');

module.exports = async () => {
  console.log('🚀 Setting up E2E test environment...');
  
  // Check if the web application is running
  try {
    const response = await fetch(config.frontendUrl);
    if (response.ok) {
      console.log(`✅ Web application is running on ${config.frontendUrl}`);
    } else {
      throw new Error(`Server responded with status: ${response.status}`);
    }
  } catch (error) {
    console.error(`❌ Web application is not accessible at ${config.frontendUrl}`);
    console.error('💡 Make sure to start the web application before running E2E tests.');
    console.error('   You can typically start it with: npm run dev');
    process.exit(1);
  }
  
  console.log('✅ E2E test environment setup complete');
};
