# Jojo Mistral Chat

A chat application using the Mistral API (open-mixtral-8x22b model) with real-time streaming.

## Installation

```bash
npm install
```

## Getting Started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Usage

1. Get a free API key at [console.mistral.ai](https://console.mistral.ai)
2. Enter the key in the interface on first launch
3. The key is saved locally (localStorage)

## Project Structure

```
app/
├── page.tsx              # Mounts the Chat component
├── globals.css           # Styles + custom animations
├── components/
│   └── Chat.tsx          # Complete UI (config + chat)
├── hooks/
│   ├── useChat.ts        # Logic: messages, streaming
│   └── useApiKey.ts      # API key management & validation
└── api/
    ├── chat/
    │   └── route.ts      # Proxy to Mistral (SSE streaming)
    └── validate-key/
        └── route.ts      # API key validation endpoint
```

## Technical Choices

- **Streaming**: Responses displayed progressively (typewriter effect)
- **Client-side API key**: Stored in localStorage, sent with each request
- **SSE Buffer**: Handles incomplete chunks to avoid cutoffs
- **Native Fetch**: No external dependencies for chat functionality
- **Tailwind CSS**: Styling with glassmorphism and gradients

## Design

- Indigo/purple gradients
- Glassmorphism (backdrop-blur)
- Message entry animations
- Animated typing indicator (3 dots)
- Dark mode support

## Intentional Limitations

- Single conversation (no history)
- No server-side authentication
- No conversation persistence
- Messages not formatted (no markdown parsing)
