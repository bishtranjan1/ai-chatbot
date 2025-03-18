import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import styled from "styled-components";

// Copied from Chat.tsx for demonstration
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

interface LanguageToggleProps {
  isActive: boolean;
  onToggle: () => void;
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({
  isActive,
  onToggle,
}) => {
  return (
    <ToggleContainer>
      <ToggleLabel>{isActive ? "Hinglish" : "English"}</ToggleLabel>
      <ToggleSwitch active={isActive} onClick={onToggle} />
    </ToggleContainer>
  );
};

const meta = {
  title: "App/LanguageToggle",
  component: LanguageToggle,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onToggle: { action: "toggle" },
  },
} satisfies Meta<typeof LanguageToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive example
export const Interactive: Story = {
  parameters: {
    docs: {
      description:
        "A toggle with working state that can be clicked to change between English and Hinglish.",
    },
  },
  render: function Render() {
    const [isActive, setIsActive] = useState(true);
    return (
      <LanguageToggle
        isActive={isActive}
        onToggle={() => setIsActive(!isActive)}
      />
    );
  },
  args: {
    isActive: true,
    onToggle: () => {},
  },
};

export const English: Story = {
  args: {
    isActive: false,
    onToggle: () => {},
  },
};

export const Hinglish: Story = {
  args: {
    isActive: true,
    onToggle: () => {},
  },
};
