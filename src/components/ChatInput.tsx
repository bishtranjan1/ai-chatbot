import React, { useState, KeyboardEvent } from "react";
import styled from "styled-components";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const InputContainer = styled.div`
  display: flex;
  padding: 10px 12px;
  background-color: #f2f2f7;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  position: sticky;
  bottom: 0;
`;

const StyledInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: none;
  border-radius: 20px;
  font-size: 16px;
  outline: none;
  background-color: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  font-weight: 400;
  letter-spacing: -0.01em;
  transition: all 0.2s;

  &:focus {
    box-shadow: 0 1px 4px rgba(0, 132, 255, 0.3);
  }

  &::placeholder {
    color: #8e8e93;
  }
`;

const SendButton = styled.button<{ disabled: boolean }>`
  margin-left: 8px;
  width: 36px;
  height: 36px;
  background-color: ${(props) => (props.disabled ? "#e5e5ea" : "#0A84FF")};
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: background-color 0.2s;
  align-self: center;

  &:hover {
    background-color: ${(props) => (props.disabled ? "#e5e5ea" : "#0077e6")};
  }

  &:active {
    transform: ${(props) => (props.disabled ? "none" : "scale(0.95)")};
  }
`;

// Arrow icon for send button
const SendIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="white" />
  </svg>
);

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <InputContainer>
      <StyledInput
        type="text"
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={isLoading}
      />
      <SendButton
        onClick={handleSendMessage}
        disabled={!message.trim() || isLoading}
        aria-label="Send message"
      >
        {isLoading ? "..." : <SendIcon />}
      </SendButton>
    </InputContainer>
  );
};

export default ChatInput;
