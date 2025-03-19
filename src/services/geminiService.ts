import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

// Initialize the Google Generative AI with your API key
const API_KEY = process.env.REACT_APP_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

// Configure safety settings
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// Configure generation config
const generationConfig = {
  temperature: 0.8, // Slightly increased for more creative responses
  topK: 40,
  topP: 0.95,
  maxOutputTokens: 1024,
};

// Conversation state
let useHinglish = true;

// Helper function to detect if the user is asking to speak in Hinglish
const isRequestingHinglish = (text: string): boolean => {
  const hinglishKeywords = [
    "speak hinglish",
    "talk hinglish",
    "respond in hinglish",
    "reply in hinglish",
    "use hinglish",
    "baat karo",
    "hindi me baat",
    "hindi me bolo",
    "hinglish me baat",
    "hinglish me bolo",
  ];

  const lowerText = text.toLowerCase();
  return hinglishKeywords.some((keyword) => lowerText.includes(keyword));
};

// Helper function to detect if the message is in Hinglish
const isHinglishMessage = (text: string): boolean => {
  // Common Hindi words written in Roman script
  const hindiWords = [
    "kya",
    "kaise",
    "aap",
    "tum",
    "main",
    "hum",
    "yeh",
    "woh",
    "hai",
    "hain",
    "tha",
    "the",
    "karo",
    "karein",
    "bolo",
    "kahaan",
    "kyun",
    "kyon",
    "accha",
    "theek",
    "nahi",
    "nahin",
    "haan",
    "ji",
    "kuch",
    "mujhe",
    "tumhe",
    "unhe",
    "hamein",
    "aapko",
    "mera",
    "tera",
    "uska",
    "hamara",
    "aapka",
    "kab",
    "abhi",
    "baad",
    "pehle",
    "jaldi",
  ];

  const words = text.toLowerCase().split(/\s+/);
  const hindiWordCount = words.filter((word) =>
    hindiWords.includes(word)
  ).length;

  // If at least 15% of words are Hindi and there are at least 2 Hindi words
  return hindiWordCount >= 2 && hindiWordCount / words.length >= 0.15;
};

// Helper function to detect if user is saying their name is lakdiwali
const isLakdiwaliIntroduction = (text: string): boolean => {
  const lowerText = text.toLowerCase();
  const patterns = [
    "my name is lakdiwali",
    "i am lakdiwali",
    "i'm lakdiwali",
    "call me lakdiwali",
    "this is lakdiwali",
    "lakdiwali here",
    "mera naam lakdiwali hai",
    "main lakdiwali hoon",
    "lakdiwali bol rahi hoon",
  ];

  return patterns.some((pattern) => lowerText.includes(pattern));
};

// Function to get a response from Gemini
export const getChatResponse = async (
  prompt: string,
  forceHinglish: boolean = false
): Promise<string> => {
  try {
    // Special case for lakdiwali
    if (isLakdiwaliIntroduction(prompt)) {
      return "**Hi beautiful!** 💕 It's wonderful to see you. How can I help you today?";
    }

    // Check if user is requesting Hinglish
    if (isRequestingHinglish(prompt)) {
      useHinglish = true;
    }

    // Check if message is in Hinglish
    const isHinglish = isHinglishMessage(prompt);

    // Try different models to see which one works
    const modelsToTry = [
      "gemini-1.0-pro",
      "gemini-pro",
      "gemini-1.5-pro",
      "gemini-1.5-flash",
    ];

    let result = null;
    let lastError = null;

    // Try each model until one works
    for (const modelName of modelsToTry) {
      try {
        // Use the Gemini model
        const model = genAI.getGenerativeModel({
          model: modelName,
        });

        // Create a prompt that includes personality instructions
        const enhancedPrompt = `
You are a witty and humorous AI assistant with a fun personality.
Always respond in a lighthearted, entertaining way with a touch of humor.
Use casual language, occasional jokes, and playful expressions.
Keep responses helpful but make them enjoyable to read with your cheerful personality.

IMPORTANT INSTRUCTIONS:
1. If someone specifically asks for your name or identity (like "What's your name?", "Who are you?", "What should I call you?"), ONLY THEN identify yourself as "Ranjan".
2. Do NOT mention your name "Ranjan" in any other responses where the user hasn't specifically asked about your name or identity.
3. Use Markdown formatting in your responses:
   - Use **bold** for emphasis
   - Use *italics* for subtle emphasis
   - Use bullet points and numbered lists when appropriate
   - Format code with \`backticks\` when needed
   - Use proper headings with # when organizing information
4. LANGUAGE HANDLING:
   - ${
     forceHinglish || useHinglish || isHinglish
       ? "RESPOND IN HINGLISH. This is very important."
       : "If the user writes in Hinglish (a mix of Hindi and English), respond in Hinglish."
   }
   - When responding in Hinglish, use a natural mix of Hindi and English words, with Hindi written in Roman script (not Devanagari).
   - Example Hinglish: "Aap kaise ho? Main aapki kya help kar sakta hoon?"

User's message: ${prompt}

Your response (with Markdown formatting):`;

        // Generate content with the enhanced prompt
        result = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: enhancedPrompt }] }],
          safetySettings,
          generationConfig,
        });

        // If we get here, the model works
        break;
      } catch (modelError) {
        lastError = modelError;
        // Continue to the next model
      }
    }

    if (result) {
      const response = result.response;
      return response.text();
    } else {
      throw lastError; // Re-throw the last error to be caught below
    }
  } catch (error) {
    // Create a detailed error message for debugging
    let errorDetails = "Unknown error occurred";

    if (error instanceof Error) {
      errorDetails = error.message;

      // Check for specific error conditions
      if (error.message.includes("API key")) {
        return "**API Key Error**: It looks like there's an issue with the API key. Please check if it's valid and properly configured.";
      } else if (
        error.message.includes("network") ||
        error.message.includes("Failed to fetch")
      ) {
        return "**Network Error**: I couldn't connect to the AI service. Please check your internet connection and try again.";
      } else if (error.message.includes("PERMISSION_DENIED")) {
        return "**Permission Error**: Your API key doesn't have permission to access this service. You may need to enable the Gemini API in your Google Cloud Console.";
      } else if (
        error.message.includes("quota") ||
        error.message.includes("rate limit")
      ) {
        return "**Quota Exceeded**: We've hit the usage limit for the AI service. Please try again in a few minutes.";
      } else if (
        error.message.includes("not found") ||
        error.message.includes("404")
      ) {
        return "**Model Not Found**: The AI model couldn't be found. Please try using a different model in the geminiService.ts file.";
      } else if (
        error.message.includes("blocked") ||
        error.message.includes("safety")
      ) {
        return "**Content Filtered**: Your request was blocked by the AI's safety filters. Please try rephrasing your question.";
      } else if (error.message.includes("timeout")) {
        return "**Request Timeout**: The AI service took too long to respond. Please try again with a simpler question.";
      }
    }

    // For development purposes, include the actual error details
    // In production, you might want to remove this or log it instead
    return `**Oops!** I'm having trouble processing your request right now. Please try again in a moment! 🧠✨\n\nTechnical details (for debugging): ${errorDetails}`;
  }
};

// Reset Hinglish preference
export const resetHinglishPreference = (): void => {
  useHinglish = false;
};

// Function to test if the API key is working
export const testApiKey = async (): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    // Try different models to see which one works
    const modelsToTry = [
      "gemini-1.0-pro",
      "gemini-pro",
      "gemini-1.5-pro",
      "gemini-1.5-flash",
    ];

    let workingModel = null;
    let lastError = null;

    // Try each model until one works
    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
        });

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const result = await model.generateContent({
          contents: [
            { role: "user", parts: [{ text: "Hello, are you working?" }] },
          ],
          generationConfig: {
            maxOutputTokens: 10,
          },
        });

        // If we get here, the model works
        workingModel = modelName;
        break;
      } catch (modelError) {
        lastError = modelError;
        // Continue to the next model
      }
    }

    if (workingModel) {
      return {
        success: true,
        message: `API key is working correctly with model: ${workingModel}. You can use this model in your application.`,
      };
    } else {
      throw lastError; // Re-throw the last error to be caught below
    }
  } catch (error) {
    let errorMessage = "Unknown error occurred";

    if (error instanceof Error) {
      errorMessage = error.message;

      // Check for specific error types
      if (errorMessage.includes("API key")) {
        return {
          success: false,
          message: `API key is invalid or not properly configured: ${errorMessage}`,
        };
      } else if (errorMessage.includes("PERMISSION_DENIED")) {
        return {
          success: false,
          message: `Permission denied. Your API key may not have access to the Gemini API: ${errorMessage}`,
        };
      }
    }

    return {
      success: false,
      message: `API key test failed: ${errorMessage}`,
    };
  }
};
