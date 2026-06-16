# SpeakWithYou 🎤

**Learn English from Zero in 30 Days**

A full-stack English learning platform for beginners with daily lessons, speaking practice, and AI mock interviews.

## ✨ Features

- 📅 **30-Day Challenge** — Structured daily lessons from alphabet to interview prep
- 📝 **Vocabulary & Grammar** — Interactive flip cards and clear explanations
- 🎤 **Speaking Practice** — Speech-to-text powered practice
- 🤖 **AI Mock Interviews** — 4 interview types with AI scoring and feedback
- 📊 **Progress Tracking** — Visual progress bars, badges, and day-by-day completion
- 👤 **User Profiles** — Interview history, best scores, and stats
- 🔒 **Route Protection** — Secure dashboard for authenticated users only
- 📱 **Mobile Responsive** — Works beautifully on all devices

## 🛠 Tech Stack

- **Frontend:** Next.js 15 (App Router) + TypeScript + Tailwind CSS
- **Auth:** Firebase Authentication (Google Sign-In)
- **Database:** Cloud Firestore
- **AI:** Placeholder + Gemini/OpenAI ready
- **Speech:** Web Speech API

## 🚀 Getting Started

### Prerequisites

- Node.js 20.9 or later
- A Firebase project (see [FIREBASE_SETUP.md](./FIREBASE_SETUP.md))

### Setup

1. **Clone and install:**
   ```bash
   cd speak-with-you
   npm install
   ```

2. **Configure Firebase:**
   ```bash
   cp .env.local.example .env.local
   ```
   Edit `.env.local` with your Firebase config values.

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Open:** [http://localhost:3000](http://localhost:3000)

### (Optional) Enable AI Evaluation

Add your Gemini or OpenAI API key to `.env.local`:
```env
AI_API_KEY=your_key
AI_PROVIDER=gemini
```

## 📁 Project Structure

```
src/
├── app/              # Next.js pages
│   ├── page.tsx      # Landing page
│   ├── dashboard/    # User dashboard
│   ├── lessons/      # 30-day lessons
│   ├── interview/    # AI mock interviews
│   ├── profile/      # User profile
│   └── api/evaluate/ # AI evaluation endpoint
├── components/       # React components
│   ├── landing/      # Landing page sections
│   └── ui/           # Shared UI components
├── contexts/         # Auth context provider
├── data/             # 30-day lesson content
├── lib/              # Firebase, Auth, Firestore, AI helpers
└── types/            # TypeScript interfaces
```

## 🔐 Firestore Security Rules

See `firestore.rules` for rules that ensure users can only access their own data.

## 📝 License

MIT
