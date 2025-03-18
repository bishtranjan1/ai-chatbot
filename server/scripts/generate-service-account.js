#!/usr/bin/env node

/**
 * This script helps users generate a Firebase service account key for the server.
 * It provides instructions on how to obtain a service account key from the Firebase console
 * and how to format it for use in the .env file.
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("\n=== Firebase Service Account Key Generator ===\n");
console.log(
  "This script will help you set up your Firebase service account key for the RanjanchatAI server.\n"
);
console.log("Follow these steps to get your service account key:");
console.log(
  "1. Go to the Firebase Console: https://console.firebase.google.com/"
);
console.log("2. Select your project");
console.log("3. Go to Project Settings > Service Accounts");
console.log('4. Click "Generate new private key"');
console.log("5. Save the JSON file to your computer\n");

rl.question(
  "Have you downloaded the service account key file? (y/n): ",
  (answer) => {
    if (answer.toLowerCase() !== "y") {
      console.log(
        "\nPlease download the service account key file and run this script again."
      );
      rl.close();
      return;
    }

    rl.question(
      "\nEnter the path to your service account key file: ",
      (filePath) => {
        try {
          // Read the service account key file
          const serviceAccountKey = fs.readFileSync(
            path.resolve(filePath),
            "utf8"
          );

          // Parse the JSON to validate it
          const serviceAccountObj = JSON.parse(serviceAccountKey);

          // Check if it's a valid service account key
          if (
            !serviceAccountObj.type ||
            serviceAccountObj.type !== "service_account" ||
            !serviceAccountObj.project_id
          ) {
            console.log(
              "\nThe file does not appear to be a valid Firebase service account key."
            );
            rl.close();
            return;
          }

          // Format the service account key as a single line JSON string
          const formattedKey = JSON.stringify(serviceAccountObj);

          console.log("\n=== Your Firebase Service Account Key ===\n");
          console.log("Add the following to your server/.env file:");
          console.log("\nFIREBASE_SERVICE_ACCOUNT=" + formattedKey);
          console.log(
            "\nFIREBASE_DATABASE_URL=https://" +
              serviceAccountObj.project_id +
              ".firebaseio.com"
          );

          // Ask if the user wants to update the .env file automatically
          rl.question(
            "\nDo you want to update the .env file automatically? (y/n): ",
            (updateAnswer) => {
              if (updateAnswer.toLowerCase() === "y") {
                const envPath = path.resolve(__dirname, "../.env");

                // Check if .env file exists
                if (!fs.existsSync(envPath)) {
                  // If not, create it from .env.example
                  const exampleEnvPath = path.resolve(
                    __dirname,
                    "../.env.example"
                  );
                  if (fs.existsSync(exampleEnvPath)) {
                    fs.copyFileSync(exampleEnvPath, envPath);
                  } else {
                    fs.writeFileSync(
                      envPath,
                      "# MongoDB Connection\nMONGODB_URI=\n\n# Firebase Admin\n\n# Server Configuration\nPORT=5000\n"
                    );
                  }
                }

                // Read the current .env file
                let envContent = fs.readFileSync(envPath, "utf8");

                // Replace or add the Firebase service account key
                if (envContent.includes("FIREBASE_SERVICE_ACCOUNT=")) {
                  envContent = envContent.replace(
                    /FIREBASE_SERVICE_ACCOUNT=.*(\r?\n|$)/g,
                    "FIREBASE_SERVICE_ACCOUNT=" + formattedKey + "\n"
                  );
                } else {
                  envContent +=
                    "\nFIREBASE_SERVICE_ACCOUNT=" + formattedKey + "\n";
                }

                // Replace or add the Firebase database URL
                if (envContent.includes("FIREBASE_DATABASE_URL=")) {
                  envContent = envContent.replace(
                    /FIREBASE_DATABASE_URL=.*(\r?\n|$)/g,
                    "FIREBASE_DATABASE_URL=https://" +
                      serviceAccountObj.project_id +
                      ".firebaseio.com\n"
                  );
                } else {
                  envContent +=
                    "FIREBASE_DATABASE_URL=https://" +
                    serviceAccountObj.project_id +
                    ".firebaseio.com\n";
                }

                // Write the updated content back to the .env file
                fs.writeFileSync(envPath, envContent);

                console.log("\n.env file updated successfully!");
              }

              console.log("\nSetup complete! You can now run the server with:");
              console.log("cd server && npm run dev");

              rl.close();
            }
          );
        } catch (error) {
          console.error(
            "\nError reading or parsing the service account key file:",
            error.message
          );
          rl.close();
        }
      }
    );
  }
);
