import type { Meta, StoryObj } from "@storybook/react";
import ChatMessage from "../components/ChatMessage";

const meta = {
  title: "App/ChatMessage",
  component: ChatMessage,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ChatMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

// Common timestamp for all stories
const timestamp = new Date();

export const UserMessage: Story = {
  args: {
    message: {
      id: "1",
      text: "Hello! How can you help me today?",
      sender: "user",
      timestamp,
    },
    isFirstBotMessage: false,
  },
};

export const BotMessage: Story = {
  args: {
    message: {
      id: "2",
      text: "Hi there! I'm Ranjan-AI. I can help you with information, answer questions, or just chat. What would you like to talk about today?",
      sender: "bot",
      timestamp,
    },
    isFirstBotMessage: false,
  },
};

export const FirstBotMessage: Story = {
  args: {
    message: {
      id: "2",
      text: "Hi there! I'm Ranjan-AI. I can help you with information, answer questions, or just chat. What would you like to talk about today?",
      sender: "bot",
      timestamp,
    },
    isFirstBotMessage: true,
  },
};

export const MarkdownBotMessage: Story = {
  args: {
    message: {
      id: "3",
      text: '# Markdown Support\n\nI can format text with **bold**, *italic*, and `code`.\n\n```javascript\nconst greeting = "Hello, world!";\nconsole.log(greeting);\n```\n\n- List item 1\n- List item 2\n- List item 3',
      sender: "bot",
      timestamp,
    },
    isFirstBotMessage: false,
  },
};

export const LongBotMessage: Story = {
  args: {
    message: {
      id: "4",
      text: "This is a much longer message that demonstrates how the chat bubbles handle longer content. The bubbles should expand to fit the content while maintaining readability. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.",
      sender: "bot",
      timestamp,
    },
    isFirstBotMessage: false,
  },
};

export const HinglishMessage: Story = {
  args: {
    message: {
      id: "5",
      text: "Aap kaise hain? Mujhe bahut khushi hui aapse baat karke. Main aapki kya help kar sakta hoon?",
      sender: "bot",
      timestamp,
    },
    isFirstBotMessage: false,
  },
};
