import { getAuth } from "firebase/auth";

// Types
export interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export interface Chat {
  _id: string;
  userId: string;
  messages: Message[];
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

// API URL from environment variable or default to localhost
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Helper to get the current user's token
const getAuthToken = async (): Promise<string> => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User not authenticated");
  }

  return user.getIdToken();
};

// Helper to make authenticated API requests
const fetchWithAuth = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  try {
    const token = await getAuthToken();

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API error: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};

// Chat service functions
export const chatService = {
  // Get all chats for the current user
  getAllChats: async (): Promise<Chat[]> => {
    return fetchWithAuth("/chats");
  },

  // Get a specific chat by ID
  getChat: async (chatId: string): Promise<Chat> => {
    return fetchWithAuth(`/chats/${chatId}`);
  },

  // Create a new chat
  createChat: async (messages: Message[], title?: string): Promise<Chat> => {
    return fetchWithAuth("/chats", {
      method: "POST",
      body: JSON.stringify({ messages, title }),
    });
  },

  // Update an existing chat
  updateChat: async (
    chatId: string,
    messages: Message[],
    title?: string
  ): Promise<Chat> => {
    return fetchWithAuth(`/chats/${chatId}`, {
      method: "PUT",
      body: JSON.stringify({ messages, title }),
    });
  },

  // Delete a chat
  deleteChat: async (chatId: string): Promise<void> => {
    return fetchWithAuth(`/chats/${chatId}`, {
      method: "DELETE",
    });
  },

  // Generate a default title from the first message
  generateTitle: (messages: Message[]): string => {
    if (!messages || messages.length === 0) {
      return "New Chat";
    }

    const firstUserMessage =
      messages.find((m) => m.sender === "user")?.text || "";

    // Limit title length and add ellipsis if needed
    const maxLength = 30;
    if (firstUserMessage.length <= maxLength) {
      return firstUserMessage || "New Chat";
    }

    return `${firstUserMessage.substring(0, maxLength)}...`;
  },
};

export default chatService;
