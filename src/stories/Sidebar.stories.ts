import type { Meta, StoryObj } from "@storybook/react";
import Sidebar from "../components/Sidebar";
import { action } from "@storybook/addon-actions";

const meta = {
  title: "App/Sidebar",
  component: Sidebar,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample chat data
const sampleChats = [
  {
    id: "1",
    title: "AI Basics Conversation",
    messages: [],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
  },
  {
    id: "2",
    title: "Project Planning Ideas",
    messages: [],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 10), // 10 hours ago
  },
  {
    id: "3",
    title: "Hinglish Language Practice",
    messages: [],
    createdAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
  },
];

export const Closed: Story = {
  args: {
    isOpen: false,
    chats: sampleChats,
    currentChatId: "2",
    onSelectChat: action("select chat"),
    onNewChat: action("new chat"),
    onDeleteChat: action("delete chat"),
    toggleSidebar: action("toggle sidebar"),
  },
};

export const Open: Story = {
  args: {
    isOpen: true,
    chats: sampleChats,
    currentChatId: "2",
    onSelectChat: action("select chat"),
    onNewChat: action("new chat"),
    onDeleteChat: action("delete chat"),
    toggleSidebar: action("toggle sidebar"),
  },
};

export const Empty: Story = {
  args: {
    isOpen: true,
    chats: [],
    currentChatId: null,
    onSelectChat: action("select chat"),
    onNewChat: action("new chat"),
    onDeleteChat: action("delete chat"),
    toggleSidebar: action("toggle sidebar"),
  },
};
