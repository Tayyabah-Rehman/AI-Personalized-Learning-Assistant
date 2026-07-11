# 🎓 AI Personalized Learning Assistant

A GenAI-powered tutor built for **Internee.pk** interns. Offers dynamic lesson planning, AI-powered Q&A, and progress tracking with weak area detection.

## Features

- 📚 **Dynamic Lesson Planning** — OpenAI GPT-4o-mini generates personalized lesson content
- 💬 **AI Tutor Chat** — Ask questions and get instant explanations per lesson
- 📊 **Progress Tracking** — Visual dashboard with completion rates per module
- ⚠️ **Weak Area Detection** — Automatically flags topics where you struggle
- 🔐 **Firebase Auth** — Email/password + Google Sign-In
- ☁️ **Firestore** — Real-time progress stored per user

## Tech Stack

- **Frontend**: Next.js 14 (App Router), Tailwind CSS, Recharts, React Markdown
- **AI**: OpenAI GPT-4o-mini
- **Backend**: Firebase (Auth + Firestore), Firebase Admin SDK
- **Hosting**: Vercel (recommended)

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.local.example` to `.env.local` and fill in your keys:

```bash
cp .env.local.example .env.local
```

You need:
- **OpenAI API Key** — from [platform.openai.com](https://platform.openai.com)
- **Firebase Project** — create at [console.firebase.google.com](https://console.firebase.google.com)
  - Enable Authentication (Email/Password + Google)
  - Enable Firestore Database
  - Get web app config (NEXT_PUBLIC_FIREBASE_*)
  - Generate a Service Account key (FIREBASE_ADMIN_*)

### 3. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Deploy to Vercel

```bash
npx vercel --prod
```

Add all `.env.local` variables in Vercel project settings.

## Firestore Structure

```
users/{uid}
  name: string
  email: string
  createdAt: timestamp
  lessonsCompleted: number
  weakAreas: string[]
  progress:
    {moduleId}/{lessonId}:
      completedAt: string
      score: number
```

## Modules Included

| Module | Lessons |
|--------|---------|
| 🐍 Python Basics | 5 |
| 🤖 Machine Learning | 5 |
| 🌐 Web Development | 5 |
| 📊 Data Analysis | 4 |

## Project Structure

```
ai-learning-assistant/
├── app/
│   ├── page.js              # Landing page
│   ├── login/page.js        # Login
│   ├── register/page.js     # Registration
│   ├── dashboard/page.js    # Main dashboard
│   ├── lesson/page.js       # Lesson + chat UI
│   └── api/
│       ├── chat/route.js    # AI chat endpoint
│       ├── lesson/route.js  # Lesson generation endpoint
│       └── progress/route.js # Progress update endpoint
├── components/
│   └── ProgressChart.js     # Radial progress chart
├── lib/
│   ├── firebase.js          # Firebase client
│   ├── firebase-admin.js    # Firebase admin
│   ├── auth-context.js      # Auth provider
│   └── lessons.js           # Modules & lessons data
└── .env.local.example       # Environment template
```
