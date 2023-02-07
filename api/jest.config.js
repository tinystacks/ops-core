module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testPathIgnorePatterns: ['.d.ts', '.js'],
    verbose: true,
    roots: [
      "<rootDir>/test",
      "<rootDir>/src"
    ],
    collectCoverageFrom: [
      "src/**/*.ts"
    ],
    coveragePathIgnorePatterns: [
      'src/server.ts',
      'src/classes/*'
    ],
    coverageThreshold: {
      global: {
        branches: 90,
        functions: 90,
        lines: 90,
        statements: 90
      }
    }
  };