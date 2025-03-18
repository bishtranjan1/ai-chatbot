import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "./AuthContext";
import chatService, { Chat, Message } from "../services/chatService";

// Define the context type
interface ChatContextType {
  chats: Chat[];
  currentChat: Chat | null;
  loading: boolean;
  error: string | null;
  createNewChat: () => void;
  selectChat: (chatId: string) => Promise<void>;
  updateChatMessages: (messages: Message[]) => void;
  saveCurrentChat: (title?: string) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
  clearError: () => void;
}

// Create the context with a default value
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Provider component
export const ChatProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load user's chats when authenticated
  useEffect(() => {
    if (user) {
      loadChats();
    } else {
      // Reset state when user logs out
      setChats([]);
      setCurrentChat(null);
    }
  }, [user]);

  // Create a new chat when there's no current chat
  useEffect(() => {
    if (user && !currentChat && !loading) {
      createNewChat();
    }
  }, [user, currentChat, loading]);

  // Load all chats for the current user
  const loadChats = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const userChats = await chatService.getAllChats();
      setChats(userChats);

      // If there are chats, select the most recent one
      if (userChats.length > 0) {
        setCurrentChat(userChats[0]);
      }
    } catch (err) {
      console.error("Error loading chats:", err);
      setError("Failed to load your chat history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Create a new empty chat
  const createNewChat = () => {
    const newChat: Chat = {
      _id: uuidv4(), // Temporary ID until saved to server
      userId: user?.uid || "",
      messages: [],
      title: "New Chat",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setCurrentChat(newChat);
  };

  // Select a specific chat by ID
  const selectChat = async (chatId: string) => {
    setLoading(true);
    setError(null);

    try {
      // First check if the chat is already in our local state
      const existingChat = chats.find((chat) => chat._id === chatId);

      if (existingChat) {
        setCurrentChat(existingChat);
      } else {
        // If not found locally, fetch from server
        const chat = await chatService.getChat(chatId);
        setCurrentChat(chat);
      }
    } catch (err) {
      console.error("Error selecting chat:", err);
      setError("Failed to load the selected chat. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Update messages in the current chat
  const updateChatMessages = (messages: Message[]) => {
    if (!currentChat) return;

    const updatedChat = {
      ...currentChat,
      messages,
      updatedAt: new Date(),
    };

    setCurrentChat(updatedChat);
  };

  // Save the current chat to the server
  const saveCurrentChat = async (title?: string) => {
    if (!user || !currentChat) return;

    setLoading(true);
    setError(null);

    try {
      let savedChat: Chat;
      const chatTitle =
        title || chatService.generateTitle(currentChat.messages);

      // Check if the chat already exists on the server (has a non-UUID _id)
      const isExistingChat = chats.some((chat) => chat._id === currentChat._id);

      if (isExistingChat) {
        // Update existing chat
        savedChat = await chatService.updateChat(
          currentChat._id,
          currentChat.messages,
          chatTitle
        );
      } else {
        // Create new chat
        savedChat = await chatService.createChat(
          currentChat.messages,
          chatTitle
        );
      }

      // Update local state
      setCurrentChat(savedChat);

      // Update the chats list
      setChats((prevChats) => {
        const updatedChats = prevChats.filter(
          (chat) => chat._id !== savedChat._id
        );
        return [savedChat, ...updatedChats];
      });
    } catch (err) {
      console.error("Error saving chat:", err);
      setError("Failed to save your chat. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Delete a chat
  const deleteChat = async (chatId: string) => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      await chatService.deleteChat(chatId);

      // Update local state
      setChats((prevChats) => prevChats.filter((chat) => chat._id !== chatId));

      // If the deleted chat was the current chat, create a new one
      if (currentChat && currentChat._id === chatId) {
        createNewChat();
      }
    } catch (err) {
      console.error("Error deleting chat:", err);
      setError("Failed to delete the chat. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Clear any error
  const clearError = () => {
    setError(null);
  };

  // Context value
  const value: ChatContextType = {
    chats,
    currentChat,
    loading,
    error,
    createNewChat,
    selectChat,
    updateChatMessages,
    saveCurrentChat,
    deleteChat,
    clearError,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

// Custom hook to use the chat context
export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
