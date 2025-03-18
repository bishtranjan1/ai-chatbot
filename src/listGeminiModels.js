// Script to list available Gemini models
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Use the same API key as in your application
const API_KEY = "AIzaSyDW8hRbqq74wjesU3LvsptTLn3ItL7-VuY";
const genAI = new GoogleGenerativeAI(API_KEY);

async function listModels() {
  try {
    // Get the list of available models
    const result = await genAI.getModels();

    // Return the models instead of logging them
    return result.models.map((model) => ({
      name: model.name,
      displayName: model.displayName,
      supportedGenerationMethods: model.supportedGenerationMethods,
    }));
  } catch (error) {
    // Handle errors silently
    return [];
  }
}

// Run the function
listModels();
