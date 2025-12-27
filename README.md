# IxoraGPT Frontend

A modern, responsive chat interface built with Next.js for interacting with the Ixora Agentic AI system. This application supports real-time streaming responses, agent workflow visualization, and markdown rendering.

## Features

- **Real-time Streaming**: Utilizes Server-Sent Events (SSE) to display AI responses character-by-character as they are generated.
- **Agentic Workflow Visualization**: Visualizes the internal steps and thoughts of the AI agents (e.g., "Thinking", "Information Retrieval", "Analysis") providing transparency into the reasoning process.
- **Rich Text Support**: Renders responses using Markdown, supporting code blocks, lists, and formatting.
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS.
- **Session Management**: Automatically generates session IDs for conversation tracking.

## Technology Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Markdown Rendering**: `react-markdown` and `remark-gfm`
- **Utilities**: `clsx`, `tailwind-merge`

## Getting Started

### Prerequisites

- Node.js 18.17.0 or later
- npm, pnpm, or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd ixora-chatbot-front-end
    ```

2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    # or
    bun install
    ```

3.  Configure Environment Variables:

    Create a `.env.local` file in the root directory and add the following variable:

    ```env
    NEXT_PUBLIC_API_BASE_URL=http://your-api-url:8000
    ```

    *If not specified, it defaults to `http://localhost:8000`.*

4.  Run the development server:
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    # or
    bun dev
    ```

5.  Open [http://localhost:3005](http://localhost:3005) with your browser to see the result.

## Project Structure

- `src/app`: Next.js App Router pages and layouts.
- `src/components`: Reusable UI components (Sidebar, MessageList, ChatInput, etc.).
- `src/lib`: Utility functions and API client (`api.ts`).
- `CONTEXT`: Documentation regarding the backend API.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
