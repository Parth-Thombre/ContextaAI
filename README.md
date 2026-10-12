# ContextaAI

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/LLMs-OpenAI%20%7C%20Claude%20%7C%20Gemini%20%7C%20Groq-7C3AED?style=for-the-badge" alt="Multi-model AI" />
</p>

<p align="center">
  <strong>ContextaAI</strong> is a context-first AI workspace built for memory, continuity, and multi-model collaboration.
</p>

## Hero section

A premium GitHub hero for the project would look like this:

```md
# ContextaAI
### AI memory workspace for real work, research, and creative thinking.

ContextaAI helps you keep AI conversations organized, searchable, and useful over time.
It combines a clean chat experience with persistent memory, multi-model access, and a workspace designed for continuity.

[Try the app] · [View architecture] · [Read the story]
```

## Product mockup layout

A polished product landing section could include:

```text
┌─────────────────────────────────────────────────────────────────────┐
│ ContextaAI                                                          │
│ [New Chat] [OpenAI] [Claude] [Gemini] [Groq]         Profile      │
├─────────────────────────────────────────────────────────────────────┤
│ Search conversations ...                                            │
│                                                                     │
│ ┌──────────────────┐   ┌──────────────────────────────────────────┐ │
│ │ Projects         │   │ What can I help with?                    │ │
│ │ My Startup       │   │ Code  Strategize  Write  Learn          │ │
│ │ Research         │   │                                         │ │
│ │ Coding Help      │   │ User: Build a launch strategy...         │ │
│ └──────────────────┘   │ Assistant: ...                          │ │
│                         └──────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

This gives the repo the feeling of a real product rather than a prototype.

## Demo / architecture visual ideas

If you want a more premium presentation, add a visual section like this:

```text
AI Workspace Flow

User prompt
    ↓
Model selection (OpenAI / Claude / Gemini / Groq)
    ↓
Context-aware response generation
    ↓
Saved conversation + searchable memory
    ↓
Long-term AI workspace for learning, building, and research
```

Optional: a lightweight GIF or product mockup showing:
- sidebar with conversations
- search bar
- multi-model selector
- response stream in markdown/code format
- conversation persistence and historical recall

## Why this matters

Most AI products are optimized for short-term interaction. ContextaAI is built for the opposite: long-term thinking.

That matters because real work is not one prompt — it is a chain of decisions, iterations, and discoveries. The product is valuable because it gives users a place where AI remembers the thread and helps them keep building on it.

It creates a stronger story for:
- founders building AI workflows
- researchers working across sessions
- developers iterating with multiple model providers
- teams exploring ideas and product strategy

## The product story

Most AI tools feel temporary: a conversation appears, answers are generated, and the context disappears. For serious work, research, product thinking, and learning, that model breaks down fast.

ContextaAI changes that.

It is designed to become the place where your AI conversations become durable, searchable, structured, and useful over time. Instead of treating chat as disposable, ContextaAI turns it into a layered memory system for ideas, exploration, and decision-making.

This is not just another chatbot. It is a personal AI workspace built around continuity, context retention, and model flexibility.

## Why ContextaAI matters

- AI conversations should evolve with you, not vanish after one prompt
- Knowledge should be searchable, not locked inside isolated threads
- Workflows should support multiple model providers without switching tools
- Users should have a clean, focused interface that feels premium and intentional

## Public-facing positioning

> ContextaAI is a context-first AI workspace designed for people who want their conversations to feel continuous, organized, and useful over time. It combines a modern chat experience, searchable historical memory, and multi-model AI access across OpenAI, Claude, Gemini, and Groq into one streamlined workspace built for thinking, building, and learning.

## Core features

- Multi-model AI access across OpenAI, Claude, Gemini, and Groq-backed models
- Persistent conversation memory with Supabase
- Authentication-enabled personal workspace with guest mode
- Searchable conversation history
- Smart automatic title generation from first user prompts
- Markdown rendering and syntax-highlighted code blocks
- Dark, minimal, distraction-free productivity UI
- Built for fast iteration and future extensibility

## Product experience

ContextaAI blends the feel of a powerful AI workspace with the simplicity of a polished chat product:

- Start a new conversation or continue from history
- Pick a model based on task fit
- Ask questions, explore ideas, and build on earlier context
- Search previous sessions to bring past reasoning back into view
- Keep the flow clean and focused without losing the thread

## Tech stack

- Next.js 16
- React 19
- TypeScript
- Supabase for auth and storage
- Groq SDK for model integration
- Tailwind CSS for styling
- Lucide React for UI icons

## Architecture overview

```text
User Interface
    ↓
Next.js App Router
    ├── Auth & session management
    ├── Chat orchestration
    ├── Conversation history persistence
    └── Multi-model API routing
    ↓
Supabase (Auth + Conversations DB)
    ↓
LLM Providers (OpenAI / Claude / Gemini / Groq)
```

## Project structure

```text
.
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/
│   │   │   └── conversations/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── AuthPage.tsx
│   │   ├── ChatArea.tsx
│   │   ├── Sidebar.tsx
│   │   └── TypingIndicator.tsx
│   └── lib/
│       └── supabase.ts
├── public/
├── package.json
├── next.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── .env.example
├── README.md
└── .gitignore
```

## Getting started

### Prerequisites

- Node.js 18+
- npm
- Supabase project
- API keys for at least one LLM provider

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL="your_supabase_project_url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"
SUPABASE_SERVICE_ROLE_KEY="your_supabase_service_role_key"
GROQ_API_KEY="your_groq_api_key"
OPENAI_API_KEY="your_openai_api_key"
ANTHROPIC_API_KEY="your_anthropic_api_key"
GOOGLE_API_KEY="your_google_api_key"
```

A template is also included in [.env.example](/Users/parth/ContextaAI/.env.example).

### 3. Set up the database

This app expects a `conversations` table. Example schema:

```sql
create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  title text not null,
  model text not null,
  messages jsonb not null default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

Optional: configure row-level security policies to match your app’s auth model and guest access rules.

### 4. Run locally

```bash
npm run dev
```

Open the app:

```text
http://localhost:3000
```

## Example use cases

- Research assistant that remembers previous findings
- Product ideation workspace with long-running context
- Developer support environment for debugging and iteration
- Learning assistant that keeps track across sessions
- Writing and brainstorming workspace with model comparison

## Roadmap

- project/workspace grouping
- document upload and memory indexing
- AI-generated summaries and recurring insights
- export and archive chat sessions
- richer personalization and memory controls
- deeper support for model switching and provider abstraction
- agent workflows and task execution

## Why this project is strong

ContextaAI is compelling because it solves a real user problem instead of just packaging a generic chat box. It focuses on continuity, organization, and context retention — the exact gaps that make modern AI tools feel shallow in real work.

That gives the project a strong product story, impressive UX potential, and a naturally scalable roadmap.

## Final launch-ready pitch

> ContextaAI is a modern AI memory workspace for people who want their conversations to continue, compound, and stay useful over time. By combining searchable conversation history, personal workspaces, and multi-model AI access, it turns chat from a temporary interaction into a lasting knowledge layer for work, learning, and creative thinking.

## Notes

This project is a focused MVP with strong product potential and a clean foundation for future growth. It is well suited for public demos, portfolio showcases, experimentation, and early user feedback.
