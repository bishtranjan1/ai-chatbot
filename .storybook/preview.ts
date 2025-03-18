import type { Preview } from "@storybook/react";
import { withGlobalStyles } from "./decorators";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "light",
      values: [
        {
          name: "light",
          value: "#ffffff",
        },
        {
          name: "gray",
          value: "#f2f2f7",
        },
        {
          name: "dark",
          value: "#1c1c1e",
        },
      ],
    },
    docs: {
      toc: true,
    },
    options: {
      storySort: {
        order: [
          "Introduction",
          "App",
          [
            "ChatMessage",
            "ChatInput",
            "ChatContainer",
            "Sidebar",
            "LanguageToggle",
          ],
          "Example",
        ],
      },
    },
  },
  decorators: [withGlobalStyles],
};

export default preview;
