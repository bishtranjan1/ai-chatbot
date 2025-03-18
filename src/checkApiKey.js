// Script to check if the API key is enabled for the Gemini API
const https = require("https");

// Use the same API key as in your application
const API_KEY = "AIzaSyDW8hRbqq74wjesU3LvsptTLn3ItL7-VuY";

// Function to check if the API key is valid and enabled
function checkApiKey() {
  // Make a simple request to the Gemini API
  const url = `https://generativelanguage.googleapis.com/v1/models?key=${API_KEY}`;

  return new Promise((resolve) => {
    https
      .get(url, (res) => {
        let data = "";

        // A chunk of data has been received
        res.on("data", (chunk) => {
          data += chunk;
        });

        // The whole response has been received
        res.on("end", () => {
          if (res.statusCode === 200) {
            try {
              const models = JSON.parse(data);
              resolve({
                valid: true,
                models: models.models.map((model) => model.name),
              });
            } catch (e) {
              resolve({ valid: false, error: "Error parsing response" });
            }
          } else if (res.statusCode === 403) {
            resolve({
              valid: false,
              error: "API key is invalid or not enabled for the Gemini API",
            });
          } else {
            resolve({
              valid: false,
              error: `Unexpected status code: ${res.statusCode}`,
            });
          }
        });
      })
      .on("error", () => {
        resolve({ valid: false, error: "Network error" });
      });
  });
}

// Export the function instead of running it
module.exports = checkApiKey;
