# VotewiseAI - Quick Reference Card

**Project**: VotewiseAI  
**URL**: https://votewiseai-830885237908.asia-south1.run.app  
**Print this & keep it handy!**

---

## 🚀 Quick Deployment Command (For Experienced DevOps)

```bash
# Assumes all credentials are ready

# 1. Configure locally
cat > .env.local << 'EOF'
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_VALUE
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_VALUE
NEXT_PUBLIC_FIREBASE_PROJECT_ID=votewiseai-830885237908
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_VALUE
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_VALUE
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_VALUE
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=YOUR_VALUE
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_VALUE
OPENAI_API_KEY=YOUR_VALUE
AUTH_SECRET=YOUR_VALUE
NODE_ENV=production
EOF

# 2. Test
npm install
npm run build
npm start  # Ctrl+C to stop

# 3. Deploy
gcloud auth login
gcloud auth configure-docker gcr.io
gcloud builds submit --tag gcr.io/votewiseai-830885237908/votewiseai:latest

gcloud run deploy votewiseai \
  --image gcr.io/votewiseai-830885237908/votewiseai:latest \
  --region asia-south1 \
  --platform managed \
  --allow-unauthenticated \
  --memory 512Mi \
  --timeout 300

# 4. Set env vars in Cloud Run
gcloud run services update votewiseai \
  --region asia-south1 \
  --update-env-vars=\
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_VALUE,\
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_VALUE,\
... (all your values)

# 5. Verify
echo "Testing at: https://votewiseai-830885237908.asia-south1.run.app"
```

---

## 📚 Document Map

| Need | Document | Time |
|------|----------|------|
| Step-by-step guide | TEAM_RUNBOOK.md | 2-3h |
| Technical details | API_INTEGRATION_DEPLOYMENT_GUIDE.md | 1h |
| Code improvements | CODE_IMPROVEMENTS_GUIDE.md | 5h |
| Quick overview | INTEGRATION_SUMMARY.md | 10m |

---

## 🔑 Credentials You Need

```
Firebase:
  NEXT_PUBLIC_FIREBASE_API_KEY: ?
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: ?
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: votewiseai-830885237908
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: ?
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: ?
  NEXT_PUBLIC_FIREBASE_APP_ID: ?
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: ?

Maps:
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: ?

OpenAI:
  OPENAI_API_KEY: ?

Auth:
  AUTH_SECRET: (generate: openssl rand -base64 32)
```

---

## ✅ Testing Checklist

```
Local (http://localhost:3000):
□ Sign up at /login
□ Test chat at /dashboard/chatbot
□ View maps at /dashboard/candidates
□ Check browser console for errors

Production (https://votewiseai-830885237908.asia-south1.run.app):
□ Sign up at /login
□ Test chat with real response (not "demo mode")
□ View maps without "API key not configured" error
□ Check browser console for errors
```

---

## 🛠 Common Commands

```bash
# Development
npm run dev              # Start dev server on :3000
npm run build           # Build production image
npm start               # Run production build

# Testing
npm test                # Run tests
npm run test:coverage   # Coverage report

# Deployment (GCP)
gcloud auth login
gcloud builds submit --tag gcr.io/votewiseai-830885237908/votewiseai:latest
gcloud run deploy votewiseai --image gcr.io/votewiseai-830885237908/votewiseai:latest --region asia-south1

# View logs
gcloud run logs read votewiseai --region asia-south1 --tail 50
```

---

## 🔗 Important Links

```
Firebase Console:
  https://console.firebase.google.com

Google Cloud Console:
  https://console.cloud.google.com

Cloud Run:
  https://console.cloud.google.com/run

OpenAI Dashboard:
  https://platform.openai.com

Production Site:
  https://votewiseai-830885237908.asia-south1.run.app
```

---

## 🐛 Quick Troubleshooting

| Problem | Check | Fix |
|---------|-------|-----|
| "API key not configured" | Maps env var | Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to Cloud Run |
| Chat returns "demo mode" | OpenAI env var | Add OPENAI_API_KEY to Cloud Run (starts with sk-) |
| Can't log in | Firebase env vars | Verify all NEXT_PUBLIC_FIREBASE_* values |
| Build fails | Dependencies | Run `npm install` locally first |
| Port 3000 in use | Kill process | `kill -9 $(lsof -t -i :3000)` |

---

## ⏱ Time Estimates

```
First-time deployment:
  Credentials: 45 min
  Testing: 50 min
  Deploy: 45 min
  Verify: 20 min
  ────────────────
  TOTAL: ~2.5 hours

Updates (after first deploy):
  Fix bug: 10 min (just git push)
  Update env var: 10 min
  Add feature: 30 min
```

---

## 📊 Success Metrics

✅ **Deployment Successful When:**
- Firebase login works
- Maps display with no errors
- Chatbot gives real responses (not "demo mode")
- No red errors in browser console
- Pages load in < 3 seconds

❌ **Deployment Failed If:**
- Any API returns error
- Console shows red errors
- Services timeout (> 30 sec)
- Database doesn't save data

---

## 💾 Files to Remember

```
Create:
  .env.local                          (Never commit!)
  
Reference:
  TEAM_RUNBOOK.md                     ← Follow this first
  API_INTEGRATION_DEPLOYMENT_GUIDE.md
  CODE_IMPROVEMENTS_GUIDE.md
  INTEGRATION_SUMMARY.md
```

---

## 🎯 Three-Phase Deployment

```
Phase 1: Prepare (45 min)
  └─ Get all credentials
  └─ Create .env.local
  └─ npm install

Phase 2: Test (50 min)
  └─ npm run dev
  └─ Test all 3 integrations
  └─ npm run build

Phase 3: Deploy (45 min)
  └─ Set Cloud Run env vars
  └─ gcloud deploy...
  └─ Test on production URL

TOTAL: ~2.5 hours
```

---

## 🚨 Critical Do's & Don'ts

```
✅ DO:
  - Keep .env.local secret
  - Test locally before deploying
  - Use restricted API keys
  - Enable authentication on APIs
  - Set resource limits in Cloud Run

❌ DON'T:
  - Commit .env.local to Git
  - Use same API key for dev & prod
  - Expose OpenAI key in frontend code
  - Leave API keys without restrictions
  - Deploy without testing first
```

---

## 📞 Getting Help

1. **Stuck?** → Check TEAM_RUNBOOK.md Section "TROUBLESHOOTING"
2. **More details?** → Read API_INTEGRATION_DEPLOYMENT_GUIDE.md
3. **Implement improvements?** → See CODE_IMPROVEMENTS_GUIDE.md
4. **Code error?** → Check gcloud logs: `gcloud run logs read votewiseai --region asia-south1`

---

## 🎓 Learning Path

```
Beginner (Start here):
  1. Read: INTEGRATION_SUMMARY.md (10 min)
  2. Follow: TEAM_RUNBOOK.md (2.5 hours)
  3. Verify: All tests passing

Intermediate:
  1. Read: API_INTEGRATION_DEPLOYMENT_GUIDE.md (1 hour)
  2. Handle: Edge cases & troubleshooting
  3. Optimize: Performance & security

Advanced:
  1. Read: CODE_IMPROVEMENTS_GUIDE.md (5 hours)
  2. Implement: All code improvements
  3. Monitor: Production metrics & logs
  4. Plan: Future enhancements
```

---

## ✨ Pro Tips

```
🔹 Always test locally before deploying
   npm run build && npm start

🔹 Use browser DevTools to debug
   F12 > Console tab for errors

🔹 Check Cloud Run logs first when production breaks
   gcloud run logs read votewiseai --region asia-south1

🔹 Set up monitoring early
   Cloud Run Metrics > Monitor your service

🔹 Keep API keys in Cloud Run secrets, not code
   Never hardcode sensitive values

🔹 Test each integration separately first
   Don't deploy everything at once
```

---

## 📋 Pre-Deployment Checklist

```
□ All credentials gathered
□ .env.local created
□ npm install completed
□ npm run build successful
□ npm start works locally
□ Firebase login tested
□ Maps display tested
□ Chatbot responds tested
□ No console errors
□ Cloud Run env vars set
□ Deployment initiated
□ Production site loads
□ All 3 integrations verified
```

---

## 🎯 Next Action

**👉 START HERE: Follow [TEAM_RUNBOOK.md](TEAM_RUNBOOK.md)**

Estimated time: 2-3 hours to complete deployment

Questions? Refer back to this card or check detailed guides.

---

**Printed**: _____________  
**Deployed by**: _____________  
**Date**: _____________  
**Status**: ✅ Complete / ⏳ In Progress / ❌ Failed
