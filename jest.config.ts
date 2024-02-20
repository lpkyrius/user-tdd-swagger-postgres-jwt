import type {Config} from 'jest';

export default {
  // clearMocks: true,
  preset: 'ts-jest',
  rootDir: 'src/',
  testMatch: ['**/src/**/*.test.ts'],
  coveragePathIgnorePatterns: [
      'node_modules',
      'test-config',
      'interfaces',
      'jestGlobalMocks.ts',
      '.module.ts',
      'src/app.ts',
      '.mock.ts'
  ],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  coverageReporters: [
    'json',
    'text',
    'lcov',
    'clover'
  ],
   coverageThreshold: {
     global: {
       branch: 100,
       functions: 100,
       lines: 100,
       statements:100
     }
   },
  maxWorkers: '50%',
  testEnvironment: 'node',
  watchPathIgnorePatterns: [
    'node_modules'
  ],
};