import React from "react";
import type { Meta } from "@storybook/react";
import styled from "styled-components";

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI",
    Roboto, Helvetica, Arial, sans-serif;
  line-height: 1.6;
  color: #333;
`;

const Title = styled.h1`
  color: #0084ff;
  margin-bottom: 24px;
`;

const Section = styled.section`
  margin-bottom: 32px;
`;

const SectionTitle = styled.h2`
  color: #333;
  margin-bottom: 16px;
  font-weight: 600;
`;

const List = styled.ul`
  margin-left: 24px;
  margin-bottom: 16px;
`;

const ListItem = styled.li`
  margin-bottom: 8px;
`;

const FeatureName = styled.strong`
  color: #0084ff;
`;

const OrderedList = styled.ol`
  margin-left: 24px;
  margin-bottom: 16px;
`;

const Introduction = () => (
  <Container>
    <Title>Ranjan-AI Component Documentation</Title>

    <p>
      Welcome to the Ranjan-AI component documentation. This Storybook contains
      a comprehensive catalog of all the UI components used in the Ranjan-AI
      chat application.
    </p>

    <Section>
      <SectionTitle>About Ranjan-AI</SectionTitle>
      <p>Ranjan-AI is a conversational AI application that features:</p>

      <List>
        <ListItem>
          <FeatureName>English and Hinglish Support:</FeatureName> Engage in
          conversations in both English and Hinglish
        </ListItem>
        <ListItem>
          <FeatureName>Markdown Formatting:</FeatureName> View messages with
          rich formatting including code blocks
        </ListItem>
        <ListItem>
          <FeatureName>Chat History:</FeatureName> Save and manage past
          conversations
        </ListItem>
        <ListItem>
          <FeatureName>Responsive Design:</FeatureName> Works seamlessly on
          desktop and mobile devices
        </ListItem>
        <ListItem>
          <FeatureName>PWA Support:</FeatureName> Can be installed on devices
          for offline access
        </ListItem>
      </List>
    </Section>

    <Section>
      <SectionTitle>Component Library</SectionTitle>
      <p>This Storybook documents the following components:</p>

      <List>
        <ListItem>
          <FeatureName>Chat Messages:</FeatureName> Message bubbles for both
          user and AI responses
        </ListItem>
        <ListItem>
          <FeatureName>Chat Input:</FeatureName> Text input field with send
          button
        </ListItem>
        <ListItem>
          <FeatureName>Chat Container:</FeatureName> Main chat window that
          displays the conversation
        </ListItem>
        <ListItem>
          <FeatureName>Sidebar:</FeatureName> Navigation panel for accessing
          saved chats
        </ListItem>
        <ListItem>
          <FeatureName>Language Toggle:</FeatureName> Switch between English and
          Hinglish modes
        </ListItem>
      </List>
    </Section>

    <Section>
      <SectionTitle>Design Principles</SectionTitle>
      <p>The UI follows these design principles:</p>

      <OrderedList>
        <ListItem>
          <FeatureName>iOS-inspired Design:</FeatureName> Clean, minimalist
          aesthetics with subtle shadows and rounded corners
        </ListItem>
        <ListItem>
          <FeatureName>Responsive Layout:</FeatureName> Adapts to different
          screen sizes and orientations
        </ListItem>
        <ListItem>
          <FeatureName>Intuitive Navigation:</FeatureName> Simple and
          straightforward user experience
        </ListItem>
        <ListItem>
          <FeatureName>Clear Visual Hierarchy:</FeatureName> Important elements
          stand out through size, color, and position
        </ListItem>
        <ListItem>
          <FeatureName>Consistent Styling:</FeatureName> Uniform design language
          throughout the application
        </ListItem>
      </OrderedList>
    </Section>

    <Section>
      <SectionTitle>Getting Started</SectionTitle>
      <p>
        Navigate through the components using the sidebar. Each component has
        multiple stories showing different states and variations.
      </p>
      <p>
        Use the "Docs" tab to view detailed documentation about each component's
        props and usage.
      </p>
    </Section>

    <Section>
      <SectionTitle>Technology Stack</SectionTitle>
      <List>
        <ListItem>React with TypeScript</ListItem>
        <ListItem>Styled Components for styling</ListItem>
        <ListItem>Firebase for hosting</ListItem>
        <ListItem>Gemini AI for conversation intelligence</ListItem>
      </List>
    </Section>
  </Container>
);

const meta = {
  title: "Introduction",
  parameters: {
    layout: "fullscreen",
    previewTabs: {
      canvas: { hidden: true },
    },
  },
} satisfies Meta;

export default meta;

export const Overview = {
  render: () => <Introduction />,
};
