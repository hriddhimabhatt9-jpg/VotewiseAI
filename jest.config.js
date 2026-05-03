const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  testMatch: [
    '**/__tests__/**/*.test.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  collectCoverageFrom: [
    'src/lib/**/*.{js,jsx,ts,tsx}',
    'src/store/**/*.{js,jsx,ts,tsx}',
    'src/hooks/**/*.{js,jsx,ts,tsx}',
    'src/components/ui/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/performance.ts',
    '!src/**/accessibility.tsx',
    '!src/lib/firebase.ts',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 85,
      lines: 90,
      statements: 90,
    },
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(firebase|@firebase|openai|@vis.gl)/)',
  ],
}

module.exports = createJestConfig(customJestConfig)
