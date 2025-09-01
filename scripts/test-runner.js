#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

const testCommands = {
  'unit': 'jest --testPathPattern="__tests__|test|spec" --testNamePattern="unit|basic"',
  'integration': 'jest --testPathPattern="__tests__|test|spec" --testNamePattern="integration|e2e"',
  'hooks': 'jest --testPathPattern="hooks"',
  'components': 'jest --testPathPattern="components"',
  'services': 'jest --testPathPattern="services"',
  'utils': 'jest --testPathPattern="lib"',
  'coverage': 'jest --coverage --coverageReporters="text-summary" --coverageReporters="html"',
  'watch': 'jest --watch',
  'ci': 'jest --ci --coverage --watchAll=false --verbose',
  'all': 'jest'
};

const args = process.argv.slice(2);
const command = args[0] || 'all';

if (!testCommands[command]) {
  console.log('Available test commands:');
  Object.keys(testCommands).forEach(cmd => {
    console.log(`  ${cmd}: ${testCommands[cmd]}`);
  });
  process.exit(1);
}

console.log(`Running tests: ${command}`);
console.log(`Command: ${testCommands[command]}`);

try {
  execSync(testCommands[command], { 
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '..')
  });
} catch (error) {
  console.error('Tests failed:', error.message);
  process.exit(1);
}
