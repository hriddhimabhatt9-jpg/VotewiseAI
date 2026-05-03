# VotewiseAI - Team Runbook: Integration & Deployment Steps

**For**: Antigravity Team  
**Project**: VotewiseAI  
**Deployment URL**: https://votewiseai-830885237908.asia-south1.run.app  
**Target**: Complete API integration + Cloud Run deployment  

---

## 🚀 Quick Start (2-3 hours)

If you're familiar with the project, start here:

**Phase 1: Gather Credentials (30 min)**
- [ ] Get Firebase config from Firebase Console
- [ ] Get OpenAI API key from OpenAI Dashboard
- [ ] Get Google Maps API key from Google Cloud Console
- [ ] Generate random AUTH_SECRET: `openssl rand -base64 32`

**Phase 2: Configure Locally (15 min)**
- [ ] Create `.env.local` file with all credentials
- [ ] Run `npm install`
- [ ] Run `npm run dev`

**Phase 3: Test Locally (30 min)**
- [ ] Test Firebase login at `/login`
- [ ] Test chatbot at `/dashboard/chatbot`
- [ ] Test maps at `/dashboard/candidates`

**Phase 4: Deploy to Cloud Run (30 min)**
- [ ] Set environment variables in Cloud Run console
- [ ] Deploy via gcloud: `gcloud builds submit && gcloud run deploy`
- [ ] Verify at https://votewiseai-830885237908.asia-south1.run.app

---

## 📋 DETAILED STEP-BY-STEP (First Time Deployers)

### PHASE 1: OBTAIN CREDENTIALS (Estimated: 45 minutes)

#### Step 1: Get Firebase Credentials
**Time**: 10 minutes

```
1. Open: https://console.firebase.google.com
2. Select project: VotewiseAI
3. Click ⚙️ Settings > Project Settings
4. Copy these EXACT values:

   NEXT_PUBLIC_FIREBASE_API_KEY: [YOUR_API_KEY]
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: [YOUR_AUTH_DOMAIN]
   NEXT_PUBLIC_FIREBASE_PROJECT_ID: votewiseai-830885237908
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: [YOUR_STORAGE_BUCKET]
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: [YOUR_SENDER_ID]
   NEXT_PUBLIC_FIREBASE_APP_ID: [YOUR_APP_ID]
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: [YOUR_MEASUREMENT_ID]

5. Verify: All 7 values copied? ✓

PROBLEM? Errors when copying?
→ Refresh the page and try again
→ Make sure you're in the right project
→ Check if Firebase project exists (Build > Authentication should be enabled)
```

#### Step 2: Get OpenAI API Key
**Time**: 5 minutes

```
1. Open: https://platform.openai.com/account/api-keys
2. Click: "Create new secret key"
3. Name it: votewiseai-production
4. Click: Create
5. Copy the key (you won't see it again!)
6. Save as: OPENAI_API_KEY

⚠️ CRITICAL: Never share this key!

PROBLEM? Can't create key?
→ Check if account has paid plan
→ Login with correct email
→ Request API access from OpenAI support
```

#### Step 3: Get Google Maps API Key
**Time**: 15 minutes

```
1. Open: https://console.cloud.google.com
2. Select project: votewiseai-830885237908
3. Go to: APIs & Services > Library
4. Search & Enable these:
   ✓ Maps JavaScript API
   ✓ Places API
   ✓ Geocoding API
5. Go to: APIs & Services > Credentials
6. Click: Create Credentials > API Key
7. Name it: Maps-Frontend-Restricted
8. Click the key to edit restrictions:
   
   Application Restrictions:
   - Select: HTTP referrers
   - Add EXACTLY:
     votewiseai-830885237908.asia-south1.run.app/*
     https://votewiseai-830885237908.asia-south1.run.app/*
     localhost:3000/*
   
   API Restrictions:
   - Choose: Restrict key
   - Select: Maps JavaScript API, Places API, Geocoding API
   - Save

9. Copy the key value
10. Save as: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

✓ Completed
```

#### Step 4: Generate Authentication Secret
**Time**: 2 minutes

```bash
# Open terminal and run:
openssl rand -base64 32

# Output: xKc8n2jF9dL5mP1qR3sT7vW9xYzA4bC6eF8gH0jK2l4=
# (or similar random string)

# Save as: AUTH_SECRET
```

### PHASE 2: CONFIGURE LOCAL ENVIRONMENT (Estimated: 20 minutes)

#### Step 5: Create `.env.local` File

```bash
# In project root directory, create new file: .env.local
# Copy-paste the template below and fill in YOUR values:

# ========== FIREBASE CONFIGURATION ==========
NEXT_PUBLIC_FIREBASE_API_KEY=xKc8n2jF9dL5mP1qR3sT7vW9xYzA4bC6eF8gH0jK2l4=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=votewiseai-830885237908.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=votewiseai-830885237908
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=votewiseai-830885237908.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890abcd
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-ABCDEF1234

# ========== GOOGLE MAPS CONFIGURATION ==========
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyDu5xL8a9bC3dE4fG5hI6jK7lM8nO9pQ0rS1t

# ========== OPENAI CONFIGURATION ==========
# ⚠️ NEVER start with NEXT_PUBLIC_ (this keeps it server-side only!)
OPENAI_API_KEY=sk-proj-1234567890abcdefghijklmnopqrstuv

# ========== AUTH CONFIGURATION ==========
AUTH_SECRET=xKc8n2jF9dL5mP1qR3sT7vW9xYzA4bC6eF8gH0jK2l4=

# ========== ENVIRONMENT ==========
NODE_ENV=development

✓ Save file
✓ Don't commit to Git (it's in .gitignore)
```

#### Step 6: Install Dependencies

```bash
# In project root:
npm install

# Wait for completion...
# Expected: Should see "added X packages" message
```

#### Step 7: Start Development Server

```bash
npm run dev

# Expected output:
# - ready - started server on 0.0.0.0:3000
# - event - compiled client and server successfully
```

**Note**: Keep this terminal open. You'll use it for the next phase.

### PHASE 3: TEST LOCALLY (Estimated: 30 minutes)

**CRITICAL**: All tests must pass before deploying to Cloud Run!

#### Test 1: Firebase Authentication
**Time**: 5 minutes

```
1. Open browser: http://localhost:3000/login
2. Click "Sign up"
3. Enter test data:
   Email: test@example.com
   Password: Test123!@#
   Full Name: Test User
4. Click "Sign Up"
5. Expected: Should create user and redirect to dashboard

RESULT: ✓ PASS / ✗ FAIL

If FAIL, check:
→ Browser console for red errors (F12)
→ Firebase Console > Authentication > Users (should see new user)
→ .env.local has correct FIREBASE values
```

#### Test 2: Google Maps Integration
**Time**: 5 minutes

```
1. In SAME browser: http://localhost:3000/dashboard/candidates
2. Look for a map component on the page
3. Expected: Map displays with polling booth markers

RESULT: ✓ PASS / ✗ FAIL

If FAIL, check:
→ Browser console (F12 > Console tab)
→ Look for error: "Maps API key not configured"
→ Verify NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in .env.local

Quick test in console:
fetch('/api/maps-config').then(r => r.json()).then(console.log)
→ Should show: { "apiKey": "AIza..." }
```

#### Test 3: OpenAI Chatbot
**Time**: 10 minutes

```
1. Go to: http://localhost:3000/dashboard/chatbot
2. Type in chat: "How do I register to vote?"
3. Click Send button
4. Expected: Response within 5 seconds

RESULT: ✓ PASS / ✗ FAIL

If you see a MOCK response (starts with "I'm currently in demo mode"):
→ This means OPENAI_API_KEY is not set correctly
→ Check .env.local: OPENAI_API_KEY=sk-... (starts with sk-)
→ Make sure it's NOT prefixed with NEXT_PUBLIC_

If you see a REAL response:
→ Chatbot is working! ✓

If you see an ERROR:
→ Check browser console for error details
→ Verify API key is valid in OpenAI dashboard
```

#### Test 4: Check Overall Status

```bash
# In browser console (F12), run:

async function checkStatus() {
  const status = {
    firebase: '❓',
    maps: '❓',
    openai: '❓'
  }
  
  // Firebase
  try {
    const test = await fetch('/api/config')
    status.firebase = test.ok ? '✓' : '✗'
  } catch (e) {
    status.firebase = '✗'
  }
  
  // Maps
  try {
    const res = await fetch('/api/maps-config')
    const data = await res.json()
    status.maps = data.apiKey ? '✓' : '✗'
  } catch (e) {
    status.maps = '✗'
  }
  
  // OpenAI
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [{ role: 'user', content: 'test' }] })
    })
    status.openai = res.ok ? '✓' : '✗'
  } catch (e) {
    status.openai = '✗'
  }
  
  console.table(status)
  return status
}

await checkStatus()

Expected output:
┌─────────┬───┐
│ (index) │ 0 │
├─────────┼───┤
│firebase │ ✓ │
│maps     │ ✓ │
│openai   │ ✓ │
└─────────┴───┘

If any are ✗, do NOT proceed to deployment
```

**STOP HERE IF ANY TESTS FAIL** ❌

Check troubleshooting section at end of this document.

---

### PHASE 4: PREPARE FOR CLOUD RUN (Estimated: 15 minutes)

#### Step 8: Build Production Image

```bash
# In your terminal:
npm run build

# Expected output:
# ✓ Compiled successfully
# ✓ Route (app)
# ✓ Created standalone output

# If you see errors:
# → Fix the error message
# → Usually TypeScript or missing import
# → Run again after fixing
```

#### Step 9: Test Production Build Locally

```bash
# Still in terminal:
npm start

# Expected:
# - Server started on http://localhost:3000
# - Should work same as npm run dev

# Test: Open browser, test login/chatbot again
# If works: ✓ Ready to deploy
```

#### Step 10: Stop Local Server

```bash
# In terminal where npm start is running:
Press: Ctrl + C

# You should see it stop cleanly
```

---

### PHASE 5: DEPLOY TO CLOUD RUN (Estimated: 30 minutes)

#### Step 11: Open Google Cloud Console

```
1. Go to: https://console.cloud.google.com
2. Make sure you're in project: votewiseai-830885237908
3. Go to: Cloud Run
4. Select service: votewiseai
5. Click: EDIT & DEPLOY NEW REVISION
```

#### Step 12: Set All Environment Variables

```
In the Cloud Run editor, scroll to "Runtime settings"

Add EXACTLY these environment variables:

NEXT_PUBLIC_FIREBASE_API_KEY=xKc8n2...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=votewiseai-830885237908.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=votewiseai-830885237908
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=votewiseai-830885237908.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-ABCDEF1234
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyDu5xL8a9b...
OPENAI_API_KEY=sk-proj-123456...
AUTH_SECRET=xKc8n2...
NODE_ENV=production

✓ Double-check: All values are filled in?
✓ No empty fields?
✓ No typos?
```

#### Step 13: Deploy

```
1. Scroll to bottom of the form
2. Click: DEPLOY
3. Wait 2-5 minutes for deployment to complete
4. You should see: "Deployment successful" message
```

#### Step 14: Verify Deployment

```bash
# Option A: Via Cloud Run Console
1. Go to: https://console.cloud.google.com/run
2. Click service: votewiseai
3. Look at "Revisions" section
4. Should see green checkmark next to latest revision

# Option B: Via gcloud CLI
gcloud run services describe votewiseai --region asia-south1

Expected output should show:
- status: Ready
- Latest revision: ... (should be recent date/time)
```

---

### PHASE 6: TEST ON LIVE DEPLOYMENT (Estimated: 20 minutes)

**CRITICAL**: Verify all integrations work on the live URL!

#### Test 5: Firebase on Production

```
1. Open: https://votewiseai-830885237908.asia-south1.run.app/login
2. Sign up with test email
3. Expected: Account created, can log in

RESULT: ✓ PASS / ✗ FAIL

If FAIL:
→ Check: https://console.cloud.google.com/run
→ Go to LOGS tab
→ Look for Firebase errors
```

#### Test 6: Maps on Production

```
1. Go to: https://votewiseai-830885237908.asia-south1.run.app/dashboard/candidates
2. Look for map with markers

RESULT: ✓ PASS / ✗ FAIL

If FAIL:
→ Check browser console (F12)
→ Look for Maps API errors
→ Verify NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is set in Cloud Run
```

#### Test 7: Chatbot on Production

```
1. Go to: https://votewiseai-830885237908.asia-south1.run.app/dashboard/chatbot
2. Send test message
3. Expected: Gets response from OpenAI (not mock)

RESULT: ✓ PASS / ✗ FAIL

If you get MOCK response:
→ OPENAI_API_KEY not set correctly in Cloud Run
→ Go back to Step 12, verify the key value

If ERROR:
→ Check Cloud Run logs for error details
```

#### Test 8: Final Verification

```bash
# Run in browser console at:
# https://votewiseai-830885237908.asia-south1.run.app

fetch('/api/maps-config')
  .then(r => r.json())
  .then(d => {
    if (d.apiKey && d.apiKey.startsWith('AIza')) {
      console.log('✅ Maps API configured')
    } else {
      console.log('❌ Maps API not configured:', d)
    }
  })

fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ messages: [{ role: 'user', content: 'test' }] })
})
  .then(r => r.json())
  .then(d => {
    if (d.content && !d.content.includes('demo mode')) {
      console.log('✅ OpenAI configured')
    } else {
      console.log('❌ OpenAI not configured')
    }
  })

Expected: Both should show ✅
```

---

## 🐛 TROUBLESHOOTING

### Problem: "Maps API key not configured" on Production

```
Symptoms:
- Error message on maps/scanner page
- Console shows: "Maps API key not configured"

Solution:
1. Go to: https://console.cloud.google.com/run
2. Click service: votewiseai
3. Click: EDIT & DEPLOY NEW REVISION
4. Check if NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is set
5. If empty or wrong: Update it
6. Click: DEPLOY
7. Wait 2-3 min, test again

Alternative (gcloud CLI):
gcloud run services update votewiseai \
  --region asia-south1 \
  --update-env-vars \
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIza...YOUR_KEY...
```

### Problem: Chatbot Returns Mock Responses on Production

```
Symptoms:
- Chat works but response starts with: "I'm currently in demo mode"
- Message like: "To get real-time AI responses, please configure..."

Solution:
1. Check Cloud Run environment variables
2. Verify OPENAI_API_KEY is set (should start with: sk-)
3. Verify it's NOT prefixed with NEXT_PUBLIC_
4. Update and redeploy

gcloud run services update votewiseai \
  --region asia-south1 \
  --update-env-vars \
  OPENAI_API_KEY=sk-...YOUR_KEY...
```

### Problem: Firebase Login Not Working on Production

```
Symptoms:
- Can't sign up or log in
- Console shows Firebase errors
- Users not appearing in Firebase Console

Solution:
1. Check all NEXT_PUBLIC_FIREBASE_* variables are set
2. Verify exact values from Firebase Console > Project Settings
3. Check Firebase Console > Authentication:
   - Email/Password enabled?
   - Google OAuth enabled?
   - Firestore Database created?
4. Redeploy with correct values

Common mistakes:
→ Copied from wrong Firebase project
→ Missing some FIREBASE_ variables
→ Typo in values
```

### Problem: "Something went wrong" Generic Error

```
Solution:
1. Go to Cloud Run > votewiseai > LOGS
2. Find recent ERROR entries
3. Read the error message
4. Fix based on error details
5. Redeploy

Common errors:
→ "Cannot read properties of undefined" = Missing env var
→ "API key invalid" = Wrong key in env var
→ "Timeout" = Server taking too long
```

### Problem: Build Failed

```
Error message: "Build failed with status: 1"

Solution:
1. Check build logs: gcloud builds log LATEST_BUILD_ID
2. Common issues:
   - npm install failed: Check internet, try again
   - TypeScript errors: Run `npm run build` locally to find error
   - Missing dependencies: Run `npm install`
3. Test locally first:
   npm install
   npm run build
   npm start
4. Fix errors locally, then deploy again
```

### Problem: "Port already in use" (Local Testing)

```
Error: "Address already in use :::3000"

Solution:
# Option 1: Kill the process
lsof -i :3000
kill -9 <PID>

# Option 2: Use different port
PORT=3001 npm run dev

# Option 3: Restart terminal
```

---

## ✅ DEPLOYMENT SUCCESS CHECKLIST

Before considering deployment complete, verify:

- [ ] All 3 integrations (Firebase, Maps, OpenAI) tested locally
- [ ] `npm run build` completes without errors
- [ ] `npm start` works on localhost:3000
- [ ] All environment variables set in Cloud Run
- [ ] Deployment completed (green checkmark in Cloud Run)
- [ ] Can log in on production URL
- [ ] Maps display on candidates/scanner page
- [ ] Chatbot responds with real answers (not mock)
- [ ] No red errors in browser console
- [ ] Database shows new users/data

**When ALL are checked ✓**: DEPLOYMENT IS COMPLETE! 🎉

---

## 📞 QUICK REFERENCE

| What | Where | Time |
|------|-------|------|
| Get Firebase config | https://console.firebase.google.com | 5 min |
| Get OpenAI key | https://platform.openai.com/account/api-keys | 2 min |
| Get Maps key | https://console.cloud.google.com | 10 min |
| Test locally | http://localhost:3000 | 20 min |
| Deploy to Cloud Run | https://console.cloud.google.com/run | 15 min |
| Test production | https://votewiseai-830885237908.asia-south1.run.app | 10 min |
| **TOTAL TIME** | | **~1.5 hours** |

---

## 🎯 SUCCESS INDICATORS

When you see these, deployment is working:

1. ✓ Can create account and log in
2. ✓ Maps load with no API errors
3. ✓ Chatbot responds in < 5 seconds
4. ✓ No red console errors
5. ✓ All pages load quickly

---

**Document Version**: 1.0  
**Last Updated**: May 2026  
**For Issues**: Check TROUBLESHOOTING section or API_INTEGRATION_DEPLOYMENT_GUIDE.md for details
