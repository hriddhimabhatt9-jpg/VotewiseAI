/**
 * Middleware for Route Protection
 * Ensures only authenticated users can access protected routes
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/dashboard/candidates',
  '/dashboard/chatbot',
  '/dashboard/fake-news',
  '/dashboard/leaderboard',
  '/dashboard/planner',
  '/dashboard/profile',
  '/dashboard/scanner',
  '/dashboard/simulator',
]

// Routes that should redirect to dashboard if already logged in
const authRoutes = ['/login', '/signup']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const authToken = request.cookies.get('auth-token')?.value

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  // If trying to access protected route without auth, redirect to login
  if (isProtectedRoute && !authToken) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // If logged in and trying to access auth routes, redirect to dashboard
  if (authToken && authRoutes.includes(pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // Allow request to proceed
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
}
