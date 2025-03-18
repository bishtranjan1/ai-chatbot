import React from "react";
import styled from "styled-components";
import { LocalChat } from "../services/storageService";

interface SidebarProps {
  isOpen: boolean;
  chats: LocalChat[];
  currentChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
  toggleSidebar: () => void;
}

const SidebarContainer = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100%;
  background-color: #f2f2f7;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  transform: translateX(${(props) => (props.isOpen ? "0" : "-100%")});
  transition: transform 0.3s ease;
  z-index: 1000;
  display: flex;
  flex-direction: column;
`;

const SidebarHeader = styled.div`
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

const SidebarTitle = styled.h2`
  margin: 0;
  font-size: 17px;
  font-weight: 600;
  color: #000000;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #0084ff;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
`;

const NewChatButton = styled.button`
  margin: 16px;
  padding: 10px 16px;
  background-color: #0084ff;
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #0062cc;
  }
`;

const ChatsList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px;
`;

const ChatItem = styled.div<{ isActive: boolean }>`
  padding: 12px;
  margin-bottom: 8px;
  border-radius: 10px;
  background-color: ${(props) =>
    props.isActive ? "rgba(0, 132, 255, 0.1)" : "white"};
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background-color: ${(props) =>
      props.isActive ? "rgba(0, 132, 255, 0.15)" : "rgba(0, 0, 0, 0.05)"};
  }
`;

const ChatTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #000000;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
`;

const ChatDate = styled.div`
  font-size: 12px;
  color: #8e8e93;
  margin-top: 4px;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #ff3b30;
  font-size: 16px;
  cursor: pointer;
  padding: 4px;
  margin-left: 8px;
  opacity: 0.7;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 1;
  }
`;

const EmptyState = styled.div`
  padding: 16px;
  text-align: center;
  color: #8e8e93;
  font-size: 14px;
`;

const Overlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 999;
  display: ${(props) => (props.isOpen ? "block" : "none")};

  @media (min-width: 769px) {
    display: none;
  }
`;

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  chats,
  currentChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  toggleSidebar,
}) => {
  const formatDate = (date: Date) => {
    const now = new Date();
    const chatDate = new Date(date);

    // If today, show time
    if (chatDate.toDateString() === now.toDateString()) {
      return chatDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    // If this year, show month and day
    if (chatDate.getFullYear() === now.getFullYear()) {
      return chatDate.toLocaleDateString([], {
        month: "short",
        day: "numeric",
      });
    }

    // Otherwise show full date
    return chatDate.toLocaleDateString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleChatClick = (chatId: string) => {
    onSelectChat(chatId);
    if (window.innerWidth < 769) {
      toggleSidebar();
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    onDeleteChat(chatId);
  };

  return (
    <>
      <Overlay isOpen={isOpen} onClick={toggleSidebar} />
      <SidebarContainer isOpen={isOpen}>
        <SidebarHeader>
          <SidebarTitle>Chats</SidebarTitle>
          <CloseButton onClick={toggleSidebar}>×</CloseButton>
        </SidebarHeader>

        <NewChatButton onClick={onNewChat}>+ New Chat</NewChatButton>

        <ChatsList>
          {chats.length === 0 ? (
            <EmptyState>No saved chats yet</EmptyState>
          ) : (
            chats.map((chat) => (
              <ChatItem
                key={chat.id}
                isActive={chat.id === currentChatId}
                onClick={() => handleChatClick(chat.id)}
              >
                <div>
                  <ChatTitle>{chat.title}</ChatTitle>
                  <ChatDate>{formatDate(chat.updatedAt)}</ChatDate>
                </div>
                <DeleteButton
                  onClick={(e) => handleDeleteClick(e, chat.id)}
                  aria-label="Delete chat"
                >
                  ×
                </DeleteButton>
              </ChatItem>
            ))
          )}
        </ChatsList>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;
