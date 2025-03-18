# Ranjan-AI Component Documentation

This Storybook contains documentation for all the components used in the Ranjan-AI chat application. Each component is documented with its different states and variations.

## Component Organization

Components are organized by their function:

- **App/** - Main application components like ChatMessage, ChatInput, etc.
- **Example/** - Example components provided by Storybook

## How to Use Storybook

1. **Run Storybook**: Use `npm run storybook` to start the Storybook server
2. **Browse Components**: Use the sidebar to navigate between different components
3. **View Variations**: Each component has multiple stories showing different states
4. **Interactive Controls**: Use the controls panel to modify component props in real-time
5. **View Documentation**: Auto-generated documentation is available for each component

## Components

Here are the main components documented in this Storybook:

### ChatMessage

Shows the different types of messages in the chat interface, including user messages, bot messages, and various formatting options.

### ChatInput

The input field where users type their messages, shown in both normal and loading states.

### ChatContainer

The container that holds the entire chat conversation, showing empty state, messages, and loading indicators.

### Sidebar

The sidebar used for navigating between different saved chats, shown in open, closed, and empty states.

### LanguageToggle

The language toggle switch used to change between English and Hinglish modes.

## Adding New Components

To add a new component to Storybook:

1. Create a new `.stories.ts` or `.stories.tsx` file in the `src/stories` directory
2. Import your component and define its metadata
3. Create multiple stories showing different states of the component
4. Run Storybook to see your new component documentation
