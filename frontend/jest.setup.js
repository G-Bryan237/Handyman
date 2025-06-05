const { configure } = require('jest');

configure({
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['./jest.setup.js'],
});