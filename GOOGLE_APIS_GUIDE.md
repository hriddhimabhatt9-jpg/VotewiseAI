# Google APIs Integration Guide for VotewiseAI

## Overview

VotewiseAI integrates multiple Google services to provide comprehensive voter education features. This guide explains how each service is configured and best practices for secure usage.

## Services Currently Integrated

### 1. Firebase Authentication
**Purpose**: User authentication and account management

**Setup**:
```bash
# In Google Firebase Console:
1. Create a new Firebase project
2. Enable Authentication with Email/Password and Google OAuth
3. Get your Firebase configuration from Project Settings
4. Add to .env.local file
```

**Security Features**:
- Email/password authentication with strong validation
- Google OAuth 2.0 integration
- Automatic session management
- Email verification support

### 2. Firestore Database
**Purpose**: Store user profiles, preferences, and activity data

**Setup**:
```bash
# Collections structure:
users/
├── {uid}
│   ├── email
│   ├── fullName
│   ├── photoURL
│   ├── xp
│   ├── level
│   ├── badges
│   ├── quizScore
│   ├── createdAt
│   └── updatedAt
```

**Security Rules**:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own documents
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Public candidate data (read-only)
    match /candidates/{document=**} {
      allow read: if request.auth != null;
      allow write: if false;
    }
  }
}
```

### 3. Google Maps API
**Purpose**: Display polling booth locations and voting area information

**Setup**:
```bash
# Best Practice: Use Restricted API Key
1. Go to Google Cloud Console
2. Create new API key
3. Add Application restrictions:
   - Type: HTTP referrers
   - Allowed referrers: your-domain.com
4. Add API restrictions:
   - Only "Maps JavaScript API"
5. Add to environment variables (NOT .env.local):
   - Store in backend configuration
   - Fetch via /api/maps-config endpoint
```

**Usage**:
```typescript
// Frontend - Fetch API key securely
const response = await fetch('/api/maps-config')
const { apiKey } = await response.json()

// Use with Maps API
const loader = new Loader({
  apiKey: apiKey,
  version: 'weekly',
  libraries: ['places', 'geometry'],
})
```

### 4. OpenAI API (ChatGPT)
**Purpose**: AI-powered chatbot for voter education

**Setup**:
```bash
# Get API key from OpenAI
1. Visit https://platform.openai.com
2. Create API key
3. Add to .env.local (backend only, NEVER expose)
4. Set usage limits and billing
```

**Security**:
- API key stored in backend only
- Rate limiting: 30 requests/minute per IP
- Input validation and sanitization
- Message length limits (max 2000 chars)
- System prompt prevents misuse

## Security Best Practices

### API Key Management
```bash
✅ DO:
- Store sensitive keys in .env.local (git-ignored)
- Use separate keys for different environments (dev, staging, prod)
- Rotate keys regularly (every 3 months)
- Use API key restrictions in Google Cloud Console
- Implement rate limiting

❌ DON'T:
- Commit .env.local to version control
- Expose API keys in client-side code
- Use the same key for multiple services
- Leave keys without restrictions
- Share API keys via email or chat
```

### Environment-Specific Configuration

**Development (.env.local)**:
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=dev_restricted_key
OPENAI_API_KEY=dev_key_with_lower_limits
```

**Staging (.env.staging)**:
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=staging_restricted_key
OPENAI_API_KEY=staging_key
```

**Production (.env.production)**:
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=prod_restricted_key
OPENAI_API_KEY=prod_key_with_monitoring
```

## Feature Implementation Examples

### Example 1: Secure Maps Integration
```typescript
// src/components/maps/LiveBoothMap.tsx
import { useEffect, useState } from 'react'

export function LiveBoothMap() {
  const [apiKey, setApiKey] = useState<string>('')

  useEffect(() => {
    // Fetch API key from backend
    fetch('/api/maps-config')
      .then(res => res.json())
      .then(data => setApiKey(data.apiKey))
      .catch(err => console.error('Failed to load maps:', err))
  }, [])

  // Use apiKey with Google Maps API
  // ...
}
```

### Example 2: Secure OpenAI Integration
```typescript
// src/app/api/chat/route.ts
import { validateInput, sanitizeInput } from '@/lib/validation'
import { getClientIP, checkRateLimit } from '@/lib/security'

export async function POST(req: NextRequest) {
  // 1. Rate limiting
  const clientIP = getClientIP(req)
  if (!checkRateLimit(clientIP, 30, 60000)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    )
  }

  // 2. Input validation and sanitization
  const { messages } = await req.json()
  const validatedMessages = messages.map((msg: any) => ({
    role: msg.role,
    content: sanitizeInput(msg.content)
  }))

  // 3. Use OpenAI API (backend only)
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: validatedMessages
  })

  return NextResponse.json(response.choices[0].message)
}
```

### Example 3: Secure Firebase Usage
```typescript
// src/hooks/useAuth.ts
import { validatePassword } from '@/lib/validation'
import { signUp } from 'firebase/auth'

export function useAuth() {
  const signup = async (email: string, password: string) => {
    // 1. Validate password strength
    const { valid, errors } = validatePassword(password)
    if (!valid) {
      toast.error(errors.join(', '))
      return
    }

    // 2. Create user in Firebase
    const { user } = await signUp(email, password)

    // 3. Create user profile in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email,
      uid: user.uid,
      createdAt: serverTimestamp()
    })
  }
}
```

## Monitoring and Logging

### API Usage Monitoring
```typescript
// Log API calls for monitoring
import { logger } from '@/lib/logger'

export async function POST(req: NextRequest) {
  const startTime = Date.now()

  try {
    // ... API call ...
    logger.info('API call successful', {
      endpoint: '/api/chat',
      duration: Date.now() - startTime,
      status: 200
    })
  } catch (error) {
    logger.error('API call failed', {
      endpoint: '/api/chat',
      duration: Date.now() - startTime,
      error: error.message
    })
  }
}
```

### Cost Control
```bash
# Set up billing alerts in Google Cloud Console
1. Go to Billing
2. Set up budget alerts
3. Enable cost analysis tools
4. Monitor API usage dashboard

# Recommended limits for development:
- Maps API: Free tier (25,000 requests/day)
- OpenAI: $20/month limit
- Firebase: Spark plan (free tier)
```

## Testing Google API Integration

```typescript
// src/lib/__tests__/google-apis.test.ts
describe('Google APIs Integration', () => {
  it('should fetch maps API key securely', async () => {
    const response = await fetch('/api/maps-config')
    expect(response.status).toBe(200)
    
    const data = await response.json()
    expect(data.apiKey).toBeDefined()
    expect(data.apiKey).not.toBeNull()
  })

  it('should validate API key format', async () => {
    const response = await fetch('/api/maps-config')
    const { apiKey } = await response.json()
    
    // API key should be a valid string
    expect(typeof apiKey).toBe('string')
    expect(apiKey.length).toBeGreaterThan(0)
  })

  it('should enforce rate limiting on API calls', async () => {
    // Make multiple rapid requests
    const requests = Array(31).fill(null).map(() => 
      fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ messages: [{ role: 'user', content: 'test' }] })
      })
    )

    const results = await Promise.all(requests)
    const rateLimited = results.filter(r => r.status === 429)
    
    // At least one request should be rate limited
    expect(rateLimited.length).toBeGreaterThan(0)
  })
})
```

## Troubleshooting

### Issue: Maps API Key Invalid
**Solution**: 
1. Verify key has correct restrictions
2. Check domain matches allowed referrers
3. Ensure "Maps JavaScript API" is enabled

### Issue: OpenAI API Returns 401
**Solution**:
1. Check API key is valid
2. Verify API key has access to gpt-4-turbo
3. Check account has sufficient credits

### Issue: Firebase Authentication Fails
**Solution**:
1. Verify Firebase config is correct
2. Check Authentication is enabled in Console
3. Verify Google OAuth credentials

## Next Steps

1. Set up proper monitoring and error tracking (Sentry)
2. Implement analytics for API usage
3. Add caching strategies to reduce API calls
4. Create admin dashboard for monitoring usage
5. Set up automated backups for Firestore

## Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Google Maps Platform Guide](https://developers.google.com/maps)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Google Cloud Security Best Practices](https://cloud.google.com/docs/security-best-practices)
