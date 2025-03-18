import mongoose from "mongoose";

// MongoDB Atlas connection string
// Replace with your actual connection string from MongoDB Atlas
const MONGODB_URI = process.env.REACT_APP_MONGODB_URI || "";

// Connect to MongoDB
export const connectToMongoDB = async () => {
  // In production, we don't need to connect from the client side
  // as the Firebase Functions will handle the MongoDB connection
  if (process.env.NODE_ENV === 'production') {
    console.log("Skipping client-side MongoDB connection in production");
    return true;
  }
  
  if (!MONGODB_URI) {
    console.error("MongoDB connection string is not defined");
    return false;
  }

  try {
    // Only connect if we're not already connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGODB_URI);
      console.log("Connected to MongoDB Atlas");
    }
    return true;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    return false;
  }
};

// Define the Chat schema
const chatSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  messages: [
    {
      id: String,
      text: String,
      sender: String,
      timestamp: Date,
    },
  ],
  title: {
    type: String,
    default: "New Chat",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the Chat model
export const Chat = mongoose.models.Chat || mongoose.model("Chat", chatSchema);

// Function to save a chat
export const saveChat = async (
  userId: string,
  messages: any[],
  title?: string
) => {
  try {
    const chat = new Chat({
      userId,
      messages,
      title: title || `Chat ${new Date().toLocaleString()}`,
      updatedAt: new Date(),
    });
    await chat.save();
    return chat;
  } catch (error) {
    console.error("Error saving chat:", error);
    throw error;
  }
};

// Function to get all chats for a user
export const getUserChats = async (userId: string) => {
  try {
    const chats = await Chat.find({ userId }).sort({ updatedAt: -1 });
    return chats;
  } catch (error) {
    console.error("Error getting user chats:", error);
    throw error;
  }
};

// Function to get a specific chat
export const getChat = async (chatId: string) => {
  try {
    const chat = await Chat.findById(chatId);
    return chat;
  } catch (error) {
    console.error("Error getting chat:", error);
    throw error;
  }
};

// Function to update a chat
export const updateChat = async (
  chatId: string,
  messages: any[],
  title?: string
) => {
  try {
    const chat = await Chat.findByIdAndUpdate(
      chatId,
      {
        messages,
        title: title || undefined,
        updatedAt: new Date(),
      },
      { new: true }
    );
    return chat;
  } catch (error) {
    console.error("Error updating chat:", error);
    throw error;
  }
};

// Function to delete a chat
export const deleteChat = async (chatId: string) => {
  try {
    await Chat.findByIdAndDelete(chatId);
    return true;
  } catch (error) {
    console.error("Error deleting chat:", error);
    throw error;
  }
};
