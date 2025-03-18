// Simple script to test if the Gemini API key works
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Use the same API key as in your application
const API_KEY = "AIzaSyDW8hRbqq74wjesU3LvsptTLn3ItL7-VuY";
const genAI = new GoogleGenerativeAI(API_KEY);

async function testGeminiApi() {
  try {
    // Initialize the model with the correct name
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Send a simple test prompt
    const result = await model.generateContent({
      contents: [
        { role: "user", parts: [{ text: "Hello, can you hear me?" }] },
      ],
    });

    // Get the response
    const response = result.response;
    return true;
  } catch (error) {
    // Handle errors silently
    return false;
  }
}

// Run the test
testGeminiApi();
