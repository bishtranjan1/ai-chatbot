import { addons } from "@storybook/manager-api";
import { create } from "@storybook/theming/create";

// Create a custom theme that matches Ranjan-AI's branding
const ranjanAITheme = create({
  base: "light",

  // UI
  appBg: "#F8F8F8",
  appContentBg: "#FFFFFF",
  appBorderColor: "rgba(0, 0, 0, 0.1)",
  appBorderRadius: 8,

  // Typography
  fontBase:
    'SF Pro Display, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontCode: "SF Mono, monospace",

  // Text colors
  textColor: "#333333",
  textInverseColor: "#FFFFFF",

  // Toolbar default and active colors
  barTextColor: "#555555",
  barSelectedColor: "#0084FF",
  barBg: "#FFFFFF",

  // Form colors
  inputBg: "#FFFFFF",
  inputBorder: "rgba(0, 0, 0, 0.1)",
  inputTextColor: "#333333",
  inputBorderRadius: 16,

  // Brand
  brandTitle: "Ranjan-AI Components",
  brandUrl: "https://chatbotai-40d8b.web.app",
  brandTarget: "_blank",
  brandImage: "/logo.svg",
});

// Apply the theme
addons.setConfig({
  theme: ranjanAITheme,
  sidebar: {
    showRoots: true,
  },
});
