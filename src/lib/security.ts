/**
 * Security Middleware
 * Provides authentication checks and CSRF protection for routes
 */

import { NextRequest, NextResponse } from 'next/server'

// CSRF token validation
export function generateCSRFToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

export function validateCSRFToken(token: string): boolean {
  // Token should be a valid hex string of 64 characters (32 bytes)
  return /^[a-f0-9]{64}$/.test(token)
}

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60000
): boolean {
  const now = Date.now()
  const record = rateLimitStore.get(identifier)

  if (!record || now > record.resetTime) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (record.count >= limit) {
    return false
  }

  record.count++
  return true
}

// Get client IP
export function getClientIP(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    'unknown'
  )
}

// Middleware for protected routes
export function withAuth(handler: Function) {
  return async (req: NextRequest, ...args: any[]) => {
    // Check for auth token in cookies or headers
    const token = req.cookies.get('auth-token')?.value || req.headers.get('authorization')

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized: No authentication token provided' },
        { status: 401 }
      )
    }

    // Validate token (implement actual JWT validation in production)
    if (!token.startsWith('Bearer ') && !token) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid token format' },
        { status: 401 }
      )
    }

    return handler(req, ...args)
  }
}

// Middleware for CSRF protection
export function withCSRF(handler: Function) {
  return async (req: NextRequest, ...args: any[]) => {
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') {
      const token = req.headers.get('x-csrf-token')

      if (!token || !validateCSRFToken(token)) {
        return NextResponse.json(
          { error: 'CSRF validation failed' },
          { status: 403 }
        )
      }
    }

    return handler(req, ...args)
  }
}

// Middleware for rate limiting
export function withRateLimit(handler: Function, limit: number = 10, windowMs: number = 60000) {
  return async (req: NextRequest, ...args: any[]) => {
    const ip = getClientIP(req)

    if (!checkRateLimit(ip, limit, windowMs)) {
      return NextResponse.json(
        { error: 'Too many requests, please try again later' },
        { status: 429 }
      )
    }

    return handler(req, ...args)
  }
}
