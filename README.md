# RanjanchatAI

A modern AI chatbot application featuring a beautiful iOS-style UI, Hinglish language support, and offline capabilities.

## Features

- 🤖 Powered by Google's Gemini AI
- 💾 Local chat history storage using IndexedDB with localStorage fallback
- 📱 Modern iOS-style UI
- 📝 Markdown support in messages
- 🌐 Responsive design for all devices
- 🇮🇳 Hinglish language support
- 📲 Installable as a PWA (Progressive Web App)

## Tech Stack

- **Frontend**: React, TypeScript, Styled Components
- **AI**: Google Gemini API
- **Storage**: IndexedDB with localStorage fallback
- **Hosting**: Firebase Hosting

## Prerequisites

- Node.js (v14 or higher)
- Firebase project with Hosting enabled
- Google Gemini API key

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/bishtranjan1/ai-chatbot.git
cd ai-chatbot
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory with the following variables:

```env
REACT_APP_GEMINI_API_KEY=your_gemini_api_key
```

For production, create a `.env.production` file with the same variables.

### 4. Running locally

```bash
npm start
```

This will start the development server at [http://localhost:3000](http://localhost:3000).

## Building for Production

```bash
npm run build
```

## Deployment

The application is configured for Firebase Hosting deployment:

```bash
# Install Firebase CLI if you haven't already
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase (first time only)
firebase init

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

## Live Demo

The application is deployed at: [https://chatbotai-40d8b.web.app](https://chatbotai-40d8b.web.app)

## Key Features

### Hinglish Support

The chatbot can understand and respond in Hinglish (Hindi-English mix) when:

- User writes messages in Hinglish
- User activates the Hinglish mode using the toggle

### Offline Storage

Chat history is stored locally in your browser using:

- Primary: IndexedDB for efficient storage of larger data
- Fallback: localStorage for browsers without IndexedDB support

### Mobile-First Design

The application is designed for optimal use on mobile devices:

- Responsive layout adapts to different screen sizes
- Touch-friendly controls
- Installable as a home screen app
