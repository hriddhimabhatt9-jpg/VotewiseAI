# VotewiseAI - Complete API Integration & Cloud Run Deployment Guide

**Status**: Production Deployment Instructions  
**URL**: https://votewiseai-830885237908.asia-south1.run.app  
**Region**: Asia-South1 (India)  

---

## 📋 Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Step 1: Obtain API Credentials](#step-1-obtain-api-credentials)
3. [Step 2: Configure Local Environment](#step-2-configure-local-environment)
4. [Step 3: Test Integrations Locally](#step-3-test-integrations-locally)
5. [Step 4: Set Cloud Run Environment Variables](#step-4-set-cloud-run-environment-variables)
6. [Step 5: Build & Deploy to Cloud Run](#step-5-build--deploy-to-cloud-run)
7. [Step 6: Verify Integrations on Live Site](#step-6-verify-integrations-on-live-site)
8. [Troubleshooting](#troubleshooting)
9. [Project Improvements](#project-improvements)

---

## 📝 Pre-Deployment Checklist

- [ ] Google Cloud Project created (ID: `votewiseai-830885237908`)
- [ ] Docker & gcloud CLI installed locally
- [ ] Firebase project created
- [ ] OpenAI account with API key
- [ ] Google Maps API enabled
- [ ] Cloud Run service created
- [ ] Git repository synchronized

---

## Step 1: Obtain API Credentials

### 1A. Firebase Configuration
**Timeline**: 5 minutes

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com
   - Select your project: `VotewiseAI`

2. **Get Firebase Config**
   - Click **Project Settings** (gear icon)
   - Go to **Your Apps** section
   - Select your web app
   - Copy the configuration object
   - You need these values:
     ```
     NEXT_PUBLIC_FIREBASE_API_KEY
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
     NEXT_PUBLIC_FIREBASE_PROJECT_ID
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
     NEXT_PUBLIC_FIREBASE_APP_ID
     NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
     ```

3. **Enable Required Services**
   - Go to **Build** > **Authentication**
   - Enable: Email/Password, Google OAuth
   - Go to **Build** > **Firestore Database**
   - Create database in `asia-south1` region
   - Start in production mode
   - Copy database URL (format: `https://project-id.firebaseio.com`)

4. **Create Service Account** (for backend)
   - Go to **Project Settings** > **Service Accounts**
   - Click **Generate new private key**
   - Save the JSON file securely
   - You'll use this for backend admin access

---

### 1B. OpenAI API Configuration
**Timeline**: 3 minutes

1. **Get OpenAI API Key**
   - Visit: https://platform.openai.com/account/api-keys
   - Click **Create new secret key**
   - Name it: `votewiseai-production`
   - Copy the key (you won't see it again)
   - Save as: `OPENAI_API_KEY`

2. **Set Usage Limits**
   - Go to **Settings** > **Billing** > **Usage Limits**
   - Set monthly limit: $20 (adjust based on your budget)
   - Set hard limit: Enable

3. **Model Selection**
   - We use: `gpt-4-turbo-preview` (via code)
   - Ensure your account has access to GPT-4

---

### 1C. Google Maps API Configuration
**Timeline**: 8 minutes

1. **Enable Maps API**
   - Go to Google Cloud Console: https://console.cloud.google.com
   - Select project: `votewiseai-830885237908`
   - Go to **APIs & Services** > **Library**
   - Search for: `Maps JavaScript API`
   - Click **Enable**
   - Repeat for: `Places API`, `Geocoding API`

2. **Create Restricted API Key**
   - Go to **APIs & Services** > **Credentials**
   - Click **Create Credentials** > **API Key**
   - Name it: `Maps-Frontend-Restricted`
   - Click on the key to edit restrictions:
   
   **Application Restrictions**:
   - Select: **HTTP referrers**
   - Add these referrers:
     ```
     votewiseai-830885237908.asia-south1.run.app/*
     https://votewiseai-830885237908.asia-south1.run.app/*
     localhost:3000/*
     http://localhost:3000/*
     ```
   
   **API Restrictions**:
   - Select: **Restrict key**
   - Choose: **Maps JavaScript API**, **Places API**, **Geocoding API**
   - Save

3. **Create Backend API Key** (for server-side requests)
   - Create another key with same process
   - Name it: `Maps-Backend-Restricted`
   - Same API restrictions but different referrers (not needed for backend)
   - Use this for `/api/maps-config` endpoint

4. **Copy Your Keys**
   - Frontend Key: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
   - Backend Key: `GOOGLE_MAPS_BACKEND_API_KEY` (optional, use frontend key)

---

## Step 2: Configure Local Environment

### 2A. Create `.env.local` File

In the project root, create `.env.local`:

```bash
# Firebase Configuration (Get from Firebase Console > Project Settings)
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=votewiseai-830885237908
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=votewiseai-830885237908.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Maps API (Get from Google Cloud Console)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_MAPS_API_KEY_RESTRICTED

# OpenAI API (Get from OpenAI Dashboard - BACKEND ONLY!)
OPENAI_API_KEY=sk-YOUR_OPENAI_API_KEY

# Auth Configuration
AUTH_SECRET=your-random-secret-key-min-32-chars-long-1234567890ab
```

**⚠️ CRITICAL SECURITY NOTES**:
- Never commit `.env.local` to Git (already in `.gitignore`)
- `OPENAI_API_KEY` must NOT be prefixed with `NEXT_PUBLIC_`
- This ensures it's only available server-side
- Keep these values confidential

### 2B. Verify `.gitignore` Contains `.env.local`

```bash
# Check if file is in .gitignore
grep ".env.local" .gitignore

# Expected output:
# .env.local
# .env*.local
```

---

## Step 3: Test Integrations Locally

### 3A. Install Dependencies

```bash
npm install
```

### 3B. Run Development Server

```bash
npm run dev
# Server starts at http://localhost:3000
```

### 3C. Test Each Integration

#### Test 1: Firebase Authentication
1. Navigate to: http://localhost:3000/login
2. Try signing up with email
3. Check browser console for Firebase errors
4. Expected: User created in Firebase Firestore

#### Test 2: Google Maps Integration
1. Navigate to: http://localhost:3000/dashboard/candidates (or scanner page with maps)
2. Look for map component on page
3. Check if polling booth markers appear
4. Browser console should show NO errors about Maps API key

**Verify Maps API Key**:
```bash
# Open DevTools Console and run:
fetch('/api/maps-config')
  .then(r => r.json())
  .then(d => console.log('Maps Key:', d.apiKey ? '✅ Configured' : '❌ Missing'))
```

#### Test 3: OpenAI Chatbot Integration
1. Navigate to: http://localhost:3000/dashboard/chatbot
2. Type a question: "How do I register to vote?"
3. Click Send
4. Expected: Response from OpenAI within 5 seconds
5. If no API key: Mock response appears

**Check API Response**:
```bash
# In browser DevTools Console:
fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    messages: [{ role: 'user', content: 'Hello' }] 
  })
})
.then(r => r.json())
.then(d => console.log('Chat Response:', d))
```

### 3D. Check for Errors

In browser DevTools **Console** tab, look for:
- ❌ Firebase errors (red)
- ❌ Maps API errors (red)
- ❌ CORS errors (if seeing "blocked by CORS")

All should be clear (green or no errors).

---

## Step 4: Set Cloud Run Environment Variables

### 4A. Via Google Cloud Console

1. **Open Cloud Run**
   - Go to: https://console.cloud.google.com/run
   - Click your service: `votewiseai` (or similar name)

2. **Edit & Update Environment Variables**
   - Click **EDIT AND DEPLOY NEW REVISION**
   - Scroll to **Runtime Settings**
   - Expand **Runtime Environment Variables**
   - Add all variables from your `.env.local`:

   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_VALUE
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_VALUE
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_VALUE
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_VALUE
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_VALUE
   NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_VALUE
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=YOUR_VALUE
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_VALUE
   OPENAI_API_KEY=YOUR_VALUE
   AUTH_SECRET=YOUR_VALUE
   NODE_ENV=production
   ```

3. **Deploy**
   - Scroll down and click **DEPLOY**
   - Wait 2-3 minutes for deployment to complete

### 4B. Alternative: Via gcloud CLI

```bash
# Set each environment variable
gcloud run services update votewiseai \
  --region asia-south1 \
  --update-env-vars \
  NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_VALUE,\
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_VALUE,\
  NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_VALUE,\
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_VALUE,\
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_VALUE,\
  NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_VALUE,\
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=YOUR_VALUE,\
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_VALUE,\
  OPENAI_API_KEY=YOUR_VALUE,\
  AUTH_SECRET=YOUR_VALUE,\
  NODE_ENV=production
```

### 4C. Using Cloud Run Secrets (Recommended for Sensitive Data)

For `OPENAI_API_KEY`, use Cloud Run Secrets instead:

```bash
# Create secret
echo -n "sk-YOUR_OPENAI_API_KEY" | gcloud secrets create openai-api-key --data-file=-

# Grant Cloud Run access
gcloud secrets add-iam-policy-binding openai-api-key \
  --member=serviceAccount:votewiseai-sa@votewiseai-830885237908.iam.gserviceaccount.com \
  --role=roles/secretmanager.secretAccessor

# Reference in Cloud Run via console or CLI:
# - In Console: Set to "Reference a secret" > select openai-api-key > version LATEST
# - Via CLI: --update-secrets OPENAI_API_KEY=openai-api-key:latest
```

---

## Step 5: Build & Deploy to Cloud Run

### 5A. Build & Test Locally First

```bash
# Build production image
npm run build

# Test build
npm start
# Should start at http://localhost:3000 without errors
```

### 5B. Deploy via Docker (Recommended)

```bash
# 1. Authenticate with gcloud
gcloud auth login

# 2. Configure Docker
gcloud auth configure-docker gcr.io

# 3. Build and push image
gcloud builds submit --tag gcr.io/votewiseai-830885237908/votewiseai:latest

# 4. Deploy to Cloud Run
gcloud run deploy votewiseai \
  --image gcr.io/votewiseai-830885237908/votewiseai:latest \
  --region asia-south1 \
  --platform managed \
  --allow-unauthenticated \
  --memory 512Mi \
  --timeout 300 \
  --cpu 1 \
  --set-env-vars=NODE_ENV=production
```

### 5C. Alternative: Deploy via Git (Cloud Run GitHub Integration)

If you've connected GitHub:
1. Push to main branch
2. Cloud Run auto-builds from Dockerfile
3. No manual build needed

```bash
git add .
git commit -m "feat: complete API integration for chatbot, maps, firebase"
git push origin main
```

### 5D: Monitor Deployment

```bash
# Watch deployment logs
gcloud run deploy votewiseai \
  --image gcr.io/votewiseai-830885237908/votewiseai:latest \
  --region asia-south1 \
  --follow

# Or view in console
# Go to: https://console.cloud.google.com/run/detail/asia-south1/votewiseai/logs
```

---

## Step 6: Verify Integrations on Live Site

Once deployment is complete, verify at: https://votewiseai-830885237908.asia-south1.run.app

### 6A. Firebase Authentication Test

```
1. Go to: /login
2. Sign up with test email
3. Expected: Email verification sent
4. Check: Firebase Console > Users - should see new user
```

### 6B. Google Maps Integration Test

```
1. Go to: /dashboard/candidates or /dashboard/scanner
2. Look for map component
3. Expected: Map displays, markers visible
4. No console errors about Maps API
```

**Quick Check**:
```bash
# Run in browser console
fetch('https://votewiseai-830885237908.asia-south1.run.app/api/maps-config')
  .then(r => r.json())
  .then(d => {
    if (d.apiKey) {
      console.log('✅ Maps API Key loaded successfully')
    } else {
      console.log('❌ Maps API Key missing:', d.error)
    }
  })
```

### 6C. OpenAI Chatbot Integration Test

```
1. Go to: /dashboard/chatbot
2. Type: "What is voter registration?"
3. Expected: AI response within 5 seconds
4. If mock response: Check that OPENAI_API_KEY is set correctly
```

### 6D. Check All Integrations Dashboard

Create a test page at `/dashboard/integration-check`:

```typescript
// Quick integration status check
async function checkIntegrations() {
  const results = {
    firebase: false,
    maps: false,
    openai: false,
  }
  
  // Check Firebase
  try {
    const user = await getAuth().currentUser
    results.firebase = !!user // true if logged in
  } catch (e) {
    results.firebase = false
  }
  
  // Check Maps API
  try {
    const response = await fetch('/api/maps-config')
    const data = await response.json()
    results.maps = !!data.apiKey
  } catch (e) {
    results.maps = false
  }
  
  // Check OpenAI
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [{ role: 'user', content: 'test' }] })
    })
    results.openai = response.ok
  } catch (e) {
    results.openai = false
  }
  
  console.table(results)
  return results
}

await checkIntegrations()
```

---

## Troubleshooting

### Issue: "Maps API key not configured" Error

**Solution**:
```bash
# 1. Verify environment variable is set
gcloud run services describe votewiseai --region asia-south1 --format='value(spec.template.spec.containers[0].env)'

# 2. Check the exact key value (first 10 chars)
# Should start with: AIza...

# 3. If missing, set it:
gcloud run services update votewiseai \
  --region asia-south1 \
  --update-env-vars NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIza...
```

### Issue: "OpenAI API key is invalid" or Chatbot Returns Mock Responses

**Solution**:
```bash
# 1. Verify key is set and valid
gcloud run services describe votewiseai --region asia-south1

# 2. Check key format (should start with sk-)
# 3. Verify key is active in OpenAI dashboard

# 4. Update if needed:
gcloud run services update votewiseai \
  --region asia-south1 \
  --update-env-vars OPENAI_API_KEY=sk-...
```

### Issue: Firebase Auth Not Working / "No Firebase Config" Error

**Solution**:
```bash
# 1. Verify all NEXT_PUBLIC_FIREBASE_* variables are set
# 2. Check Firebase Console:
#    - Project Settings > Your Apps > Copy exact values
#    - Authentication enabled (Email/Password, Google OAuth)
#    - Firestore Database created

# 3. Restart development server locally:
npm run dev

# 4. For Cloud Run, redeploy:
gcloud run deploy votewiseai \
  --image gcr.io/votewiseai-830885237908/votewiseai:latest \
  --region asia-south1
```

### Issue: CORS Error in Browser Console

**Symptoms**: 
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution**:
```bash
# 1. This should NOT happen with our setup (same-origin requests)
# 2. If it does:
#    - Check that API calls use relative paths (/api/chat, not full URL)
#    - Verify no hardcoded localhost in production code
#    - Check Cloud Run CORS settings in next.config.ts

# 2. Verify in next.config.ts:
# headers: [
#   {
#     source: "/api/:path*",
#     headers: [
#       { key: "Access-Control-Allow-Origin", value: "*" },
#     ]
#   }
# ]
```

### Issue: Cold Start / Slow Initial Load

**Causes**: 
- Google Cloud Run spins down unused services
- First request wakes up the container

**Solution**:
```bash
# Increase minimum instances (costs more)
gcloud run services update votewiseai \
  --region asia-south1 \
  --min-instances 1

# Or use Cloud Tasks to keep warm (advanced)
```

### Issue: "Build Failed" in Cloud Run Logs

**Troubleshoot**:
```bash
# 1. Check build logs
gcloud builds log LATEST_BUILD_ID

# 2. Common issues:
#    - Missing dependencies: npm install
#    - TypeScript errors: npm run build locally first
#    - Memory limit: Increase in gcloud run deploy command

# 3. Test locally:
npm run build
npm start
```

---

## Project Improvements

### High Priority (Do First)

#### 1. Add Input Validation & Sanitization for All Forms
**Impact**: Security + User Experience  
**Effort**: 2 hours

```bash
# Files to update:
- src/app/(auth)/signup/page.tsx
- src/app/(auth)/login/page.tsx
- src/app/(dashboard)/profile/page.tsx

# Use existing validation:
import { validateInput, sanitizeInput } from '@/lib/validation'

# Example:
const { valid, sanitized, error } = validateInput(email, 'email')
if (!valid) {
  toast.error(error)
  return
}
```

#### 2. Implement Rate Limiting on Frontend
**Impact**: Prevent accidental DOS  
**Effort**: 1 hour

```typescript
// Add to /lib/utils.ts
export function createRateLimiter(maxRequests: number, windowMs: number) {
  const requests: number[] = []
  
  return () => {
    const now = Date.now()
    const recent = requests.filter(t => now - t < windowMs)
    
    if (recent.length >= maxRequests) {
      return false
    }
    
    requests.push(now)
    return true
  }
}

// Use in chatbot:
const rateLimiter = createRateLimiter(30, 60000)
if (!rateLimiter()) {
  toast.error('Too many requests. Please wait.')
  return
}
```

#### 3. Add Error Boundaries to All Pages
**Impact**: Better error handling + UX  
**Effort**: 2 hours

```typescript
// Create src/components/ErrorBoundary.tsx
'use client'
import React from 'react'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          <p className="text-gray-600">{this.state.error?.message}</p>
          <Button onClick={() => window.location.reload()}>
            Reload Page
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}

// Use in layout:
<ErrorBoundary>
  {children}
</ErrorBoundary>
```

#### 4. Add Loading States to All API Calls
**Impact**: Better UX, prevent double submissions  
**Effort**: 2 hours

Already done in chatbot, apply to:
- Candidates page
- Scanner page
- Leaderboard page

```typescript
const [isLoading, setIsLoading] = useState(false)

const handleFetch = async () => {
  setIsLoading(true)
  try {
    // API call
  } finally {
    setIsLoading(false)
  }
}
```

### Medium Priority (Do Next)

#### 5. Add Comprehensive Logging System
**Impact**: Better debugging in production  
**Effort**: 3 hours

```typescript
// Create src/lib/logger.ts
export const logger = {
  info: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[INFO] ${message}`, data)
    }
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error)
    // Optional: Send to Sentry/LogRocket
  },
  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${message}`, data)
  },
}

// Use everywhere:
import { logger } from '@/lib/logger'
logger.info('Chat message sent', { length: message.length })
```

#### 6. Implement Progressive Image Loading
**Impact**: Faster perceived performance  
**Effort**: 2 hours

```typescript
// For candidate photos
<Image
  src={candidate.photo}
  alt={candidate.name}
  placeholder="blur"
  blurDataURL={generateBlurHash(candidate.photo)}
  width={200}
  height={250}
  priority={false}
/>
```

#### 7. Add API Response Caching
**Impact**: Faster loads, reduced API costs  
**Effort**: 2 hours

```typescript
// In API routes, add caching headers
export async function GET(req: NextRequest) {
  // ... fetch data ...
  
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, max-age=3600', // 1 hour
      'CDN-Cache-Control': 's-maxage=86400', // 1 day on CDN
    },
  })
}
```

### Low Priority (Polish)

#### 8. Add Animations & Transitions
**Impact**: Better visual feedback  
**Effort**: 3 hours

Already using Framer Motion, enhance:
- Page transitions
- Form submissions
- Error/success toasts
- Loading skeletons

#### 9. Add Offline Support (Service Worker)
**Impact**: Works without internet  
**Effort**: 4 hours

Use `next-pwa` package

#### 10. Add Analytics
**Impact**: Understand user behavior  
**Effort**: 1 hour

```bash
npm install @vercel/analytics
```

```typescript
// In layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout() {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

---

## Deployment Checklist

Before each production deployment:

- [ ] All environment variables set in Cloud Run
- [ ] Tests passing locally: `npm run test:ci`
- [ ] Build successful: `npm run build`
- [ ] No console errors when running: `npm start`
- [ ] ChatGPT API working (test 2-3 questions)
- [ ] Maps API loading (test on maps/scanner page)
- [ ] Firebase auth working (test login/signup)
- [ ] All integrations verified on live URL
- [ ] No security warnings in DevTools
- [ ] Performance acceptable (Lighthouse score > 90)

---

## Quick Reference: All Environment Variables Needed

| Variable | Value | Secret? | Where From |
|----------|-------|---------|-----------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | YOUR_VALUE | No | Firebase Console |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | project.firebaseapp.com | No | Firebase Console |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | votewiseai-830885237908 | No | Firebase Console |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | project.appspot.com | No | Firebase Console |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | YOUR_VALUE | No | Firebase Console |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | YOUR_VALUE | No | Firebase Console |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | G-XXXXXXXX | No | Firebase Console |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | AIza... | No | Google Cloud Console |
| `OPENAI_API_KEY` | sk-... | **YES** | OpenAI Dashboard |
| `AUTH_SECRET` | random-32+ chars | **YES** | Generate: `openssl rand -base64 32` |
| `NODE_ENV` | production | No | Fixed value |

---

## Contact & Support

If integrations still not working after following this guide:

1. **Check Cloud Run Logs**:
   ```bash
   gcloud run logs read votewiseai --region asia-south1 --tail 50
   ```

2. **Check Browser Console** (DevTools F12)
   - Red errors = API key issues
   - Orange warnings = Usually safe to ignore

3. **Verify Each API Separately**:
   - Firebase: Try signing in
   - Maps: Open DevTools > Network tab, filter by "maps"
   - OpenAI: Check if real response or mock response

4. **Common Fix** - Redeploy After Setting Env Vars:
   ```bash
   gcloud run deploy votewiseai \
     --image gcr.io/votewiseai-830885237908/votewiseai:latest \
     --region asia-south1
   ```

---

**Last Updated**: May 2026  
**Next Review**: After first production deployment
