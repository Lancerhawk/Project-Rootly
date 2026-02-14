const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Load .env manually to avoid dependencies
const envPath = path.join(__dirname, '../.env');
let env = {};
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            env[key.trim()] = value.trim();
        }
    });
}

const ROOTLY_API_URL = env.ROOTLY_API_URL || process.env.ROOTLY_API_URL || 'http://localhost:3000';

console.log('Building Rootly Runtime SDK...');

// Run TypeScript compiler
try {
    execSync('tsc', { stdio: 'inherit' });
    console.log('TypeScript compilation successful.');
} catch (error) {
    console.error('TypeScript compilation failed.');
    process.exit(1);
}

// Replace placeholder in dist/index.js
const indexPath = path.join(__dirname, '../dist/index.js');
if (fs.existsSync(indexPath)) {
    let content = fs.readFileSync(indexPath, 'utf8');

    if (content.includes('__ROOTLY_API_URL_PLACEHOLDER__')) {
        content = content.replace(/__ROOTLY_API_URL_PLACEHOLDER__/g, ROOTLY_API_URL);
        fs.writeFileSync(indexPath, content);
        console.log(`Replaced placeholder with: ${ROOTLY_API_URL}`);
    } else {
        console.warn('Warning: Placeholder __ROOTLY_API_URL_PLACEHOLDER__ not found in dist/index.js');
    }
} else {
    console.error('Error: dist/index.js not found.');
    process.exit(1);
}

console.log('Build completed successfully.');
