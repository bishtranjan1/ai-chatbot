import React from "react";
import { StoryFn } from "@storybook/react";
import { createGlobalStyle } from "styled-components";

// Global styles to match the app's styling
const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  body {
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #000000;
  }
  
  code {
    font-family: "SF Mono", Menlo, Monaco, Consolas, "Courier New", monospace;
  }
`;

// Decorator to add global styles to all stories
export const withGlobalStyles = (Story: StoryFn) => (
  <>
    <GlobalStyle />
    <Story />
  </>
);
