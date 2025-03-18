import type { Meta, StoryObj } from "@storybook/react";
import ChatInput from "../components/ChatInput";
import { action } from "@storybook/addon-actions";

const meta = {
  title: "App/ChatInput",
  component: ChatInput,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    onSendMessage: { action: "message sent" },
  },
} satisfies Meta<typeof ChatInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onSendMessage: action("message sent"),
    isLoading: false,
  },
};

export const Loading: Story = {
  args: {
    onSendMessage: action("message sent"),
    isLoading: true,
  },
};
