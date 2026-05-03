# Security Implementation Guide: Rate Limiting & CSRF Protection

## Overview

VotewiseAI implements multiple layers of security to prevent abuse, protect user data, and maintain service integrity.

## 1. Rate Limiting Implementation

### What is Rate Limiting?

Rate limiting restricts the number of requests a client can make to an API within a specific time window. It prevents:
- Brute force attacks
- DDoS attacks
- Unauthorized data scraping
- Resource exhaustion

### Current Implementation

**Location**: `src/lib/security.ts`

```typescript
export function checkRateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60000
): boolean {
  // Returns true if request is allowed, false if limit exceeded
}
```

### Configuration by Endpoint

| Endpoint | Limit | Window | Purpose |
|----------|-------|--------|---------|
| `/api/chat` | 30/min | 60s | OpenAI chatbot requests |
| `/api/login` | 5/15min | 900s | Login attempts |
| `/api/signup` | 3/hour | 3600s | Registration attempts |
| `/api/password-reset` | 3/hour | 3600s | Password reset attempts |
| `/api/candidates` | 100/min | 60s | Data API requests |

### Usage Example

```typescript
// In API route
import { getClientIP, checkRateLimit } from '@/lib/security'

export async function POST(req: NextRequest) {
  const clientIP = getClientIP(req)
  
  if (!checkRateLimit(clientIP, 30, 60000)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    )
  }
  
  // Process request...
}
```

### Client IP Detection

The system intelligently detects client IP from:
1. `x-forwarded-for` header (behind proxy)
2. `x-real-ip` header (Nginx reverse proxy)
3. Direct IP from request object
4. Fallback to 'unknown'

```typescript
const ip = getClientIP(req)
// Returns: "203.0.113.42" or "x-forwarded-for-value" or "unknown"
```

### Production Considerations

**Current**: In-memory store (suitable for single server)

**For Production** (multiple servers): Use Redis
```typescript
import redis from 'redis'

const client = redis.createClient()

export function checkRateLimitRedis(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60000
): boolean {
  const key = `ratelimit:${identifier}`
  const current = client.incr(key)
  
  if (current === 1) {
    client.expire(key, Math.ceil(windowMs / 1000))
  }
  
  return current <= limit
}
```

### HTTP Status Codes

- **429 Too Many Requests**: Rate limit exceeded
- **Retry-After**: Header indicating when to retry

```typescript
return NextResponse.json(
  { error: 'Rate limited' },
  {
    status: 429,
    headers: {
      'Retry-After': '60', // Retry in 60 seconds
    }
  }
)
```

## 2. CSRF Protection Implementation

### What is CSRF?

Cross-Site Request Forgery allows attackers to make unauthorized requests on behalf of users. CSRF tokens prevent this.

**Example Attack**:
```html
<!-- Malicious site -->
<img src="https://votewise.com/api/vote?candidate=123" />
<!-- User's browser automatically sends this request with their cookies -->
```

### Token-Based CSRF Protection

**Location**: `src/lib/security.ts`

```typescript
export function generateCSRFToken(): string {
  // Returns random 64-character hex string
  return '8f7a2b9c1e4d6f3a5b2c8e1d9f4a6b3c...'
}

export function validateCSRFToken(token: string): boolean {
  // Validates token format and value
  return /^[a-f0-9]{64}$/.test(token)
}
```

### Implementation Steps

**Step 1: Generate Token (On Page Load)**
```typescript
// On login/dashboard load
const token = generateCSRFToken()
sessionStorage.setItem('csrf-token', token)
```

**Step 2: Include in Requests**
```typescript
const token = sessionStorage.getItem('csrf-token')

fetch('/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': token, // Include token in header
  },
  body: JSON.stringify({ messages: [...] })
})
```

**Step 3: Validate on Server**
```typescript
import { withCSRF } from '@/lib/security'

export const POST = withCSRF(async (req) => {
  // Only POST/PUT/DELETE require CSRF token
  // GET requests are safe (idempotent)
  
  const csrfToken = req.headers.get('x-csrf-token')
  
  if (!validateCSRFToken(csrfToken)) {
    return NextResponse.json(
      { error: 'CSRF validation failed' },
      { status: 403 }
    )
  }
  
  // Process request...
})
```

### Token Lifecycle

```
1. User logs in
   ↓
2. Server sends CSRF token (secure, httpOnly cookie)
   ↓
3. Client stores token in sessionStorage
   ↓
4. Client includes token in request headers
   ↓
5. Server validates token matches
   ↓
6. Request processed
```

### Configuration

**Token Expiry**: 1 hour (after login)
**Token Rotation**: New token on logout/re-login

```typescript
// Token expires after 1 hour
const tokenExpiry = Date.now() + 3600000

// Clear token on logout
sessionStorage.removeItem('csrf-token')
```

### Double-Submit Cookies Pattern

Alternative to token-based (more complex):
```typescript
// Client sends same value in:
// 1. Cookie (set by server, httpOnly)
// 2. Header (read by client from cookie, sent manually)

fetch('/api/vote', {
  headers: {
    'X-CSRF-Token': document.cookie.match(/csrf-token=([^;]+)/)[1]
  }
})
```

## 3. Combined Security Middleware

### Applying Multiple Protections

```typescript
import { withAuth, withCSRF, withRateLimit } from '@/lib/security'

// Combine all protections
const secureHandler = withAuth(
  withCSRF(
    withRateLimit(handler, 30, 60000)
  )
)

export const POST = secureHandler
```

### Security Headers

```typescript
// Added in next.config.ts headers:
{
  'X-Content-Type-Options': 'nosniff',        // Prevent MIME sniffing
  'X-Frame-Options': 'SAMEORIGIN',            // Prevent clickjacking
  'X-XSS-Protection': '1; mode=block',        // XSS protection
  'Strict-Transport-Security': 'max-age=...',  // Force HTTPS
  'Content-Security-Policy': '...',           // Restrict resources
}
```

## 4. Testing Security Features

### Rate Limiting Tests

```typescript
import { checkRateLimit } from '@/lib/security'

describe('Rate Limiting', () => {
  it('should allow requests within limit', () => {
    const ip = '192.168.1.1'
    expect(checkRateLimit(ip, 3, 60000)).toBe(true)
    expect(checkRateLimit(ip, 3, 60000)).toBe(true)
    expect(checkRateLimit(ip, 3, 60000)).toBe(true)
  })

  it('should block requests exceeding limit', () => {
    const ip = '192.168.1.2'
    checkRateLimit(ip, 2, 60000)
    checkRateLimit(ip, 2, 60000)
    expect(checkRateLimit(ip, 2, 60000)).toBe(false)
  })
})
```

### CSRF Token Tests

```typescript
import { generateCSRFToken, validateCSRFToken } from '@/lib/security'

describe('CSRF Protection', () => {
  it('should generate valid tokens', () => {
    const token = generateCSRFToken()
    expect(validateCSRFToken(token)).toBe(true)
  })

  it('should reject invalid tokens', () => {
    expect(validateCSRFToken('invalid')).toBe(false)
    expect(validateCSRFToken('short')).toBe(false)
    expect(validateCSRFToken('abc123xyz')).toBe(false)
  })
})
```

### Integration Tests

```typescript
describe('Security Integration', () => {
  it('should enforce rate limiting on API', async () => {
    const requests = Array(31).fill(null).map(() =>
      fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ messages: [...] })
      })
    )

    const responses = await Promise.all(requests)
    const rateLimited = responses.filter(r => r.status === 429)
    
    expect(rateLimited.length).toBeGreaterThan(0)
  })

  it('should require CSRF token for mutations', async () => {
    const response = await fetch('/api/vote', {
      method: 'POST',
      body: JSON.stringify({ candidate: '123' })
      // Missing X-CSRF-Token header
    })

    expect(response.status).toBe(403)
    expect(await response.json()).toHaveProperty('error')
  })
})
```

## 5. Best Practices

### For Developers

✅ **DO**:
- Always include CSRF token in POST/PUT/DELETE requests
- Use rate limiting for all public endpoints
- Return clear error messages (but not security details)
- Log security events for monitoring
- Rotate tokens periodically

❌ **DON'T**:
- Store CSRF tokens in localStorage (vulnerable to XSS)
- Disable rate limiting for performance
- Expose API limits to users in error messages
- Reuse tokens across sessions
- Skip CSRF for "simple" endpoints

### For DevOps

✅ **DO**:
- Monitor rate limit violations
- Set up alerts for suspicious patterns
- Use Redis for distributed rate limiting
- Implement DDoS protection (CloudFlare, AWS WAF)
- Rotate API keys regularly

### For Users

**User Guidance**:
- Don't share session links
- Always use strong passwords
- Enable 2FA when available
- Logout when using shared computers
- Report suspicious activity immediately

## 6. Monitoring & Alerts

### Events to Monitor

```typescript
// Rate limit exceeded
logger.warn('Rate limit exceeded', {
  ip: '203.0.113.42',
  endpoint: '/api/chat',
  limit: 30,
  timestamp: new Date()
})

// CSRF validation failed
logger.warn('CSRF token invalid', {
  ip: '203.0.113.42',
  endpoint: '/api/vote',
  timestamp: new Date()
})

// Unusual pattern detected
logger.alert('Potential attack detected', {
  ip: '203.0.113.42',
  requestCount: 150,
  timeWindow: 60000,
  timestamp: new Date()
})
```

### Alert Thresholds

| Event | Threshold | Action |
|-------|-----------|--------|
| Rate limit violations | 10/min | Alert, log |
| Failed CSRF validations | 5/min | Alert, block IP |
| Brute force attempts | 10 failed logins | Temporary account lock |
| Unusual traffic | 10x normal | Investigate, consider DDoS |

## 7. Deployment Checklist

- [ ] Enable CSRF protection on all mutation endpoints
- [ ] Configure rate limiting with appropriate limits
- [ ] Set up Redis for distributed rate limiting
- [ ] Configure security headers in next.config.ts
- [ ] Enable HTTPS/SSL certificate
- [ ] Set up WAF (Web Application Firewall)
- [ ] Configure CORS properly
- [ ] Set up monitoring and alerting
- [ ] Create incident response plan
- [ ] Document security procedures

## Resources

- [OWASP Rate Limiting](https://cheatsheetseries.owasp.org/cheatsheets/DotNet_Security_Cheat_Sheet.html#rate-limiting)
- [OWASP CSRF Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [Express Rate Limit](https://github.com/nfriedly/express-rate-limit)
- [NIST Cybersecurity](https://www.nist.gov/cyberframework)
