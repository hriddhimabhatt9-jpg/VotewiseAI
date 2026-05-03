# VotewiseAI - Actionable Recommendations

## PRIORITY 1: CRITICAL SECURITY FIXES (Next 2 Weeks)

### 1. Add Route Protection Middleware
**Issue:** Dashboard pages are publicly accessible without login  
**Impact:** 🔴 Critical - Anyone can access all features

**Implementation:**
```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get('auth-token')?.value;

  // Protected routes
  if (pathname.startsWith('/dashboard') || 
      pathname.startsWith('/chatbot') || 
      pathname.startsWith('/candidates')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/chatbot/:path*', '/candidates/:path*', '/(dashboard)/:path*']
};
```

**Effort:** 2-4 hours

### 2. Secure API Keys (Remove Client-Side Exposure)
**Issue:** Google Maps API key exposed to client  
**Impact:** 🔴 Critical - API key can be abused by attackers

**Current Problem:**
```typescript
// INSECURE - File: src/components/maps/LiveBoothMap.tsx
const [apiKey, setApiKey] = useState<string>(
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
);
```

**Solution: Implement Server-Side Proxy**
```typescript
// src/app/api/maps/route.ts (NEW FILE)
export async function POST(req: Request) {
  const { mapRequest } = await req.json();
  
  // Use server-side API key to make the request
  const response = await fetch('https://maps.googleapis.com/maps/api/..', {
    headers: {
      'X-API-Key': process.env.GOOGLE_MAPS_API_KEY, // Server-side only
    },
  });
  
  return Response.json(await response.json());
}
```

```typescript
// src/components/maps/LiveBoothMap.tsx (UPDATED)
const [apiKey, setApiKey] = useState<string>(''); // Don't expose key
useEffect(() => {
  // Use proxy endpoint instead
  setApiKey('proxy-token-only');
}, []);
```

**Effort:** 6-8 hours

### 3. Implement CSRF Protection
**Issue:** API routes accept requests without CSRF tokens  
**Impact:** 🔴 Critical - Vulnerable to cross-site forgeries

**Solution:**
```typescript
// Add to all API routes
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const csrfToken = req.headers.get('x-csrf-token');
  const storedToken = cookieStore.get('csrf-token')?.value;

  if (csrfToken !== storedToken) {
    return NextResponse.json(
      { error: 'CSRF validation failed' },
      { status: 403 }
    );
  }

  // Continue with request...
}
```

**Effort:** 4-6 hours

### 4. Add Input Validation & XSS Prevention
**Issue:** User input not validated or escaped  
**Impact:** 🔴 Critical - XSS vulnerabilities

**Solution:**
```typescript
// src/lib/sanitize.ts (NEW FILE)
import DOMPurify from 'isomorphic-dompurify';

export function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
}

export function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Usage in chatbot
const sanitizedMessage = sanitizeInput(userInput);
const messages = [...prev, { role: 'user', content: sanitizedMessage }];
```

**Dependencies to Add:**
```bash
npm install isomorphic-dompurify
```

**Effort:** 4-6 hours

### 5. Implement Rate Limiting
**Issue:** API endpoints have no throttling  
**Impact:** 🔴 Critical - Vulnerable to DoS/brute force

**Solution:**
```typescript
// src/lib/rateLimit.ts (NEW FILE)
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 h'), // 10 requests per hour
});

export async function checkRateLimit(identifier: string) {
  const { success, limit, reset, remaining } = await ratelimit.limit(identifier);
  
  if (!success) {
    return {
      success: false,
      error: 'Rate limit exceeded',
      reset: new Date(reset * 1000),
    };
  }
  
  return { success: true };
}

// Usage in API route
import { checkRateLimit } from '@/lib/rateLimit';

export async function POST(req: Request) {
  const userIp = req.headers.get('x-forwarded-for') || 'unknown';
  const rateLimitResult = await checkRateLimit(userIp);

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: rateLimitResult.error },
      { status: 429 }
    );
  }
  
  // Continue...
}
```

**Dependencies to Add:**
```bash
npm install @upstash/ratelimit @upstash/redis
```

**Env Vars Needed:**
```
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

**Effort:** 6-8 hours

### 6. Fix Weak Password Policy
**Issue:** Only 6-character minimum password  
**Impact:** 🔴 Critical - Easy to brute force

**Solution:**
```typescript
// src/lib/validations.ts (UPDATE)
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string()
    .min(12, "Password must be at least 12 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
});

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string()
    .min(12, "Password must be at least 12 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
```

**Effort:** 2-3 hours

---

## PRIORITY 2: TESTING INFRASTRUCTURE (Weeks 3-4)

### 1. Install Jest & React Testing Library
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install --save-dev @types/jest jest-environment-jsdom
```

### 2. Create Jest Config
```typescript
// jest.config.ts
import type { Config } from 'jest';
import nextJest from 'next/jest';

const createJestConfig = nextJest({
  dir: './',
});

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};

export default createJestConfig(config);
```

### 3. Update package.json
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### 4. Test Critical Auth Functions
```typescript
// src/hooks/__tests__/useAuth.test.ts
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../useAuth';

describe('useAuth', () => {
  it('should initialize with null user', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toBeNull();
  });

  it('should handle email signup', async () => {
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await result.current.signup('test@example.com', 'Test@Password123', 'Test User');
    });
    
    expect(result.current.user).not.toBeNull();
    expect(result.current.user?.email).toBe('test@example.com');
  });

  // More tests...
});
```

**Effort:** 20-30 hours (for comprehensive coverage)

---

## PRIORITY 3: PERFORMANCE OPTIMIZATION (Weeks 5-6)

### 1. Add SWR for Caching
```bash
npm install swr
```

```typescript
// src/app/(dashboard)/chatbot/page.tsx
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function ChatbotPage() {
  const { data: chatHistory, mutate } = useSWR('/api/chat/history', fetcher);

  const handleSubmit = async (message: string) => {
    // Optimistic update
    mutate(
      [...(chatHistory || []), { role: 'user', content: message }],
      false
    );

    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ messages: [...(chatHistory || []), { role: 'user', content: message }] }),
    });

    // Revalidate cache
    mutate();
  };

  // ...
}
```

**Effort:** 8-12 hours

### 2. Add Bundle Analysis
```bash
npm install --save-dev @next/bundle-analyzer
```

```javascript
// next.config.ts
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // ... rest of config
});
```

**Effort:** 2 hours

### 3. Fix Hydration Issues
```typescript
// src/components/providers/ClientProvider.tsx
'use client';

import { useEffect, useState } from 'react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';

export function ClientProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by waiting for mount
  if (!mounted) {
    return children; // or loading skeleton
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
      <Toaster />
    </ThemeProvider>
  );
}
```

**Effort:** 4-6 hours

---

## PRIORITY 4: ERROR HANDLING & MONITORING (Week 7)

### 1. Add Sentry for Error Tracking
```bash
npm install @sentry/nextjs
```

```typescript
// src/instrumentation.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  integrations: [
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  tracesSampleRate: 1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

**Effort:** 4-6 hours

### 2. Add React Error Boundary
```typescript
// src/components/ErrorBoundary.tsx
'use client';

import { Component, ReactNode } from 'react';
import * as Sentry from '@sentry/nextjs';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

interface Props {
  children: ReactNode;
}

export class ErrorBoundary extends Component<Props> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    Sentry.captureException(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card className="m-4 p-6">
          <h2 className="text-xl font-bold mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{this.state.error?.message}</p>
          <Button onClick={() => window.location.href = '/'}>
            Return to Home
          </Button>
        </Card>
      );
    }

    return this.props.children;
  }
}
```

**Effort:** 3-4 hours

---

## PRIORITY 5: ACCESSIBILITY IMPROVEMENTS (Week 8)

### 1. Add Accessibility Props to Components
```typescript
// src/components/ui/Button.tsx (UPDATE)
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  ariaLabel?: string;
  children: React.ReactNode;
}

export function Button({
  ariaLabel,
  ...props
}: ButtonProps) {
  return (
    <button
      aria-label={ariaLabel || props.title}
      {...props}
    >
      {/* ... */}
    </button>
  );
}
```

### 2. Add Semantic HTML
```typescript
// Use <nav> instead of <div className="nav">
// Use <main> instead of <div className="main">
// Use <article> instead of <div className="article">
```

**Effort:** 6-8 hours

---

## SUMMARY OF COSTS & TIMELINE

| Task | Effort | Timeline | Priority |
|------|--------|----------|----------|
| Route Protection | 2-4h | Week 1 | 🔴 Critical |
| Secure API Keys | 6-8h | Week 1-2 | 🔴 Critical |
| CSRF Protection | 4-6h | Week 2 | 🔴 Critical |
| Input Validation | 4-6h | Week 2 | 🔴 Critical |
| Rate Limiting | 6-8h | Week 2 | 🔴 Critical |
| Password Policy | 2-3h | Week 2 | 🔴 Critical |
| Testing Setup | 20-30h | Weeks 3-4 | 🟠 High |
| Performance Opt. | 12-20h | Weeks 5-6 | 🟡 Medium |
| Error Tracking | 7-10h | Week 7 | 🟡 Medium |
| Accessibility | 6-8h | Week 8 | 🟢 Low |

**Total Effort:** ~70-100 hours  
**Total Timeline:** 8 weeks (1.5 developers)

---

## Immediate Actions (This Week)

1. ✅ Read this document
2. ✅ Create `src/middleware.ts` for route protection
3. ✅ Move Google Maps API to server-side proxy
4. ✅ Add CSRF token validation to API routes
5. ✅ Install DOMPurify for input sanitization
6. ✅ Update password validation to be stronger
7. ✅ Create a GitHub issue for each fix
8. ✅ Set up a sprint to tackle critical security issues

---

*Recommendations compiled: May 3, 2026*  
*Implementation difficulty: Medium*  
*Business impact if not addressed: High (data breach risk)*
