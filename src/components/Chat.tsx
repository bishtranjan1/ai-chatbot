import React, { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";
import ChatContainer from "./ChatContainer";
import ChatInput from "./ChatInput";
import ApiKeyTest from "./ApiKeyTest";
import Sidebar from "./Sidebar";
import { Message } from "../types";
import {
  getChatResponse,
  resetHinglishPreference,
} from "../services/geminiService";
import storageService, { LocalChat } from "../services/storageService";

const ChatWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 1200px;
  margin: 0 auto;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    height: 100vh;
    width: 100%;
  }
`;

const Header = styled.header`
  padding: 12px 16px;
  background-color: rgba(249, 249, 249, 0.94);
  color: #000000;
  font-size: 17px;
  font-weight: 600;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 10;
  letter-spacing: -0.01em;

  @media (max-width: 768px) {
    padding: 10px;
    font-size: 15px;
    justify-content: flex-start;
    height: 48px; /* Fixed height for mobile */
  }
`;

const AppIcon = styled.div`
  margin-right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;

  img {
    width: 100%;
    height: 100%;
  }

  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
    margin-right: 6px;
    margin-left: 36px; /* Space for hamburger menu */
  }

  @media (max-width: 320px) {
    margin-right: 0;
  }
`;

const AppTitle = styled.span`
  font-size: 17px;
  color: #0084ff;
  font-weight: 600;

  @media (max-width: 320px) {
    display: none; /* Hide app name only on very small screens */
  }
`;

const ErrorMessage = styled.div`
  background-color: #fef1f2;
  color: #ff3b30;
  padding: 8px 16px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
`;

const SaveButton = styled.button`
  background-color: #0084ff;
  color: white;
  border: none;
  border-radius: 16px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background-color: #0062cc;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 4px 8px;
    font-size: 11px;
    border-radius: 12px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const MenuButton = styled.button`
  position: absolute;
  left: 16px;
  background: none;
  border: none;
  color: #0084ff;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;

  @media (max-width: 768px) {
    left: 8px;
    width: 28px;
    height: 28px;
    font-size: 18px;
  }
`;

const MainContent = styled.div<{ sidebarOpen: boolean }>`
  margin-left: ${(props) => (props.sidebarOpen ? "280px" : "0")};
  transition: margin-left 0.3s ease;
  width: ${(props) => (props.sidebarOpen ? "calc(100% - 280px)" : "100%")};

  @media (max-width: 768px) {
    margin-left: 0;
    width: 100%;
  }
`;

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: rgba(249, 249, 249, 0.9);
  border-radius: 20px;
  padding: 4px 10px;
  margin-right: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);

  @media (max-width: 768px) {
    margin-right: 8px;
    padding: 2px 6px;
    border-radius: 16px;
    height: 24px;
  }
`;

const ToggleLabel = styled.span`
  font-size: 12px;
  font-weight: 500;
  margin-right: 8px;
  color: #333;

  @media (max-width: 768px) {
    font-size: 10px;
    margin-right: 4px;
  }
`;

const ToggleSwitch = styled.div<{ active: boolean }>`
  width: 40px;
  height: 20px;
  background-color: ${(props) => (props.active ? "#0084ff" : "#ccc")};
  border-radius: 10px;
  position: relative;
  cursor: pointer;
  transition: background-color 0.3s;

  &:after {
    content: "";
    position: absolute;
    top: 2px;
    left: ${(props) => (props.active ? "22px" : "2px")};
    width: 16px;
    height: 16px;
    background-color: white;
    border-radius: 50%;
    transition: left 0.3s;
  }

  @media (max-width: 768px) {
    width: 32px;
    height: 16px;

    &:after {
      width: 12px;
      height: 12px;
      top: 2px;
      left: ${(props) => (props.active ? "18px" : "2px")};
    }
  }
`;

const TitlePromptOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const TitlePromptContainer = styled.div`
  background-color: white;
  padding: 24px;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

const TitlePromptHeader = styled.h3`
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 18px;
  color: #333;
`;

const TitleInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  margin-bottom: 16px;
  box-sizing: border-box;

  &:focus {
    border-color: #0084ff;
    outline: none;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const Button = styled.button<{ primary?: boolean }>`
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  background-color: ${(props) => (props.primary ? "#0084ff" : "#f1f1f1")};
  color: ${(props) => (props.primary ? "white" : "#333")};

  &:hover {
    background-color: ${(props) => (props.primary ? "#0062cc" : "#e1e1e1")};
  }
`;

const HeaderRightControls = styled.div`
  position: absolute;
  right: 16px;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    right: 8px;
    flex-direction: row;
    align-items: center;
    height: 100%;
    gap: 4px;
  }
`;

const DownloadLink = styled.a`
  font-size: 12px;
  color: #0084ff;
  text-decoration: none;
  margin-right: 12px;
  display: flex;
  align-items: center;

  &:hover {
    text-decoration: underline;
  }

  svg {
    margin-right: 4px;
  }

  .install-text {
    @media (max-width: 480px) {
      display: none;
    }
  }

  @media (max-width: 768px) {
    margin-right: 8px;
    font-size: 11px;
    height: 24px;
    display: flex;
    align-items: center;

    svg {
      width: 14px;
      height: 14px;
    }
  }
`;

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showApiTest, setShowApiTest] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [chats, setChats] = useState<LocalChat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [hinglishMode, setHinglishMode] = useState<boolean>(true);
  const [showTitlePrompt, setShowTitlePrompt] = useState(false);
  const [customTitle, setCustomTitle] = useState("");
  const [suggestedTitle, setSuggestedTitle] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Handle window resize for responsive elements
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Load chats on component mount
  useEffect(() => {
    const loadChats = async () => {
      try {
        const savedChats = await storageService.getAllChats();
        setChats(savedChats);
      } catch (err) {
        console.error("Error loading chats:", err);
      }
    };

    loadChats();
  }, []);

  // Update the chat list whenever a chat is saved or deleted
  const refreshChatList = useCallback(async () => {
    try {
      const savedChats = await storageService.getAllChats();
      setChats(savedChats);
    } catch (err) {
      console.error("Error refreshing chat list:", err);
    }
  }, []);

  const handleSaveChat = useCallback(async () => {
    if (messages.length > 0) {
      // Generate a suggested title
      const generatedTitle = storageService.generateTitle(messages);
      setSuggestedTitle(generatedTitle);
      setCustomTitle(generatedTitle);
      setShowTitlePrompt(true);
    }
  }, [messages]);

  const handleSaveWithTitle = useCallback(async () => {
    if (messages.length === 0) return;

    setIsSaving(true);
    try {
      const title = customTitle.trim() || suggestedTitle;
      const chatToSave: LocalChat = {
        id: currentChatId || uuidv4(),
        messages: messages,
        title,
        createdAt: currentChatId
          ? chats.find((c) => c.id === currentChatId)?.createdAt || new Date()
          : new Date(),
        updatedAt: new Date(),
      };

      await storageService.saveChat(chatToSave);

      // Update local state
      setCurrentChatId(chatToSave.id);

      // Refresh chats list
      await refreshChatList();

      // Close the prompt
      setShowTitlePrompt(false);
    } catch (err) {
      console.error("Error saving chat:", err);
      setError("Failed to save chat. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }, [
    messages,
    currentChatId,
    chats,
    refreshChatList,
    customTitle,
    suggestedTitle,
  ]);

  const handleCancelSave = () => {
    setShowTitlePrompt(false);
  };

  // Modify the saveChat function to be used for auto-saving after responses
  const saveChat = useCallback(
    async (messagesToSave = messages) => {
      if (messagesToSave.length === 0) return;

      try {
        const title = storageService.generateTitle(messagesToSave);
        const chatToSave: LocalChat = {
          id: currentChatId || uuidv4(),
          messages: messagesToSave,
          title,
          createdAt: currentChatId
            ? chats.find((c) => c.id === currentChatId)?.createdAt || new Date()
            : new Date(),
          updatedAt: new Date(),
        };

        await storageService.saveChat(chatToSave);

        // Update local state
        setCurrentChatId(chatToSave.id);

        // Refresh chats list
        await refreshChatList();
      } catch (err) {
        console.error("Error saving chat:", err);
      }
    },
    [messages, currentChatId, chats, refreshChatList]
  );

  const handleSendMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      // Create and add user message
      const userMessage: Message = {
        id: uuidv4(),
        text,
        sender: "user",
        timestamp: new Date(),
      };

      // Update messages
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setIsLoading(true);
      setError(null);

      try {
        // Get response from Gemini, passing the hinglishMode state
        const response = await getChatResponse(text, hinglishMode);

        // Create and add bot message
        const botMessage: Message = {
          id: uuidv4(),
          text: response,
          sender: "bot",
          timestamp: new Date(),
        };

        // Update messages with response
        const messagesWithResponse = [...updatedMessages, botMessage];
        setMessages(messagesWithResponse);

        // Auto-save chat after getting response
        if (messagesWithResponse.length >= 2) {
          await saveChat(messagesWithResponse);
        }
      } catch (err) {
        // Handle error
        setError("Failed to get a response. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [messages, saveChat, hinglishMode]
  );

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleNewChat = useCallback(() => {
    setMessages([]);
    setCurrentChatId(null);
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  }, []);

  const handleSelectChat = useCallback(async (chatId: string) => {
    try {
      const chat = await storageService.getChat(chatId);
      if (chat) {
        setMessages(chat.messages);
        setCurrentChatId(chat.id);
      }
    } catch (err) {
      console.error("Error selecting chat:", err);
      setError("Failed to load the selected chat.");
    }
  }, []);

  const handleDeleteChat = useCallback(
    async (chatId: string) => {
      try {
        await storageService.deleteChat(chatId);

        // Refresh chats list
        await refreshChatList();

        // If the deleted chat was the current one, create a new chat
        if (currentChatId === chatId) {
          setMessages([]);
          setCurrentChatId(null);
        }
      } catch (err) {
        console.error("Error deleting chat:", err);
        setError("Failed to delete the chat.");
      }
    },
    [currentChatId, refreshChatList]
  );

  const toggleHinglishMode = useCallback(() => {
    const newMode = !hinglishMode;
    setHinglishMode(newMode);

    if (!newMode) {
      // Switching to English
      resetHinglishPreference();
    }
  }, [hinglishMode]);

  return (
    <>
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        chats={chats}
        currentChatId={currentChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
      />

      <MainContent sidebarOpen={sidebarOpen}>
        <ChatWrapper>
          <Header>
            <MenuButton onClick={toggleSidebar}>☰</MenuButton>
            <AppIcon>
              <img
                src={`${process.env.PUBLIC_URL}/logo.svg`}
                alt="Ranjan-AI Logo"
                width="32"
                height="32"
              />
            </AppIcon>
            <AppTitle>Ranjan-AI</AppTitle>

            <HeaderRightControls>
              <DownloadLink href="/download.html" target="_blank">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 16L12 8"
                    stroke="#0084ff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 13L12 16L15 13"
                    stroke="#0084ff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M20 16V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V16"
                    stroke="#0084ff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="install-text">Install</span>
              </DownloadLink>
              <ToggleContainer>
                <ToggleLabel>
                  {hinglishMode ? "Hinglish" : "English"}
                </ToggleLabel>
                <ToggleSwitch
                  active={hinglishMode}
                  onClick={toggleHinglishMode}
                />
              </ToggleContainer>

              {messages.length > 0 && (
                <SaveButton onClick={handleSaveChat} disabled={isSaving}>
                  {isSaving ? "..." : isMobile ? "Save" : "Save Chat"}
                </SaveButton>
              )}
            </HeaderRightControls>
          </Header>

          {error && (
            <ErrorMessage>
              {error}
              <button
                onClick={() => setShowApiTest(!showApiTest)}
                style={{
                  marginLeft: "10px",
                  background: "none",
                  border: "none",
                  color: "#ff3b30",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                {showApiTest ? "Hide Diagnostics" : "Show Diagnostics"}
              </button>
            </ErrorMessage>
          )}

          {showApiTest && <ApiKeyTest />}

          <ChatContainer messages={messages} isLoading={isLoading} />

          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />

          {showTitlePrompt && (
            <TitlePromptOverlay>
              <TitlePromptContainer>
                <TitlePromptHeader>Save Chat</TitlePromptHeader>
                <TitleInput
                  type="text"
                  placeholder="Enter a title for this chat"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  autoFocus
                />
                <ButtonGroup>
                  <Button onClick={handleCancelSave}>Cancel</Button>
                  <Button
                    primary
                    onClick={handleSaveWithTitle}
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                </ButtonGroup>
              </TitlePromptContainer>
            </TitlePromptOverlay>
          )}
        </ChatWrapper>
      </MainContent>
    </>
  );
};

export default Chat;
