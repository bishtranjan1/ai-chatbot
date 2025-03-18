const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const admin = require("./firebase-admin");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: ["https://chatbotai-40d8b.web.app", "http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define Chat schema
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

const Chat = mongoose.model("Chat", chatSchema);

// Authentication middleware
const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ error: "Unauthorized" });
  }
};

// Routes
app.get("/api/chats", authenticateUser, async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.user.uid }).sort({
      updatedAt: -1,
    });
    res.json(chats);
  } catch (error) {
    console.error("Error getting chats:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/chats/:id", authenticateUser, async (req, res) => {
  try {
    const chat = await Chat.findOne({
      _id: req.params.id,
      userId: req.user.uid,
    });

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    res.json(chat);
  } catch (error) {
    console.error("Error getting chat:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/chats", authenticateUser, async (req, res) => {
  try {
    const { messages, title } = req.body;

    const chat = new Chat({
      userId: req.user.uid,
      messages,
      title: title || `Chat ${new Date().toLocaleString()}`,
      updatedAt: new Date(),
    });

    await chat.save();
    res.status(201).json(chat);
  } catch (error) {
    console.error("Error creating chat:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.put("/api/chats/:id", authenticateUser, async (req, res) => {
  try {
    const { messages, title } = req.body;

    const chat = await Chat.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.uid },
      {
        messages,
        title: title || undefined,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    res.json(chat);
  } catch (error) {
    console.error("Error updating chat:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.delete("/api/chats/:id", authenticateUser, async (req, res) => {
  try {
    const result = await Chat.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.uid,
    });

    if (!result) {
      return res.status(404).json({ error: "Chat not found" });
    }

    res.json({ message: "Chat deleted successfully" });
  } catch (error) {
    console.error("Error deleting chat:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
