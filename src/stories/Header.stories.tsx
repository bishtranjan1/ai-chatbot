import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import styled from "styled-components";

// Header components extracted from Chat.tsx
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
    height: 48px;
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
    margin-left: 36px;
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
    display: none;
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

// ToggleContainer component from LanguageToggle.stories.tsx
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

// Combined Header component for Storybook
interface AppHeaderProps {
  isHinglishMode: boolean;
  toggleHinglishMode: () => void;
  toggleSidebar: () => void;
  hasMessages: boolean;
  onSaveChat: () => void;
  isSaving: boolean;
  showDownloadLink: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  isHinglishMode,
  toggleHinglishMode,
  toggleSidebar,
  hasMessages,
  onSaveChat,
  isSaving,
  showDownloadLink,
}) => {
  const isMobile = window.innerWidth <= 768;

  return (
    <Header>
      <MenuButton onClick={toggleSidebar}>☰</MenuButton>
      <AppIcon>
        <img src={`/logo.svg`} alt="Ranjan-AI Logo" width="32" height="32" />
      </AppIcon>
      <AppTitle>Ranjan-AI</AppTitle>

      <HeaderRightControls>
        {showDownloadLink && (
          <DownloadLink href="#" target="_blank">
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
        )}
        <ToggleContainer>
          <ToggleLabel>{isHinglishMode ? "Hinglish" : "English"}</ToggleLabel>
          <ToggleSwitch active={isHinglishMode} onClick={toggleHinglishMode} />
        </ToggleContainer>

        {hasMessages && (
          <SaveButton onClick={onSaveChat} disabled={isSaving}>
            {isSaving ? "..." : isMobile ? "Save" : "Save Chat"}
          </SaveButton>
        )}
      </HeaderRightControls>
    </Header>
  );
};

const meta = {
  title: "App/Header",
  component: AppHeader,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    toggleHinglishMode: { action: "toggle language" },
    toggleSidebar: { action: "toggle sidebar" },
    onSaveChat: { action: "save chat" },
  },
} satisfies Meta<typeof AppHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

// Custom renderer function
const HeaderWithState = ({
  isHinglishMode: initialIsHinglishMode,
  isSaving: initialIsSaving,
  ...args
}: AppHeaderProps) => {
  const [isHinglishMode, setIsHinglishMode] = useState(initialIsHinglishMode);
  const [isSaving, setIsSaving] = useState(initialIsSaving);

  const handleToggleHinglishMode = () => {
    setIsHinglishMode(!isHinglishMode);
  };

  const handleSaveChat = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  };

  return (
    <AppHeader
      {...args}
      isHinglishMode={isHinglishMode}
      isSaving={isSaving}
      toggleHinglishMode={handleToggleHinglishMode}
      onSaveChat={handleSaveChat}
    />
  );
};

export const Default: Story = {
  render: HeaderWithState,
  args: {
    isHinglishMode: true,
    toggleSidebar: () => {},
    hasMessages: true,
    onSaveChat: () => {},
    isSaving: false,
    showDownloadLink: true,
    toggleHinglishMode: () => {},
  },
};

export const NoMessages: Story = {
  render: HeaderWithState,
  args: {
    isHinglishMode: true,
    toggleSidebar: () => {},
    hasMessages: false,
    onSaveChat: () => {},
    isSaving: false,
    showDownloadLink: true,
    toggleHinglishMode: () => {},
  },
};

export const EnglishMode: Story = {
  render: HeaderWithState,
  args: {
    isHinglishMode: false,
    toggleSidebar: () => {},
    hasMessages: true,
    onSaveChat: () => {},
    isSaving: false,
    showDownloadLink: true,
    toggleHinglishMode: () => {},
  },
};

export const Saving: Story = {
  render: HeaderWithState,
  args: {
    isHinglishMode: true,
    toggleSidebar: () => {},
    hasMessages: true,
    onSaveChat: () => {},
    isSaving: true,
    showDownloadLink: true,
    toggleHinglishMode: () => {},
  },
};

export const WithoutDownloadLink: Story = {
  render: HeaderWithState,
  args: {
    isHinglishMode: true,
    toggleSidebar: () => {},
    hasMessages: true,
    onSaveChat: () => {},
    isSaving: false,
    showDownloadLink: false,
    toggleHinglishMode: () => {},
  },
};
