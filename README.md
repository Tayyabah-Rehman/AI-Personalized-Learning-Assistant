# 🎓 AI Personalized Learning Assistant

> Final Capstone Project · Internee.pk · Generative AI Track · July 2026
> **Student:** Tayyabah Rehman

---

## 📌 Project Overview

An AI-powered personalized tutor platform that guides Internee.pk interns through structured learning modules. The AI dynamically generates lesson content, answers questions in real-time, tracks progress per user, and automatically detects weak areas.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📚 Dynamic Lesson Generation | GPT-4 / LLaMA generates full lesson per topic on demand |
| 💬 AI Tutor Chat | Real-time context-aware Q&A chat panel fixed to viewport |
| 📊 Progress Tracking | Per-user completion saved in Firestore with visual bars |
| ⚠️ Weak Area Detection | Auto-flags confused topics from chat patterns |
| 🔐 Firebase Auth | Email/password + Google Sign-In |
| 🗂️ 8 Learning Modules | Python, ML, Web Dev, Data Analysis, GenAI, CV, NLP, Data Science |
| 📈 Progress Chart | Radial bar chart per module on dashboard |

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 15 (App Router), React 18, Tailwind CSS
- **AI:** Groq API (LLaMA-3.3-70B) / OpenAI GPT-4o-mini
- **Auth & DB:** Firebase Authentication + Cloud Firestore
- **Charts:** Recharts
- **Deployment:** Vercel

---

## 🚀 Setup Instructions

### 1. Extract & Install

```bash
# Extract the zip
cd ai-learning-assistant
npm install
```

### 2. Configure Environment Variables

Copy the example file and fill in your keys:

```bash
cp .env.local.example .env.local
```

```env
# Choose ONE of these AI providers:
GROQ_API_KEY=gsk_...          # FREE - get from console.groq.com
OPENAI_API_KEY=sk-...         # Paid - get from platform.openai.com

# Firebase (from Firebase Console > Project Settings > Web App)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# Firebase Admin (from Firebase Console > Service Accounts > Generate Key)
FIREBASE_ADMIN_PROJECT_ID=...
FIREBASE_ADMIN_CLIENT_EMAIL=...
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### 3. Firebase Setup

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create a project
3. **Authentication** → Enable Email/Password + Google
4. **Firestore Database** → Create database → Test mode
5. **Firestore Rules** → Paste secure rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 4. Run Locally

```bash
npm run dev
# Open http://localhost:3000
```

### 5. Deploy to Vercel

```bash
npx vercel --prod
# Add all .env.local variables in Vercel Dashboard > Settings > Environment Variables
# Add your Vercel domain to Firebase > Authentication > Authorized Domains
```

---

## 📁 Project Structure

```
ai-learning-assistant/
├── app/
│   ├── page.js                 # Landing page
│   ├── login/page.js           # Login (email + Google)
│   ├── register/page.js        # Registration
│   ├── dashboard/page.js       # Main dashboard with modules
│   ├── lesson/page.js          # Lesson viewer + AI chat
│   └── api/
│       ├── chat/route.js       # AI chat endpoint
│       ├── lesson/route.js     # Lesson generation endpoint
│       └── progress/route.js   # Progress update endpoint
├── components/
│   └── ProgressChart.js        # Radial progress chart
├── lib/
│   ├── firebase.js             # Firebase client
│   ├── firebase-admin.js       # Firebase admin SDK
│   ├── auth-context.js         # Auth provider
│   └── lessons.js              # 8 modules & 43 lessons data
├── .env.local.example          # Environment variables template
└── README.md
```

---

## 🗂️ Learning Modules (43 Total Lessons)

| Module | Lessons |
|--------|---------|
| 🐍 Python Basics | 5 |
| 🤖 Machine Learning | 5 |
| 🌐 Web Development | 5 |
| 📊 Data Analysis | 4 |
| ✨ Generative AI | 6 |
| 👁️ Computer Vision | 6 |
| 💬 NLP | 6 |
| 🔬 Data Science | 6 |

---

## 👩‍💻 Author

**Tayyabah Rehman**
- GitHub: [github.com/Tayyabah-Rehman](https://github.com/Tayyabah-Rehman)
- Email: tayyabahrehman789@gmail.com
- MPhil AI Student · University of Punjab, Lahore
