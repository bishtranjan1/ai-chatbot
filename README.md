# RanjanchatAI

A modern AI chatbot application with user authentication, chat history storage, and a beautiful iOS-style UI.

## Features

- 🤖 Powered by Google's Gemini AI
- 🔐 User authentication with Firebase
- 💾 Chat history storage with MongoDB
- 📱 Modern iOS-style UI
- 📝 Markdown support in messages
- 🌐 Responsive design for all devices

## Tech Stack

- **Frontend**: React, TypeScript, Styled Components
- **Backend**: Node.js, Express
- **Database**: MongoDB Atlas
- **Authentication**: Firebase Authentication
- **AI**: Google Gemini API

## Prerequisites

- Node.js (v14 or higher)
- Firebase project with Authentication enabled
- MongoDB Atlas account
- Google Gemini API key

## Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd ai-chatbot
```

### 2. Install dependencies

```bash
npm run install-all
```

This will install dependencies for both the client and server.

### 3. Configure environment variables

#### Client

Create a `.env` file in the root directory with the following variables:

```
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id

# Gemini API Key
REACT_APP_GEMINI_API_KEY=your-gemini-api-key

# Server API URL
REACT_APP_API_URL=http://localhost:5000/api
```

#### Server

1. Run the setup script to configure your Firebase service account:

```bash
cd server
npm run setup
```

2. Follow the prompts to set up your Firebase service account.

3. Update the MongoDB connection string in the `server/.env` file:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ranjanchatai?retryWrites=true&w=majority
```

### 4. Run the application

```bash
npm run dev
```

This will start both the client and server concurrently.

- Client: http://localhost:3000
- Server: http://localhost:5000

## Deployment

### Firebase Hosting Deployment

To deploy the frontend to Firebase Hosting:

1. **Build the application**:

   ```bash
   npm run build
   ```

2. **Deploy to Firebase Hosting**:

   ```bash
   firebase deploy --only hosting
   ```

3. **Verify Deployment**:
   - Visit your Firebase hosting URL: https://chatbotai-40d8b.web.app
   - Test the chat functionality

### Environment Variables

The application uses the following environment variables:

- **Firebase Configuration**:

  - `REACT_APP_FIREBASE_API_KEY`
  - `REACT_APP_FIREBASE_AUTH_DOMAIN`
  - `REACT_APP_FIREBASE_PROJECT_ID`
  - `REACT_APP_FIREBASE_STORAGE_BUCKET`
  - `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
  - `REACT_APP_FIREBASE_APP_ID`

- **Gemini API Key**:
  - `REACT_APP_GEMINI_API_KEY`

## Project Structure

```
ai-chatbot/
├── public/                 # Static files
├── server/                 # Backend server
│   ├── scripts/            # Server scripts
│   └── server.js           # Main server file
└── src/
    ├── components/         # React components
    ├── contexts/           # React contexts
    ├── firebase/           # Firebase configuration
    ├── services/           # API services
    └── types/              # TypeScript types
```

## License

MIT

## Deployment Instructions

### Firebase Functions Deployment

To deploy the backend to Firebase Functions:

1. **Upgrade to Firebase Blaze Plan**:

   - Go to [Firebase Console](https://console.firebase.google.com/project/chatbotai-40d8b/overview)
   - Click on "Upgrade" to switch to the Blaze (pay-as-you-go) plan
   - Complete the upgrade process

2. **Deploy Firebase Functions**:

   ```bash
   cd functions
   npm install
   cd ..
   firebase deploy --only functions
   ```

3. **Deploy Frontend**:

   ```bash
   npm run build
   firebase deploy --only hosting
   ```

4. **Verify Deployment**:
   - Visit your Firebase hosting URL: https://chatbotai-40d8b.web.app
   - Test login functionality
   - Test chat functionality
   - Verify that chat history is saved

### Environment Variables

The application uses the following environment variables:

- **Firebase Configuration**:

  - `REACT_APP_FIREBASE_API_KEY`
  - `REACT_APP_FIREBASE_AUTH_DOMAIN`
  - `REACT_APP_FIREBASE_PROJECT_ID`
  - `REACT_APP_FIREBASE_STORAGE_BUCKET`
  - `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
  - `REACT_APP_FIREBASE_APP_ID`

- **Gemini API Key**:

  - `REACT_APP_GEMINI_API_KEY`

- **Server API URL**:
  - `REACT_APP_API_URL` (Firebase Functions URL)

### MongoDB Configuration

The MongoDB connection string is stored in Firebase Functions configuration:

```bash
firebase functions:config:set mongodb.uri="your-mongodb-connection-string"
```

## Development

To run the application locally:

```bash
npm install
npm start
```

The application will be available at http://localhost:3000.
