import { Message } from "../types";

// Define the Chat type for local storage
export interface LocalChat {
  id: string;
  messages: Message[];
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

// IndexedDB configuration
const DB_NAME = "ranjanchatai_db";
const DB_VERSION = 1;
const CHAT_STORE = "chats";

// Check if IndexedDB is supported
const isIndexedDBSupported = (): boolean => {
  return "indexedDB" in window;
};

// Initialize the database
const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (!isIndexedDBSupported()) {
      reject(new Error("IndexedDB is not supported in this browser"));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error("IndexedDB error:", event);
      reject(new Error("Could not open IndexedDB"));
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create object store for chats if it doesn't exist
      if (!db.objectStoreNames.contains(CHAT_STORE)) {
        const store = db.createObjectStore(CHAT_STORE, { keyPath: "id" });
        store.createIndex("updatedAt", "updatedAt", { unique: false });
      }
    };
  });
};

// Save chat to IndexedDB
const saveToIndexedDB = async (chat: LocalChat): Promise<void> => {
  try {
    const db = await initDB();
    const transaction = db.transaction([CHAT_STORE], "readwrite");
    const store = transaction.objectStore(CHAT_STORE);

    // First check if the chat already exists
    const existingChat = await new Promise<LocalChat | undefined>((resolve) => {
      const request = store.get(chat.id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(undefined);
    });

    // If it exists, update the updatedAt timestamp
    if (existingChat) {
      chat.createdAt = existingChat.createdAt;
    }

    return new Promise((resolve, reject) => {
      const request = store.put(chat);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = (event) => {
        console.error("Error saving to IndexedDB:", event);
        reject(new Error("Failed to save chat to IndexedDB"));
      };
    });
  } catch (error) {
    console.error("IndexedDB save error:", error);
    throw error;
  }
};

// Get all chats from IndexedDB
const getAllFromIndexedDB = async (): Promise<LocalChat[]> => {
  try {
    const db = await initDB();
    const transaction = db.transaction([CHAT_STORE], "readonly");
    const store = transaction.objectStore(CHAT_STORE);
    const index = store.index("updatedAt");

    return new Promise((resolve, reject) => {
      const request = index.openCursor(null, "prev"); // Get in descending order by updatedAt
      const chats: LocalChat[] = [];

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          chats.push(cursor.value);
          cursor.continue();
        } else {
          resolve(chats);
        }
      };

      request.onerror = (event) => {
        console.error("Error getting chats from IndexedDB:", event);
        reject(new Error("Failed to get chats from IndexedDB"));
      };
    });
  } catch (error) {
    console.error("IndexedDB get all error:", error);
    throw error;
  }
};

// Get a specific chat from IndexedDB
const getChatFromIndexedDB = async (id: string): Promise<LocalChat | null> => {
  try {
    const db = await initDB();
    const transaction = db.transaction([CHAT_STORE], "readonly");
    const store = transaction.objectStore(CHAT_STORE);

    return new Promise((resolve, reject) => {
      const request = store.get(id);

      request.onsuccess = () => {
        resolve(request.result || null);
      };

      request.onerror = (event) => {
        console.error("Error getting chat from IndexedDB:", event);
        reject(new Error("Failed to get chat from IndexedDB"));
      };
    });
  } catch (error) {
    console.error("IndexedDB get chat error:", error);
    throw error;
  }
};

// Delete a chat from IndexedDB
const deleteChatFromIndexedDB = async (id: string): Promise<void> => {
  try {
    const db = await initDB();
    const transaction = db.transaction([CHAT_STORE], "readwrite");
    const store = transaction.objectStore(CHAT_STORE);

    return new Promise((resolve, reject) => {
      const request = store.delete(id);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = (event) => {
        console.error("Error deleting chat from IndexedDB:", event);
        reject(new Error("Failed to delete chat from IndexedDB"));
      };
    });
  } catch (error) {
    console.error("IndexedDB delete error:", error);
    throw error;
  }
};

// LocalStorage fallback methods
const STORAGE_KEY = "ranjanchatai_chats";

// Save chat to localStorage
const saveToLocalStorage = (chat: LocalChat): void => {
  try {
    // Get existing chats
    const existingChatsJSON = localStorage.getItem(STORAGE_KEY);
    const existingChats: LocalChat[] = existingChatsJSON
      ? JSON.parse(existingChatsJSON)
      : [];

    // Find and update or add the chat
    const chatIndex = existingChats.findIndex((c) => c.id === chat.id);
    if (chatIndex >= 0) {
      // Preserve the original creation date
      chat.createdAt = existingChats[chatIndex].createdAt;
      existingChats[chatIndex] = chat;
    } else {
      existingChats.push(chat);
    }

    // Sort by updatedAt (newest first)
    existingChats.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    // Save back to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingChats));
  } catch (error) {
    console.error("LocalStorage save error:", error);
    throw error;
  }
};

// Get all chats from localStorage
const getAllFromLocalStorage = (): LocalChat[] => {
  try {
    const chatsJSON = localStorage.getItem(STORAGE_KEY);
    if (!chatsJSON) return [];

    const chats: LocalChat[] = JSON.parse(chatsJSON);

    // Convert string dates back to Date objects
    return chats.map((chat) => ({
      ...chat,
      createdAt: new Date(chat.createdAt),
      updatedAt: new Date(chat.updatedAt),
      messages: chat.messages.map((msg) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      })),
    }));
  } catch (error) {
    console.error("LocalStorage get all error:", error);
    return [];
  }
};

// Get a specific chat from localStorage
const getChatFromLocalStorage = (id: string): LocalChat | null => {
  try {
    const chats = getAllFromLocalStorage();
    return chats.find((chat) => chat.id === id) || null;
  } catch (error) {
    console.error("LocalStorage get chat error:", error);
    return null;
  }
};

// Delete a chat from localStorage
const deleteChatFromLocalStorage = (id: string): void => {
  try {
    const chats = getAllFromLocalStorage();
    const updatedChats = chats.filter((chat) => chat.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedChats));
  } catch (error) {
    console.error("LocalStorage delete error:", error);
    throw error;
  }
};

// Public API with fallback mechanism
export const storageService = {
  // Save a chat
  saveChat: async (chat: LocalChat): Promise<void> => {
    // Ensure dates are properly formatted
    const normalizedChat = {
      ...chat,
      createdAt: new Date(chat.createdAt),
      updatedAt: new Date(),
      messages: chat.messages.map((msg) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      })),
    };

    try {
      if (isIndexedDBSupported()) {
        await saveToIndexedDB(normalizedChat);
      } else {
        saveToLocalStorage(normalizedChat);
      }
    } catch (error) {
      console.error("Error saving chat, falling back to localStorage:", error);
      saveToLocalStorage(normalizedChat);
    }
  },

  // Get all chats
  getAllChats: async (): Promise<LocalChat[]> => {
    try {
      if (isIndexedDBSupported()) {
        return await getAllFromIndexedDB();
      } else {
        return getAllFromLocalStorage();
      }
    } catch (error) {
      console.error(
        "Error getting all chats, falling back to localStorage:",
        error
      );
      return getAllFromLocalStorage();
    }
  },

  // Get a specific chat
  getChat: async (id: string): Promise<LocalChat | null> => {
    try {
      if (isIndexedDBSupported()) {
        return await getChatFromIndexedDB(id);
      } else {
        return getChatFromLocalStorage(id);
      }
    } catch (error) {
      console.error("Error getting chat, falling back to localStorage:", error);
      return getChatFromLocalStorage(id);
    }
  },

  // Delete a chat
  deleteChat: async (id: string): Promise<void> => {
    try {
      if (isIndexedDBSupported()) {
        await deleteChatFromIndexedDB(id);
      } else {
        deleteChatFromLocalStorage(id);
      }
    } catch (error) {
      console.error(
        "Error deleting chat, falling back to localStorage:",
        error
      );
      deleteChatFromLocalStorage(id);
    }
  },

  // Generate a title from the first message
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

export default storageService;
