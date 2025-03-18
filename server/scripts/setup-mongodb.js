#!/usr/bin/env node

/**
 * This script helps users set up their MongoDB connection for the RanjanchatAI server.
 * It provides instructions on how to create a MongoDB Atlas cluster and get the connection string.
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("\n=== MongoDB Connection Setup ===\n");
console.log(
  "This script will help you set up your MongoDB connection for the RanjanchatAI server.\n"
);
console.log("Follow these steps to get your MongoDB connection string:");
console.log("1. Go to MongoDB Atlas: https://www.mongodb.com/cloud/atlas");
console.log("2. Create an account or sign in");
console.log("3. Create a new cluster (the free tier is sufficient)");
console.log('4. Once your cluster is created, click "Connect"');
console.log('5. Choose "Connect your application"');
console.log("6. Copy the connection string\n");

rl.question("Do you have your MongoDB connection string? (y/n): ", (answer) => {
  if (answer.toLowerCase() !== "y") {
    console.log(
      "\nPlease get your MongoDB connection string and run this script again."
    );
    rl.close();
    return;
  }

  rl.question(
    "\nEnter your MongoDB connection string: ",
    (connectionString) => {
      // Validate the connection string format
      if (
        !connectionString.startsWith("mongodb+srv://") &&
        !connectionString.startsWith("mongodb://")
      ) {
        console.log(
          '\nInvalid connection string format. It should start with "mongodb+srv://" or "mongodb://"'
        );
        rl.close();
        return;
      }

      // Ask for database name
      rl.question(
        "\nEnter the database name (default: ranjanchatai): ",
        (dbName) => {
          const database = dbName || "ranjanchatai";

          // Add database name to connection string if not already present
          let finalConnectionString = connectionString;
          if (!finalConnectionString.includes("/" + database + "?")) {
            // Replace any existing database name
            finalConnectionString = finalConnectionString.replace(
              /\/([^/?]+)(\?|$)/,
              "/" + database + "$2"
            );

            // If there's no database specified, add it before the query parameters
            if (!finalConnectionString.includes("/" + database)) {
              const queryIndex = finalConnectionString.indexOf("?");
              if (queryIndex > -1) {
                finalConnectionString =
                  finalConnectionString.substring(0, queryIndex) +
                  "/" +
                  database +
                  finalConnectionString.substring(queryIndex);
              } else {
                finalConnectionString += "/" + database;
              }
            }
          }

          // Add retryWrites and w=majority if not present
          if (!finalConnectionString.includes("retryWrites=")) {
            finalConnectionString += finalConnectionString.includes("?")
              ? "&"
              : "?";
            finalConnectionString += "retryWrites=true&w=majority";
          }

          console.log("\n=== Your MongoDB Connection String ===\n");
          console.log("Add the following to your server/.env file:");
          console.log("\nMONGODB_URI=" + finalConnectionString);

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
                      "# MongoDB Connection\n\n# Firebase Admin\n\n# Server Configuration\nPORT=5000\n"
                    );
                  }
                }

                // Read the current .env file
                let envContent = fs.readFileSync(envPath, "utf8");

                // Replace or add the MongoDB connection string
                if (envContent.includes("MONGODB_URI=")) {
                  envContent = envContent.replace(
                    /MONGODB_URI=.*(\r?\n|$)/g,
                    "MONGODB_URI=" + finalConnectionString + "\n"
                  );
                } else {
                  envContent =
                    "MONGODB_URI=" + finalConnectionString + "\n" + envContent;
                }

                // Write the updated content back to the .env file
                fs.writeFileSync(envPath, envContent);

                console.log("\n.env file updated successfully!");
              }

              console.log("\nSetup complete! You can now run the server with:");
              console.log("npm run dev");

              rl.close();
            }
          );
        }
      );
    }
  );
});
