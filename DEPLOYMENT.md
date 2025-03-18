# RanjanchatAI Deployment Guide

This guide provides instructions for deploying the RanjanchatAI application to production environments.

## Client Deployment (Firebase Hosting)

### Prerequisites

- Firebase account
- Firebase CLI installed (`npm install -g firebase-tools`)
- Firebase project created

### Steps

1. **Build the client application**:

   ```bash
   npm run build
   ```

2. **Initialize Firebase** (if not already done):

   ```bash
   firebase login
   firebase init hosting
   ```

   - Select your Firebase project
   - Set the public directory to `build`
   - Configure as a single-page app: Yes
   - Set up automatic builds with GitHub: Optional

3. **Update Firebase configuration**:
   Make sure your `firebase.json` has the following configuration:

   ```json
   {
     "hosting": {
       "public": "build",
       "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ]
     }
   }
   ```

4. **Deploy to Firebase**:

   ```bash
   firebase deploy --only hosting
   ```

5. **Access your deployed application**:
   Your application will be available at `https://your-project-id.web.app`

## Server Deployment (Heroku)

### Prerequisites

- Heroku account
- Heroku CLI installed
- Git repository initialized

### Steps

1. **Create a Heroku app**:

   ```bash
   cd server
   heroku create ranjanchatai-server
   ```

2. **Set up environment variables**:

   ```bash
   heroku config:set MONGODB_URI=your_mongodb_connection_string
   heroku config:set FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com
   heroku config:set FIREBASE_SERVICE_ACCOUNT='{"type":"service_account","project_id":"your-project-id",...}'
   ```

3. **Deploy to Heroku**:

   ```bash
   git subtree push --prefix server heroku main
   ```

   If you're deploying from a subdirectory, you can use:

   ```bash
   git subtree push --prefix server heroku main
   ```

4. **Verify deployment**:
   ```bash
   heroku open
   ```

## Updating the Client to Use the Deployed Server

1. **Update the `.env.production` file**:

   ```
   REACT_APP_API_URL=https://your-heroku-app-name.herokuapp.com/api
   ```

2. **Rebuild and redeploy the client**:
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

## Setting Up a Custom Domain (Optional)

### Firebase Hosting Custom Domain

1. Go to the Firebase Console > Hosting
2. Click "Add custom domain"
3. Follow the instructions to verify domain ownership and set up DNS records

### Heroku Custom Domain

1. Purchase a domain from a domain registrar
2. In Heroku dashboard, go to your app's settings
3. Under "Domains", click "Add domain"
4. Follow the instructions to set up DNS records

## Troubleshooting

### CORS Issues

If you encounter CORS issues, make sure your server's CORS configuration allows requests from your client domain:

```javascript
// In server.js
app.use(
  cors({
    origin: ["https://your-app-domain.web.app", "http://localhost:3000"],
  })
);
```

### Firebase Authentication Issues

Make sure your Firebase project has the appropriate authentication methods enabled in the Firebase Console.

### MongoDB Connection Issues

Verify that your MongoDB Atlas IP whitelist includes `0.0.0.0/0` to allow connections from any IP address, or specifically whitelist your Heroku app's IP addresses.
