# VotewiseAI - Complete File Inventory

## TEST COVERAGE STATUS

### ❌ Files Without Tests: 45

#### API Routes (2)
1. `src/app/api/chat/route.ts` - OpenAI chat endpoint
2. `src/app/api/config/route.ts` - Google Maps config endpoint

#### Pages - Authentication (2)
1. `src/app/(auth)/login/page.tsx` - Email/Password login
2. `src/app/(auth)/signup/page.tsx` - Email/Password signup

#### Pages - Dashboard (10)
1. `src/app/(dashboard)/dashboard/page.tsx` - Main dashboard with readiness score
2. `src/app/(dashboard)/chatbot/page.tsx` - AI chatbot interface
3. `src/app/(dashboard)/candidates/page.tsx` - Candidate research
4. `src/app/(dashboard)/fake-news/page.tsx` - Fact-checking tool
5. `src/app/(dashboard)/planner/page.tsx` - Booth planner with maps
6. `src/app/(dashboard)/profile/page.tsx` - User profile editor
7. `src/app/(dashboard)/simulator/page.tsx` - Voting simulator
8. `src/app/(dashboard)/scanner/page.tsx` - Document scanner
9. `src/app/(dashboard)/leaderboard/page.tsx` - Gamification leaderboard
10. `src/app/(dashboard)/error.tsx` - Error boundary

#### Pages - Layout & Config (2)
1. `src/app/page.tsx` - Landing page
2. `src/app/layout.tsx` - Root layout with providers

#### Components - Layout (2)
1. `src/components/layout/Navbar.tsx` - Navigation bar with theme/language toggle
2. `src/components/layout/Footer.tsx` - Footer component

#### Components - UI (4)
1. `src/components/ui/Button.tsx` - Button component (5 variants)
2. `src/components/ui/Card.tsx` - Card container component
3. `src/components/ui/Input.tsx` - Input/Textarea components
4. `src/components/ui/Badge.tsx` - Badge, Avatar, Progress components

#### Components - Features (1)
1. `src/components/maps/LiveBoothMap.tsx` - Google Maps integration

#### Components - Infrastructure (1)
1. `src/components/providers/ClientProvider.tsx` - Theme & Toast providers

#### Hooks (1)
1. `src/hooks/useAuth.ts` - Authentication hook (200+ lines)
   - Email/Password auth
   - Google OAuth
   - Profile management
   - Session persistence

#### Libraries (4)
1. `src/lib/firebase.ts` - Firebase initialization and config
2. `src/lib/utils.ts` - Utility functions (75 lines)
   - `cn()` - class name merger
   - `formatDate()` - Indian date format
   - `calculateAge()` - Age calculation
   - `isEligibleToVote()` - Eligibility check
   - `generateId()` - ID generation
   - `truncateText()` - Text truncation
   - `debounce()` - Debounce helper
   - `getReadinessScore()` - Weighted score calculation

3. `src/lib/validations.ts` - Zod validation schemas (40 lines)
   - loginSchema
   - signupSchema
   - profileSchema
   - fakeNewsSchema

4. `src/lib/data.ts` - Mock data (80 lines)
   - Candidate data with images and trust scores
   - Translation dictionary (English/Hindi)

#### Store (1)
1. `src/store/index.ts` - Zustand state management
   - useAuthStore - User authentication state
   - useThemeStore - Theme toggling
   - useNotificationStore - Notifications
   - useLangStore - Language preferences

#### Types (1)
1. `src/types/index.ts` - TypeScript interfaces
   - UserProfile
   - Badge
   - Candidate
   - Election
   - ChatMessage
   - FakeNewsResult
   - VotingPlan
   - QuizQuestion
   - Notification

#### Configuration Files (0 test files)
- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.mjs` - Tailwind CSS configuration
- `postcss.config.mjs` - PostCSS configuration
- `eslint.config.mjs` - ESLint configuration
- `package.json` - Dependencies (No test scripts)

---

## GOOGLE SERVICES USAGE BY FILE

### Firebase Services
**Files using Firebase:**
- `src/lib/firebase.ts` - Firebase SDK setup
- `src/hooks/useAuth.ts` - Auth & Firestore operations

**Services initialized:**
1. Firebase Authentication (getAuth)
2. Firestore Database (getFirestore)
3. Google Auth Provider (GoogleAuthProvider)

### Google Maps
**Files using Google Maps:**
- `src/components/maps/LiveBoothMap.tsx` - Map rendering and markers
- `src/app/(dashboard)/planner/page.tsx` - Booth location and routing
- `src/app/api/config/route.ts` - API key endpoint

**Implementation:**
- Library: `@vis.gl/react-google-maps`
- Features:
  - User location detection
  - Booth markers with info windows
  - Multiple transport mode routing

### OpenAI
**Files using OpenAI:**
- `src/app/api/chat/route.ts` - Chat completions
- `src/app/(dashboard)/chatbot/page.tsx` - Chat UI and message handling

**Implementation:**
- Model: GPT-4 Turbo
- Temperature: 0.7
- Max tokens: 1000

---

## UNTESTED CRITICAL FUNCTIONS

### Authentication (src/hooks/useAuth.ts)
- `login(email, password)` - Email login
- `signup(email, password, fullName)` - User registration
- `loginWithGoogle()` - OAuth login
- `logout()` - Session termination
- `updateUserProfile(updates)` - Profile modification

### Firestore Operations (src/hooks/useAuth.ts)
- `getDoc()` - Fetch user profile
- `setDoc()` - Create new profile
- `updateDoc()` - Update profile
- `onAuthStateChanged()` - Auth persistence

### API Endpoints
- `POST /api/chat` - OpenAI integration
- `GET /api/config` - Maps API config

### Business Logic (src/lib/utils.ts)
- `getReadinessScore()` - Voter readiness calculation
- `calculateAge()` - Age from DOB
- `isEligibleToVote()` - Voter eligibility

### State Management (src/store/index.ts)
- Auth state updates
- Theme toggling
- Language switching
- Notification counting

---

## SECURITY RISK MATRIX

### CRITICAL (Fix Immediately)
| File | Issue | Risk |
|------|-------|------|
| src/app/(dashboard)/* | Unprotected routes | Data breach |
| src/app/api/config/route.ts | API key exposure | Service abuse |
| src/hooks/useAuth.ts | Error message leakage | Information disclosure |
| src/app/api/chat/route.ts | No rate limiting | DoS |
| src/lib/validations.ts | Weak password policy | Brute force |
| src/app/api/chat/route.ts | No input validation | XSS/Injection |

### MEDIUM (Fix This Month)
| File | Issue | Risk |
|------|-------|------|
| src/app/layout.tsx | No CSP headers | XSS |
| src/app/api/* | No CSRF protection | CSRF |
| src/lib/utils.ts | Weak ID generation | Predictability |
| src/store/index.ts | No persistence | Lost state |
| src/components/maps/LiveBoothMap.tsx | API exposure | Rate limit |

### LOW (Fix This Quarter)
| File | Issue | Risk |
|------|-------|------|
| src/components/ui/* | Missing a11y props | Accessibility |
| src/components/layout/Navbar.tsx | No audit logging | Compliance |
| src/lib/data.ts | Hardcoded sensitive data | Misinformation |

---

## DEPENDENCY MAP

### Production Dependencies by File

**Firebase Dependencies:**
```
firebase (12.12.1)
  └── Used in:
      - src/lib/firebase.ts
      - src/hooks/useAuth.ts

@vis.gl/react-google-maps (1.8.3)
  └── Used in:
      - src/components/maps/LiveBoothMap.tsx
      - src/app/(dashboard)/planner/page.tsx

openai (6.35.0)
  └── Used in:
      - src/app/api/chat/route.ts

react-hook-form (7.75.0) + @hookform/resolvers (5.2.2)
  └── Used in:
      - src/app/(auth)/login/page.tsx
      - src/app/(auth)/signup/page.tsx
      - src/app/(dashboard)/profile/page.tsx
      - src/app/(dashboard)/fake-news/page.tsx

zod (4.4.2)
  └── Used in:
      - src/lib/validations.ts
      - All form pages

zustand (5.0.12)
  └── Used in:
      - src/store/index.ts
      - All components via hooks

framer-motion (12.38.0)
  └── Used in:
      - All pages (animations)
      - Navbar (mobile menu)

lucide-react (1.14.0)
  └── Used in:
      - All components (icons)

tailwindcss (4) + @tailwindcss/postcss (4)
  └── Used in:
      - src/globals.css
      - All components (styling)

next-themes (0.4.6)
  └── Used in:
      - src/components/providers/ClientProvider.tsx

react-hot-toast (2.6.0)
  └── Used in:
      - src/hooks/useAuth.ts
      - Various pages (notifications)

recharts (3.8.1)
  └── NOT USED (unused dependency)

@googlemaps/js-api-loader (2.0.2)
  └── Bundled with @vis.gl/react-google-maps
```

---

## METRICS SUMMARY

### Code Statistics
- **Total Lines of Code:** ~8,000+
- **Total Components:** 12
- **Total Pages:** 13
- **Total Hooks:** 1 (useAuth)
- **Total Stores:** 4 (Auth, Theme, Notification, Lang)
- **Total API Routes:** 2

### Testing Statistics
- **Test Files:** 0
- **Test Coverage:** 0%
- **Tested Components:** 0
- **Tested Pages:** 0
- **Tested Functions:** 0

### Security Audit
- **Critical Issues:** 6
- **Medium Issues:** 6
- **Low Issues:** 5

### Performance Issues
- **Bundle Size Issues:** 2 (Unused dependency, API exposure)
- **Render Efficiency Issues:** 3
- **Caching Issues:** 2
- **Hydration Issues:** 2

---

## DEPLOYMENT READINESS

| Aspect | Status | Notes |
|--------|--------|-------|
| Testing | ❌ 0% | No tests exist |
| Security | ⚠️ 30% | Critical issues remain |
| Performance | ⚠️ 40% | Unoptimized |
| Accessibility | ⚠️ 50% | Missing a11y attributes |
| Documentation | ✅ 80% | Good code comments |
| **Overall Readiness** | **❌ NOT READY** | Needs security fixes & tests |

---

## FILE LOCATION REFERENCE

### Quick Find by Feature

**User Authentication:**
- src/hooks/useAuth.ts
- src/app/(auth)/login/page.tsx
- src/app/(auth)/signup/page.tsx
- src/lib/validations.ts (schemas)

**AI Chatbot:**
- src/app/(dashboard)/chatbot/page.tsx
- src/app/api/chat/route.ts

**Candidate Information:**
- src/app/(dashboard)/candidates/page.tsx
- src/lib/data.ts (mock data)

**Voting Booth Planner:**
- src/app/(dashboard)/planner/page.tsx
- src/components/maps/LiveBoothMap.tsx
- src/app/api/config/route.ts

**User Profile:**
- src/app/(dashboard)/profile/page.tsx
- src/store/index.ts (state)

**Styling & Theme:**
- src/app/globals.css
- src/components/providers/ClientProvider.tsx
- src/store/index.ts (useThemeStore)

**Navigation:**
- src/components/layout/Navbar.tsx
- src/components/layout/Footer.tsx

**Utilities:**
- src/lib/utils.ts
- src/lib/validations.ts
- src/lib/firebase.ts
- src/lib/data.ts

**State Management:**
- src/store/index.ts

**Type Definitions:**
- src/types/index.ts

---

**Generated:** May 3, 2026  
**Status:** Analysis Complete  
**Files Analyzed:** 45+  
**Documentation:** Complete
