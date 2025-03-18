import React from "react";
import { createGlobalStyle } from "styled-components";
import Chat from "./components/Chat";

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    letter-spacing: -0.01em;
  }

  html, body, #root {
    height: 100%;
    width: 100%;
    overflow: hidden;
  }

  body {
    background-color: #f2f2f7; /* iOS background color */
  }

  /* iOS-style text selection */
  ::selection {
    background-color: rgba(0, 132, 255, 0.2);
  }
`;

function App() {
  return (
    <>
      <GlobalStyle />
      <Chat />
    </>
  );
}

export default App;
