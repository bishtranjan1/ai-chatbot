import React, { useRef, useEffect } from "react";
import styled from "styled-components";
import ChatMessage from "./ChatMessage";
import { Message } from "../types";

interface ChatContainerProps {
  messages: Message[];
  isLoading: boolean;
}

const Container = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px 12px;
  background-color: #ffffff;
  -webkit-overflow-scrolling: touch; /* iOS-style momentum scrolling */

  /* iOS-style scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    border: 2px solid #ffffff;
  }
`;

const LoadingIndicator = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-bottom: 16px;
`;

const LoadingDots = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 14px;
  background-color: #e5e5ea;
  border-radius: 20px;
  border-bottom-left-radius: 5px;

  span {
    width: 8px;
    height: 8px;
    margin: 0 2px;
    background-color: #8e8e93;
    border-radius: 50%;
    display: inline-block;
    animation: bounce 1.4s infinite ease-in-out both;

    &:nth-child(1) {
      animation-delay: -0.32s;
    }

    &:nth-child(2) {
      animation-delay: -0.16s;
    }
  }

  @keyframes bounce {
    0%,
    80%,
    100% {
      transform: scale(0);
    }
    40% {
      transform: scale(1);
    }
  }
`;

const EmptyStateMessage = styled.div`
  text-align: center;
  color: #8e8e93;
  margin-top: 40px;
  font-size: 16px;
  line-height: 1.5;
  font-weight: 400;
  letter-spacing: -0.01em;
`;

const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  isLoading,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Find the first bot message index
  const firstBotMessageIndex = messages.findIndex(
    (message) => message.sender === "bot"
  );

  return (
    <Container ref={containerRef}>
      {messages.length === 0 ? (
        <EmptyStateMessage>
          Send a message to start chatting with RanjanchatAI!
          <br />
          I'm your witty AI assistant with a great sense of humor. 😄
          <br />
          Ask me anything and I'll respond with a fun twist!
        </EmptyStateMessage>
      ) : (
        messages.map((message, index) => (
          <ChatMessage
            key={message.id}
            message={message}
            isFirstBotMessage={
              message.sender === "bot" && index === firstBotMessageIndex
            }
          />
        ))
      )}

      {isLoading && (
        <LoadingIndicator>
          <LoadingDots>
            <span></span>
            <span></span>
            <span></span>
          </LoadingDots>
        </LoadingIndicator>
      )}
    </Container>
  );
};

export default ChatContainer;
