module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFilesAfterEnv: ['./jest.setup.js'],
    testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  };