# VotewiseAI - Code Improvements Implementation Guide

This document provides ready-to-implement code for project improvements mentioned in the main deployment guide.

---

## 1. Rate Limiter Utility

**File**: `src/lib/rateLimiter.ts` (Create new)

```typescript
/**
 * Client-side rate limiter to prevent accidental DOS and improve UX
 * Prevents duplicate submissions and excessive API calls
 */

export class RateLimiter {
  private requests: number[] = []
  private maxRequests: number
  private windowMs: number

  constructor(maxRequests: number, windowMs: number) {
    this.maxRequests = maxRequests
    this.windowMs = windowMs
  }

  /**
   * Check if action is allowed
   * @returns true if allowed, false if rate limited
   */
  isAllowed(): boolean {
    const now = Date.now()
    
    // Remove old requests outside the window
    this.requests = this.requests.filter(time => now - time < this.windowMs)
    
    // Check if we've exceeded the limit
    if (this.requests.length >= this.maxRequests) {
      return false
    }
    
    // Record this request
    this.requests.push(now)
    return true
  }

  /**
   * Get time until next request is allowed (ms)
   * @returns 0 if allowed, or milliseconds to wait
   */
  getRetryAfter(): number {
    if (this.requests.length === 0) return 0
    
    const now = Date.now()
    const oldestRequest = this.requests[0]
    const timeSinceOldest = now - oldestRequest
    
    return Math.max(0, this.windowMs - timeSinceOldest)
  }
}

// Pre-configured limiters for common endpoints
export const chatRateLimiter = new RateLimiter(30, 60000) // 30 per minute
export const loginRateLimiter = new RateLimiter(5, 900000) // 5 per 15 minutes
export const signupRateLimiter = new RateLimiter(3, 3600000) // 3 per hour
```

**Usage in Chatbot**:

Update `src/app/(dashboard)/chatbot/page.tsx`:

```typescript
import { chatRateLimiter } from '@/lib/rateLimiter'
import { toast } from 'react-hot-toast'

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  if (!input.trim() || isLoading) return

  // NEW: Check rate limit
  if (!chatRateLimiter.isAllowed()) {
    const retryAfter = chatRateLimiter.getRetryAfter()
    const seconds = Math.ceil(retryAfter / 1000)
    toast.error(`Too many messages. Wait ${seconds}s before sending again.`)
    return
  }

  // ... rest of existing code ...
}
```

---

## 2. Enhanced Input Validation

**File**: `src/lib/validation.ts` (Update existing)

Add these validation functions:

```typescript
/**
 * Comprehensive validation patterns
 */
export const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  phone: /^[0-9]{10}$/,
  aadhar: /^[0-9]{12}$/,
  name: /^[a-zA-Z\s'-]{2,50}$/,
  url: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
}

/**
 * Validate email with detailed feedback
 */
export function validateEmail(email: string): {
  valid: boolean
  error?: string
  sanitized: string
} {
  const trimmed = email.trim().toLowerCase()
  
  if (!trimmed) {
    return { valid: false, error: 'Email is required', sanitized: '' }
  }
  
  if (!VALIDATION_PATTERNS.email.test(trimmed)) {
    return { valid: false, error: 'Invalid email format', sanitized: '' }
  }
  
  if (trimmed.length > 255) {
    return { valid: false, error: 'Email too long', sanitized: '' }
  }
  
  return { valid: true, sanitized: trimmed }
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): {
  valid: boolean
  error?: string
  strength: 'weak' | 'medium' | 'strong'
} {
  if (!password) {
    return { 
      valid: false, 
      error: 'Password is required',
      strength: 'weak'
    }
  }
  
  if (password.length < 8) {
    return {
      valid: false,
      error: 'Password must be at least 8 characters',
      strength: 'weak'
    }
  }
  
  let strength: 'weak' | 'medium' | 'strong' = 'weak'
  
  // Check for character variety
  let varietyScore = 0
  if (/[a-z]/.test(password)) varietyScore++
  if (/[A-Z]/.test(password)) varietyScore++
  if (/[0-9]/.test(password)) varietyScore++
  if (/[@$!%*?&]/.test(password)) varietyScore++
  
  if (varietyScore >= 3) strength = 'medium'
  if (varietyScore === 4 && password.length >= 12) strength = 'strong'
  
  const valid = VALIDATION_PATTERNS.password.test(password)
  
  return {
    valid,
    error: valid ? undefined : 'Password must include uppercase, lowercase, number, and special character',
    strength
  }
}

/**
 * Validate name
 */
export function validateName(name: string): {
  valid: boolean
  error?: string
  sanitized: string
} {
  const trimmed = name.trim()
  
  if (!trimmed) {
    return { valid: false, error: 'Name is required', sanitized: '' }
  }
  
  if (!VALIDATION_PATTERNS.name.test(trimmed)) {
    return {
      valid: false,
      error: 'Name can only contain letters, spaces, hyphens, and apostrophes',
      sanitized: ''
    }
  }
  
  if (trimmed.length < 2) {
    return { valid: false, error: 'Name is too short', sanitized: '' }
  }
  
  if (trimmed.length > 50) {
    return { valid: false, error: 'Name is too long', sanitized: '' }
  }
  
  return { valid: true, sanitized: trimmed }
}

/**
 * Validate phone number (Indian format)
 */
export function validatePhone(phone: string): {
  valid: boolean
  error?: string
  sanitized: string
} {
  const digits = phone.replace(/\D/g, '')
  
  if (!digits) {
    return { valid: false, error: 'Phone number is required', sanitized: '' }
  }
  
  if (digits.length !== 10) {
    return {
      valid: false,
      error: 'Phone number must be 10 digits',
      sanitized: ''
    }
  }
  
  if (digits.startsWith('0') || digits.startsWith('1')) {
    return {
      valid: false,
      error: 'Invalid phone number',
      sanitized: ''
    }
  }
  
  return { valid: true, sanitized: digits }
}
```

---

## 3. Error Boundary Component

**File**: `src/components/ErrorBoundary.tsx` (Create new)

```typescript
'use client'

import React, { ReactNode } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: (error: Error, reset: () => void) => ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo)
    }
    
    // You could also log to an error tracking service here
    // Example: Sentry.captureException(error)
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback(this.state.error!, this.resetError)
      }

      // Default error UI
      return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
            <div className="flex justify-center mb-4">
              <AlertCircle className="w-16 h-16 text-red-500" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Oops! Something went wrong
            </h1>
            
            <p className="text-gray-600 mb-4">
              We're sorry for the inconvenience. Please try reloading the page.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm font-mono text-red-600 hover:underline">
                  Error Details (Development Only)
                </summary>
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto mt-2 text-left">
                  {this.state.error.message}
                  {'\n\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}

            <div className="flex gap-3 justify-center">
              <Button 
                onClick={this.resetError}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              
              <Button
                onClick={() => window.location.href = '/'}
                className="bg-gray-600 hover:bg-gray-700"
              >
                Go Home
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
```

**Usage in Layout**:

Update `src/app/layout.tsx`:

```typescript
import { ErrorBoundary } from '@/components/ErrorBoundary'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          <ClientProvider>
            {children}
          </ClientProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
```

---

## 4. Logger Utility

**File**: `src/lib/logger.ts` (Create new)

```typescript
/**
 * Centralized logging system for development and production
 * Integrates with browser console and optional error tracking services
 */

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

export interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: Record<string, any>
  error?: Error
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'
  private logs: LogEntry[] = []
  private maxLogs = 100

  private createEntry(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    error?: Error
  ): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error,
    }
  }

  private addLog(entry: LogEntry) {
    this.logs.push(entry)
    if (this.logs.length > this.maxLogs) {
      this.logs.shift()
    }
  }

  debug(message: string, context?: Record<string, any>) {
    if (!this.isDevelopment) return

    const entry = this.createEntry(LogLevel.DEBUG, message, context)
    this.addLog(entry)
    console.debug(`[${entry.timestamp}] ${message}`, context)
  }

  info(message: string, context?: Record<string, any>) {
    const entry = this.createEntry(LogLevel.INFO, message, context)
    this.addLog(entry)

    if (this.isDevelopment) {
      console.log(`[${entry.timestamp}] ${message}`, context)
    }
  }

  warn(message: string, context?: Record<string, any>) {
    const entry = this.createEntry(LogLevel.WARN, message, context)
    this.addLog(entry)
    console.warn(`[${entry.timestamp}] ${message}`, context)
  }

  error(message: string, error?: Error, context?: Record<string, any>) {
    const entry = this.createEntry(LogLevel.ERROR, message, context, error)
    this.addLog(entry)
    console.error(`[${entry.timestamp}] ${message}`, error, context)

    // Optional: Send to error tracking service
    // Example: if (window.Sentry) Sentry.captureException(error)
  }

  /**
   * Get all logs (useful for debugging)
   */
  getLogs(): LogEntry[] {
    return this.logs
  }

  /**
   * Clear logs
   */
  clearLogs() {
    this.logs = []
  }

  /**
   * Export logs as JSON
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2)
  }
}

export const logger = new Logger()

// Make logger available globally in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).votewiseLogger = logger
}
```

**Usage Examples**:

```typescript
import { logger } from '@/lib/logger'

// In API routes
logger.info('Chat request received', { messageCount: messages.length })

// In components
logger.debug('Component mounted', { props: componentProps })

// For errors
try {
  await fetchData()
} catch (error) {
  logger.error('Failed to fetch data', error as Error, { userId: currentUser.id })
}

// Access logs in browser console (dev mode)
// window.votewiseLogger.getLogs()
// window.votewiseLogger.exportLogs()
```

---

## 5. Loading Skeleton Component

**File**: `src/components/ui/Skeleton.tsx` (Create new)

```typescript
import { cn } from '@/lib/utils'

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-slate-200 dark:bg-slate-700',
        className
      )}
      {...props}
    />
  )
}

// Pre-built skeleton components
export function CardSkeleton() {
  return (
    <div className="p-4 border rounded-lg">
      <Skeleton className="h-6 w-3/4 mb-4" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  )
}

export function TableSkeletonRow({ columns = 4 }: { columns?: number }) {
  return (
    <div className="grid gap-4 p-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} className="h-6 w-full" />
      ))}
    </div>
  )
}

export function ImageSkeleton() {
  return <Skeleton className="w-full aspect-square rounded-lg" />
}
```

**Usage in Candidates Page**:

```typescript
import { CardSkeleton } from '@/components/ui/Skeleton'

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCandidates().finally(() => setIsLoading(false))
  }, [])

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {candidates.map(candidate => (
        <CandidateCard key={candidate.id} candidate={candidate} />
      ))}
    </div>
  )
}
```

---

## 6. Response Caching Hook

**File**: `src/hooks/useCache.ts` (Create new)

```typescript
import { useCallback, useRef, useState } from 'react'

interface CacheEntry<T> {
  data: T
  timestamp: number
}

/**
 * Hook for caching API responses client-side
 * Useful for reducing API calls and improving performance
 */
export function useCache<T>(ttl: number = 5 * 60 * 1000) {
  // TTL default: 5 minutes
  
  const cacheRef = useRef<Map<string, CacheEntry<T>>>(new Map())
  const [, setVersion] = useState(0)

  const get = useCallback((key: string): T | null => {
    const entry = cacheRef.current.get(key)
    if (!entry) return null

    const isExpired = Date.now() - entry.timestamp > ttl
    if (isExpired) {
      cacheRef.current.delete(key)
      return null
    }

    return entry.data
  }, [ttl])

  const set = useCallback((key: string, data: T) => {
    cacheRef.current.set(key, {
      data,
      timestamp: Date.now(),
    })
    setVersion(v => v + 1)
  }, [])

  const clear = useCallback((key?: string) => {
    if (key) {
      cacheRef.current.delete(key)
    } else {
      cacheRef.current.clear()
    }
    setVersion(v => v + 1)
  }, [])

  return { get, set, clear }
}

// Usage example:
// const cache = useCache<CandidateData[]>(10 * 60 * 1000) // 10 min TTL
// const cachedData = cache.get('candidates')
// if (cachedData) setCandidates(cachedData)
// else {
//   fetchCandidates().then(data => {
//     setCandidates(data)
//     cache.set('candidates', data)
//   })
// }
```

---

## 7. API Helper with Timeout & Retry

**File**: `src/lib/apiClient.ts` (Create new)

```typescript
/**
 * Enhanced API client with timeout, retry, and error handling
 */

export interface ApiOptions {
  timeout?: number // milliseconds
  retries?: number
  retryDelay?: number // milliseconds
}

const DEFAULT_OPTIONS: Required<ApiOptions> = {
  timeout: 30000,
  retries: 3,
  retryDelay: 1000,
}

class ApiClient {
  /**
   * Fetch with timeout
   */
  private async fetchWithTimeout(
    url: string,
    options: RequestInit & { timeout?: number }
  ): Promise<Response> {
    const { timeout = DEFAULT_OPTIONS.timeout, ...fetchOptions } = options

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      })
      clearTimeout(timeoutId)
      return response
    } catch (error) {
      clearTimeout(timeoutId)
      throw error
    }
  }

  /**
   * Fetch with retry logic
   */
  async fetchWithRetry(
    url: string,
    options?: RequestInit & ApiOptions
  ): Promise<Response> {
    const {
      timeout = DEFAULT_OPTIONS.timeout,
      retries = DEFAULT_OPTIONS.retries,
      retryDelay = DEFAULT_OPTIONS.retryDelay,
      ...fetchOptions
    } = options || {}

    let lastError: Error | null = null

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await this.fetchWithTimeout(url, {
          ...fetchOptions,
          timeout,
        })

        // Don't retry on client errors (4xx) unless it's 429 (rate limit)
        if (!response.ok && response.status !== 429 && response.status < 500) {
          return response
        }

        if (response.ok) {
          return response
        }

        // For 5xx errors and 429, retry
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)))
          continue
        }

        return response
      } catch (error) {
        lastError = error as Error
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)))
        }
      }
    }

    throw lastError || new Error('API request failed after retries')
  }

  /**
   * GET request with automatic JSON parsing
   */
  async get<T>(
    url: string,
    options?: RequestInit & ApiOptions
  ): Promise<T> {
    const response = await this.fetchWithRetry(url, {
      ...options,
      method: 'GET',
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return response.json()
  }

  /**
   * POST request with automatic JSON parsing
   */
  async post<T>(
    url: string,
    data?: any,
    options?: RequestInit & ApiOptions
  ): Promise<T> {
    const response = await this.fetchWithRetry(url, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return response.json()
  }
}

export const apiClient = new ApiClient()

// Usage:
// const data = await apiClient.get<CandidateData[]>('/api/candidates')
// const result = await apiClient.post('/api/chat', { messages })
```

---

## 8. Analytics Hook

**File**: `src/hooks/useAnalytics.ts` (Create new)

```typescript
import { useEffect } from 'react'

/**
 * Track page views and custom events
 * Requires @vercel/analytics package
 */
export function useAnalytics() {
  useEffect(() => {
    // Track page view
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: window.location.pathname,
      })
    }
  }, [])

  const trackEvent = (name: string, params?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', name, params)
    }
  }

  return { trackEvent }
}

// Usage:
// const { trackEvent } = useAnalytics()
// trackEvent('chat_message_sent', { messageLength: 100 })
// trackEvent('candidate_viewed', { candidateName: 'John Doe' })
```

---

## 9. Toast Notification Enhancer

**File**: `src/components/Toast.tsx` (Create new)

```typescript
import { useCallback } from 'react'
import toast from 'react-hot-toast'
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react'

/**
 * Enhanced toast notifications with icons and better styling
 */
export function useToast() {
  const success = useCallback((message: string) => {
    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-in' : 'animate-out'} 
        flex items-center gap-2 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg`}>
        <CheckCircle className="w-5 h-5" />
        <span>{message}</span>
      </div>
    ))
  }, [])

  const error = useCallback((message: string) => {
    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-in' : 'animate-out'} 
        flex items-center gap-2 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg`}>
        <AlertCircle className="w-5 h-5" />
        <span>{message}</span>
      </div>
    ))
  }, [])

  const info = useCallback((message: string) => {
    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-in' : 'animate-out'} 
        flex items-center gap-2 bg-blue-500 text-white px-4 py-3 rounded-lg shadow-lg`}>
        <Info className="w-5 h-5" />
        <span>{message}</span>
      </div>
    ))
  }, [])

  const warning = useCallback((message: string) => {
    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-in' : 'animate-out'} 
        flex items-center gap-2 bg-yellow-500 text-white px-4 py-3 rounded-lg shadow-lg`}>
        <AlertTriangle className="w-5 h-5" />
        <span>{message}</span>
      </div>
    ))
  }, [])

  return { success, error, info, warning }
}

// Usage:
// const { success, error } = useToast()
// success('Login successful!')
// error('Something went wrong')
```

---

## Implementation Priority Order

1. **Rate Limiter** (Section 1) - Prevents API abuse - 30 mins
2. **Input Validation** (Section 2) - Security critical - 1 hour
3. **Error Boundary** (Section 3) - Prevents white-screen errors - 30 mins
4. **Logger** (Section 4) - Helps with debugging - 30 mins
5. **Skeleton Loader** (Section 5) - Better UX - 45 mins
6. **API Client** (Section 7) - Improves reliability - 1 hour
7. **Analytics Hook** (Section 8) - Track usage - 20 mins
8. **Toast Enhancer** (Section 9) - Better notifications - 30 mins
9. **Cache Hook** (Section 6) - Performance optimization - 30 mins

**Total Time**: ~5 hours for all improvements

---

## Testing the Implementations

After adding each utility, test with:

```bash
# Type check
npm run build

# Run tests
npm test

# Run dev server
npm run dev
```

Visit each page and verify:
- ✅ No console errors
- ✅ Loading states work
- ✅ Error handling works
- ✅ Rate limiting prevents spam
- ✅ Validation prevents invalid input

---

## Next Steps

1. Implement improvements in priority order
2. Test locally with `npm run dev`
3. Build with `npm run build`
4. Deploy to Cloud Run (follow main deployment guide)
5. Verify on https://votewiseai-830885237908.asia-south1.run.app

---

**Created**: May 2026  
**Status**: Ready for Implementation
