#!/usr/bin/env node

/**
 * This script helps users set up their client-side environment variables
 * for the RanjanchatAI application.
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("\n=== RanjanchatAI Client Setup ===\n");
console.log(
  "This script will help you set up your client-side environment variables.\n"
);

// Function to create or update the .env file
const updateEnvFile = (envVars) => {
  const envPath = path.resolve(__dirname, "../.env");

  // Check if .env file exists
  let envContent = "";
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, "utf8");
  }

  // Update each environment variable
  Object.entries(envVars).forEach(([key, value]) => {
    if (envContent.includes(`${key}=`)) {
      envContent = envContent.replace(
        new RegExp(`${key}=.*(\r?\n|$)`, "g"),
        `${key}=${value}\n`
      );
    } else {
      envContent += `${key}=${value}\n`;
    }
  });

  // Write the updated content back to the .env file
  fs.writeFileSync(envPath, envContent);

  console.log("\n.env file updated successfully!");
};

// Firebase setup
const setupFirebase = () => {
  console.log("\n=== Firebase Setup ===\n");
  console.log("Follow these steps to get your Firebase configuration:");
  console.log(
    "1. Go to the Firebase Console: https://console.firebase.google.com/"
  );
  console.log("2. Create a new project or select an existing one");
  console.log("3. Add a web app to your project");
  console.log(
    "4. Copy the configuration object from the Firebase SDK snippet\n"
  );

  rl.question("Do you have your Firebase configuration? (y/n): ", (answer) => {
    if (answer.toLowerCase() !== "y") {
      console.log(
        "\nPlease get your Firebase configuration and run this script again."
      );
      rl.close();
      return;
    }

    const firebaseConfig = {};

    const askApiKey = () => {
      rl.question("\nEnter your Firebase API Key: ", (apiKey) => {
        if (!apiKey) {
          console.log("API Key is required.");
          return askApiKey();
        }
        firebaseConfig.apiKey = apiKey;
        askAuthDomain();
      });
    };

    const askAuthDomain = () => {
      rl.question("Enter your Firebase Auth Domain: ", (authDomain) => {
        if (!authDomain) {
          console.log("Auth Domain is required.");
          return askAuthDomain();
        }
        firebaseConfig.authDomain = authDomain;
        askProjectId();
      });
    };

    const askProjectId = () => {
      rl.question("Enter your Firebase Project ID: ", (projectId) => {
        if (!projectId) {
          console.log("Project ID is required.");
          return askProjectId();
        }
        firebaseConfig.projectId = projectId;
        askStorageBucket();
      });
    };

    const askStorageBucket = () => {
      rl.question("Enter your Firebase Storage Bucket: ", (storageBucket) => {
        if (!storageBucket) {
          console.log("Storage Bucket is required.");
          return askStorageBucket();
        }
        firebaseConfig.storageBucket = storageBucket;
        askMessagingSenderId();
      });
    };

    const askMessagingSenderId = () => {
      rl.question(
        "Enter your Firebase Messaging Sender ID: ",
        (messagingSenderId) => {
          if (!messagingSenderId) {
            console.log("Messaging Sender ID is required.");
            return askMessagingSenderId();
          }
          firebaseConfig.messagingSenderId = messagingSenderId;
          askAppId();
        }
      );
    };

    const askAppId = () => {
      rl.question("Enter your Firebase App ID: ", (appId) => {
        if (!appId) {
          console.log("App ID is required.");
          return askAppId();
        }
        firebaseConfig.appId = appId;

        // Convert to environment variables
        const envVars = {
          REACT_APP_FIREBASE_API_KEY: firebaseConfig.apiKey,
          REACT_APP_FIREBASE_AUTH_DOMAIN: firebaseConfig.authDomain,
          REACT_APP_FIREBASE_PROJECT_ID: firebaseConfig.projectId,
          REACT_APP_FIREBASE_STORAGE_BUCKET: firebaseConfig.storageBucket,
          REACT_APP_FIREBASE_MESSAGING_SENDER_ID:
            firebaseConfig.messagingSenderId,
          REACT_APP_FIREBASE_APP_ID: firebaseConfig.appId,
        };

        // Update .env file
        updateEnvFile(envVars);

        // Continue to Gemini setup
        setupGemini();
      });
    };

    askApiKey();
  });
};

// Gemini API setup
const setupGemini = () => {
  console.log("\n=== Gemini API Setup ===\n");
  console.log("Follow these steps to get your Gemini API Key:");
  console.log(
    "1. Go to Google AI Studio: https://makersuite.google.com/app/apikey"
  );
  console.log("2. Sign in with your Google account");
  console.log("3. Create a new API key");
  console.log("4. Copy the API key\n");

  rl.question("Do you have your Gemini API Key? (y/n): ", (answer) => {
    if (answer.toLowerCase() !== "y") {
      console.log(
        "\nPlease get your Gemini API Key and run this script again."
      );
      rl.close();
      return;
    }

    rl.question("\nEnter your Gemini API Key: ", (apiKey) => {
      if (!apiKey) {
        console.log("API Key is required.");
        return setupGemini();
      }

      // Update .env file
      updateEnvFile({
        REACT_APP_GEMINI_API_KEY: apiKey,
        REACT_APP_API_URL: "http://localhost:5000/api",
      });

      console.log("\nSetup complete! You can now run the application with:");
      console.log("npm run dev");

      rl.close();
    });
  });
};

// Start the setup process
setupFirebase();
