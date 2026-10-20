/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
const { defaults } = require('jest-config');

module.exports = {
  rootDir: process.cwd(),
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ['**/__tests__/**/*.test.tsx', '**/__tests__/**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.test.json' }],
  },
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
  reporters: [
    'default',
    [
      'jest-sonar',
      {
        outputDirectory: 'reports',
        outputName: 'sonar-reporter.xml',
      },
    ],
  ],
  coverageDirectory: 'reports/coverage',
};