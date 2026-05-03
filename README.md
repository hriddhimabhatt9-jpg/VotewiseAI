# VoteWise AI+ 🗳️

**AI-powered voter education and civic participation platform for Indian elections.**

## Features

- 🤖 **AI Chatbot** — GPT-powered election assistant with voice I/O
- 🗺️ **Interactive Maps** — Polling booth finder with directions & wait times
- 📊 **Candidate Insights** — Education, assets, criminal records analysis
- 🎮 **Voting Simulator** — Practice EVM/VVPAT voting
- 🔍 **Fact Checker** — AI-powered fake news detection
- 📋 **Vote Planner** — Route planning to your polling booth
- 🏆 **Gamification** — XP, levels, badges, leaderboard
- 🌐 **Multi-language** — English & Hindi support

## Tech Stack

- **Framework:** Next.js 16 (App Router, React 19)
- **Styling:** Tailwind CSS 4
- **State:** Zustand
- **Auth:** Firebase Authentication
- **AI:** OpenAI GPT-4
- **Maps:** Google Maps Platform (Maps + Places + Directions)
- **Deploy:** Google Cloud Run

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Setup

```bash
# Clone the repository
git clone https://github.com/your-username/VotewiseAI.git
cd VotewiseAI

# Install dependencies
npm install --legacy-peer-deps

# Copy environment template
cp .env.example .env.local
# Fill in your API keys in .env.local

# Start development server
npm run dev
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_FIREBASE_*` | ✅ | Firebase config |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | ✅ | Maps JS API key |
| `OPENAI_API_KEY` | ⚡ | GPT chatbot (server-only) |
| `GOOGLE_TRANSLATE_API_KEY` | ❌ | Translation API |
| `GOOGLE_VISION_API_KEY` | ❌ | Document scanning |

> ⚠️ **Never commit `.env.local`**. Only `.env.example` (with empty values) is tracked.

## Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# CI mode
npm run test:ci
```

## Deployment (Cloud Run)

```bash
# Build and deploy
gcloud run deploy votewiseai \
  --source . \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars "OPENAI_API_KEY=your-key,NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-key"
```

Server-only secrets (`OPENAI_API_KEY`) are injected at runtime via Cloud Run environment variables — never baked into the image.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/             # Login/Signup
│   ├── (dashboard)/        # Protected dashboard pages
│   └── api/                # API routes (chat, config, maps-config)
├── components/
│   ├── chat/               # ChatWindow component
│   ├── maps/               # MapView, LiveBoothMap
│   ├── layout/             # Navbar, Footer
│   ├── providers/          # Theme, Auth providers
│   └── ui/                 # Button, Card, Badge, Input
├── lib/                    # Utilities (validation, security, env)
├── store/                  # Zustand state stores
└── types/                  # TypeScript interfaces
```

## License

MIT
