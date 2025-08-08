const { execSync } = require('child_process');

module.exports = async () => {
  console.log('🚀 Setting up E2E test environment...');
  
  // Check if the web application is running on localhost:5173
  try {
    const response = await fetch('http://localhost:5173');
    if (response.ok) {
      console.log('✅ Web application is running on http://localhost:5173');
    } else {
      throw new Error(`Server responded with status: ${response.status}`);
    }
  } catch (error) {
    console.error('❌ Web application is not accessible at http://localhost:5173');
    console.error('💡 Make sure to start the web application before running E2E tests.');
    console.error('   You can typically start it with: npm run dev');
    process.exit(1);
  }
  
  console.log('✅ E2E test environment setup complete');
};
