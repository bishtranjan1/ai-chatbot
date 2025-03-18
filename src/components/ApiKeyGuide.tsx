import React from "react";
import styled from "styled-components";

const GuideContainer = styled.div`
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: #0084ff;
  margin-bottom: 16px;
`;

const StepTitle = styled.h3`
  margin-top: 16px;
  margin-bottom: 8px;
  color: #333;
`;

const StepContent = styled.p`
  margin-bottom: 12px;
  line-height: 1.5;
`;

const CodeBlock = styled.pre`
  background-color: #f1f1f1;
  padding: 12px;
  border-radius: 4px;
  overflow-x: auto;
  font-family: monospace;
  margin: 12px 0;
`;

const Link = styled.a`
  color: #0084ff;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const ApiKeyGuide: React.FC = () => {
  return (
    <GuideContainer>
      <Title>How to Get and Use a Google Gemini API Key</Title>

      <StepTitle>Step 1: Get a Google Gemini API Key</StepTitle>
      <StepContent>
        Visit the{" "}
        <Link
          href="https://makersuite.google.com/app/apikey"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google AI Studio
        </Link>{" "}
        and sign in with your Google account.
      </StepContent>

      <StepTitle>Step 2: Create a New API Key</StepTitle>
      <StepContent>
        Once signed in, click on "Get API key" or "Create API key" button. Give
        your key a name related to this project, like "ChatbotApp".
      </StepContent>

      <StepTitle>Step 3: Copy Your API Key</StepTitle>
      <StepContent>
        After creating the key, copy it to your clipboard. Keep this key secure
        and don't share it publicly.
      </StepContent>

      <StepTitle>Step 4: Add the API Key to This Application</StepTitle>
      <StepContent>
        Open the file <code>src/services/geminiService.ts</code> in your code
        editor and replace:
      </StepContent>
      <CodeBlock>{`const API_KEY = "YOUR_GEMINI_API_KEY";`}</CodeBlock>
      <StepContent>With your actual API key:</StepContent>
      <CodeBlock>{`const API_KEY = "your-actual-api-key-here";`}</CodeBlock>

      <StepTitle>Step 5: Restart the Application</StepTitle>
      <StepContent>
        If the application is already running, you may need to restart it for
        the changes to take effect.
      </StepContent>

      <StepContent>
        After completing these steps, you should be able to chat with the Gemini
        AI without seeing the error message.
      </StepContent>
    </GuideContainer>
  );
};

export default ApiKeyGuide;
