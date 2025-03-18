# RanjanchatAI Server

This is the backend server for the RanjanchatAI application. It provides API endpoints for chat history management and user authentication.

## Features

- User authentication via Firebase
- Chat history storage in MongoDB
- RESTful API for chat operations
- Secure environment variable configuration

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- Firebase project with Authentication enabled

## Setup

1. Clone the repository
2. Navigate to the server directory:
   ```
   cd ai-chatbot/server
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file based on `.env.example`:
   ```
   cp .env.example .env
   ```
5. Update the `.env` file with your MongoDB and Firebase credentials

### Firebase Service Account

To get your Firebase service account:

1. Go to the Firebase Console
2. Navigate to Project Settings > Service Accounts
3. Click "Generate new private key"
4. Download the JSON file
5. Format the JSON as a single line and add it to the `FIREBASE_SERVICE_ACCOUNT` variable in your `.env` file

## Running the Server

### Development Mode

```
npm run dev
```

This starts the server with nodemon for automatic reloading during development.

### Production Mode

```
npm start
```

## API Endpoints

All endpoints require authentication via Firebase token in the Authorization header.

### Get All Chats

```
GET /api/chats
```

Returns all chats for the authenticated user.

### Get Single Chat

```
GET /api/chats/:id
```

Returns a specific chat by ID.

### Create New Chat

```
POST /api/chats
```

Creates a new chat. Request body should include:

```json
{
  "messages": [
    {
      "id": "string",
      "text": "string",
      "sender": "user|bot",
      "timestamp": "date"
    }
  ],
  "title": "string (optional)"
}
```

### Update Chat

```
PUT /api/chats/:id
```

Updates an existing chat. Request body format is the same as for creating a chat.

### Delete Chat

```
DELETE /api/chats/:id
```

Deletes a chat by ID.

## Security

- All API endpoints are protected with Firebase authentication
- Each user can only access their own chats
- Environment variables are used for sensitive information
