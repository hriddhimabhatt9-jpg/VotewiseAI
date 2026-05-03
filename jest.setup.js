import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
      isLocaleDomain: false,
      isReady: true,
      isPreview: false,
    }
  },
}))

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
    }
  },
  usePathname() {
    return '/'
  },
  useSearchParams() {
    return new URLSearchParams()
  },
}))

// Mock next-themes
jest.mock('next-themes', () => ({
  useTheme() {
    return {
      theme: 'light',
      setTheme: jest.fn(),
      resolvedTheme: 'light',
    }
  },
  ThemeProvider({ children }) {
    return children
  },
}))

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => {
      const filteredProps = Object.keys(props).reduce((acc, key) => {
        if (!['initial', 'animate', 'exit', 'transition', 'whileInView', 'viewport', 'whileHover', 'whileTap'].includes(key)) {
          acc[key] = props[key]
        }
        return acc
      }, {})
      return React.createElement('div', filteredProps, children)
    },
    nav: ({ children, ...props }) => {
      const filteredProps = Object.keys(props).reduce((acc, key) => {
        if (!['initial', 'animate', 'exit', 'transition'].includes(key)) {
          acc[key] = props[key]
        }
        return acc
      }, {})
      return React.createElement('nav', filteredProps, children)
    },
    section: ({ children, ...props }) => React.createElement('section', {}, children),
    span: ({ children, ...props }) => React.createElement('span', {}, children),
  },
  AnimatePresence: ({ children }) => children,
  useAnimation: () => ({ start: jest.fn(), stop: jest.fn() }),
  useInView: () => true,
}))

// Mock Firebase
jest.mock('@/lib/firebase', () => ({
  app: {},
  auth: { currentUser: null },
  db: {},
  googleProvider: {},
  isDemoMode: true,
}))

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(),
  },
  Toaster: () => null,
}))

// Import React for createElement
const React = require('react')

// Suppress specific console warnings in tests
const originalError = console.error
const originalWarn = console.warn
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render') ||
       args[0].includes('Warning: An update to') ||
       args[0].includes('act('))
    ) {
      return
    }
    originalError.call(console, ...args)
  }
  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('punycode')
    ) {
      return
    }
    originalWarn.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
  console.warn = originalWarn
})
