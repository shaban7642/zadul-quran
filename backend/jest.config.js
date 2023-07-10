module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  roots: ['./src/tests'],
  reporters: ['default'],
  coveragePathIgnorePatterns: ['node_modules', 'tests/setups'],
  globalSetup: '<rootDir>/src/tests/setups/jest.setup.ts',
  globalTeardown: '<rootDir>/src/tests/setups/jest.teardown.ts',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: -10,
    },
  },
};
