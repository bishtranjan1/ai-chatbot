import React from "react";
import styled from "styled-components";
import ReactMarkdown from "react-markdown";
import { Message } from "../types";

interface ChatMessageProps {
  message: Message;
  isFirstBotMessage?: boolean;
}

const MessageContainer = styled.div<{ isUser: boolean }>`
  display: flex;
  margin-bottom: 16px;
  justify-content: ${(props) => (props.isUser ? "flex-end" : "flex-start")};
`;

const MessageContent = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 90%;
`;

const MessageBubble = styled.div<{ isUser: boolean }>`
  padding: 12px 16px;
  border-radius: 20px;
  background: ${(props) =>
    props.isUser
      ? "linear-gradient(135deg, #0A84FF 0%, #0062CC 100%)"
      : "#e5e5ea"};
  color: ${(props) => (props.isUser ? "white" : "#000000")};
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  font-size: 16px;
  line-height: 1.5;
  font-weight: 400;
  letter-spacing: -0.01em;
  width: 100%;

  /* iOS-style bubble tail */
  border-bottom-left-radius: ${(props) => (!props.isUser ? "5px" : "20px")};
  border-bottom-right-radius: ${(props) => (props.isUser ? "5px" : "20px")};
`;

const MarkdownContent = styled.div<{ isUser: boolean }>`
  /* Style for markdown content */
  p {
    margin: 0 0 8px 0;
    &:last-child {
      margin-bottom: 0;
    }
  }

  strong,
  b {
    font-weight: 600;
  }

  em,
  i {
    font-style: italic;
  }

  a {
    color: ${(props) => (props.isUser ? "white" : "#0A84FF")};
    text-decoration: underline;
  }

  ul,
  ol {
    margin: 8px 0;
    padding-left: 20px;
  }

  li {
    margin-bottom: 4px;
  }

  code {
    font-family: "SF Mono", monospace;
    background-color: ${(props) =>
      props.isUser ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.05)"};
    padding: 2px 4px;
    border-radius: 4px;
    font-size: 14px;
  }

  pre {
    background-color: ${(props) =>
      props.isUser ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)"};
    padding: 8px;
    border-radius: 8px;
    overflow-x: auto;
    margin: 8px 0;

    code {
      background-color: transparent;
      padding: 0;
    }
  }
`;

const BotMessageHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 6px;
  font-weight: 600;
  color: #0084ff;
  font-size: 14px;
`;

const BotIcon = styled.div`
  width: 20px;
  height: 20px;
  margin-right: 6px;
  background-color: #0084ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  font-weight: bold;
`;

const Timestamp = styled.div`
  font-size: 11px;
  color: #8e8e93;
  margin-top: 4px;
  text-align: right;
  font-weight: 500;
`;

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isFirstBotMessage = false,
}) => {
  const isUser = message.sender === "user";
  const formattedTime = message.timestamp.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <MessageContainer isUser={isUser}>
      <MessageContent>
        <MessageBubble isUser={isUser}>
          {!isUser && isFirstBotMessage && (
            <BotMessageHeader>
              <BotIcon>R</BotIcon>
              Ranjan
            </BotMessageHeader>
          )}
          <MarkdownContent isUser={isUser}>
            <ReactMarkdown>{message.text}</ReactMarkdown>
          </MarkdownContent>
        </MessageBubble>
        <Timestamp>{formattedTime}</Timestamp>
      </MessageContent>
    </MessageContainer>
  );
};

export default ChatMessage;
