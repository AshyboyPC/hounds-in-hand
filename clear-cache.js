#!/usr/bin/env node

/**
 * Cache Clearing Helper Script
 * Run this if you're seeing old versions of the app after changes
 */

const fs = require('fs');
const path = require('path');

console.log('🧹 Clearing development cache...\n');

// Clear common cache directories
const cacheDirs = [
  'node_modules/.vite',
  'node_modules/.cache',
  'dist',
  '.vite'
];

cacheDirs.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ Clearing ${dir}`);
    fs.rmSync(fullPath, { recursive: true, force: true });
  } else {
    console.log(`⏭️  ${dir} doesn't exist, skipping`);
  }
});

console.log('\n🎉 Cache cleared! Now:');
console.log('1. Restart your dev server: npm run dev');
console.log('2. Hard refresh your browser: Ctrl+Shift+R (or Cmd+Shift+R on Mac)');
console.log('3. Or use incognito mode to test');
console.log('\n💡 Tip: Keep DevTools open with "Disable cache" checked during development');