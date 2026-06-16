# Firebase Setup Guide for SpeakWithYou

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"**
3. Enter project name: `speak-with-you`
4. Enable Google Analytics (optional)
5. Click **"Create project"**

## Step 2: Enable Google Authentication

1. In Firebase Console, go to **Build → Authentication**
2. Click **"Get started"**
3. Go to **Sign-in method** tab
4. Click on **Google**
5. Toggle **Enable**
6. Enter your email as the project support email
7. Click **Save**

## Step 3: Create Cloud Firestore Database

1. Go to **Build → Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development)
4. Select a Cloud Firestore location closest to you
5. Click **"Enable"**

## Step 4: Get Firebase Config

1. Go to **Project Settings** (gear icon in sidebar)
2. Scroll down to **"Your apps"**
3. Click the **Web icon** (`</>`) to add a web app
4. Enter app nickname: `speak-with-you-web`
5. Click **"Register app"**
6. Copy the `firebaseConfig` object
7. Create `.env.local` in your project root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Step 5: Deploy Security Rules

1. Go to **Firestore Database → Rules** tab
2. Replace the rules with the content from `firestore.rules` in this project
3. Click **"Publish"**

## Step 6: (Optional) Add AI API Key

To enable real AI evaluation in mock interviews:

### For Gemini API:
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create an API key
3. Add to `.env.local`:
```env
AI_API_KEY=your_gemini_api_key
AI_PROVIDER=gemini
```

### For OpenAI API:
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an API key
3. Add to `.env.local`:
```env
AI_API_KEY=your_openai_api_key
AI_PROVIDER=openai
```

> **Note:** The app works without an AI key — it uses smart placeholder feedback.

## Firestore Data Structure

```
users/{uid}
  ├── uid: string
  ├── displayName: string
  ├── email: string
  ├── photoURL: string
  └── createdAt: timestamp

progress/{uid}
  ├── uid: string
  ├── completedDays: number[]
  ├── lastCompletedDay: number
  └── updatedAt: timestamp

interviews/{id}
  ├── id: string
  ├── uid: string
  ├── type: string
  ├── questions: array
  ├── overallScore: number
  ├── overallFeedback: string
  └── createdAt: timestamp
```
