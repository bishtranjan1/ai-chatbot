const admin = require("firebase-admin");
const dotenv = require("dotenv");

dotenv.config();

// Check if service account info is available
if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  console.error("Firebase service account not found in environment variables");
  process.exit(1);
}

// Initialize Firebase Admin with service account
try {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });

  console.log("Firebase Admin initialized successfully");
} catch (error) {
  console.error("Error initializing Firebase Admin:", error);
  process.exit(1);
}

module.exports = admin;
