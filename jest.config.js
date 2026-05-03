const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
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
    'src/components/chat/**/*.{js,jsx,ts,tsx}',
    'src/components/maps/**/*.{js,jsx,ts,tsx}',
    'src/components/layout/**/*.{js,jsx,ts,tsx}',
    'src/services/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/performance.tsx',
    '!src/**/accessibility.tsx',
    '!src/lib/firebase.ts',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
  ],
  coverageThreshold: {
    global: {
      branches: 45,
      functions: 55,
      lines: 55,
      statements: 55,
    },
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(firebase|@firebase|openai|@vis.gl|@google)/)',
  ],
}

module.exports = createJestConfig(customJestConfig)
