import type { Meta, StoryObj } from "@storybook/react";
import ChatContainer from "../components/ChatContainer";
import { Message } from "../types";

const meta = {
  title: "App/ChatContainer",
  component: ChatContainer,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ChatContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample conversation
const sampleMessages: Message[] = [
  {
    id: "1",
    text: "Hello! How can you help me today?",
    sender: "user",
    timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
  },
  {
    id: "2",
    text: "Hi there! I'm Ranjan-AI. I can help you with information, answer questions, or just chat. What would you like to talk about today?",
    sender: "bot",
    timestamp: new Date(Date.now() - 1000 * 60 * 9), // 9 minutes ago
  },
  {
    id: "3",
    text: "Can you tell me something about artificial intelligence?",
    sender: "user",
    timestamp: new Date(Date.now() - 1000 * 60 * 8), // 8 minutes ago
  },
  {
    id: "4",
    text: "Artificial Intelligence (AI) refers to computer systems designed to perform tasks that typically require human intelligence. These tasks include learning, reasoning, problem-solving, perception, and language understanding.\n\nHere are some key aspects of AI:\n\n1. **Machine Learning**: Systems that can learn from data rather than through explicit programming\n2. **Natural Language Processing**: Enabling computers to understand and generate human language\n3. **Computer Vision**: Systems that can interpret and make decisions based on visual input\n4. **Robotics**: Physical machines that can perform tasks with some degree of autonomy",
    sender: "bot",
    timestamp: new Date(Date.now() - 1000 * 60 * 7), // 7 minutes ago
  },
  {
    id: "5",
    text: "That's fascinating! How is AI being used today?",
    sender: "user",
    timestamp: new Date(Date.now() - 1000 * 60 * 6), // 6 minutes ago
  },
  {
    id: "6",
    text: "AI is being used in numerous ways across various industries today:\n\n- **Healthcare**: Diagnostic tools, drug discovery, personalized medicine\n- **Finance**: Fraud detection, algorithmic trading, risk assessment\n- **Retail**: Recommendation systems, inventory management, customer service\n- **Transportation**: Self-driving vehicles, traffic optimization, route planning\n- **Entertainment**: Content recommendation, game AI, creative tools\n- **Smart Assistants**: Virtual assistants like Siri, Alexa, and Google Assistant\n\nThe applications continue to expand as technology advances and becomes more accessible!",
    sender: "bot",
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
  },
];

export const EmptyChat: Story = {
  args: {
    messages: [],
    isLoading: false,
  },
};

export const WithMessages: Story = {
  args: {
    messages: sampleMessages,
    isLoading: false,
  },
};

export const Loading: Story = {
  args: {
    messages: sampleMessages,
    isLoading: true,
  },
};
