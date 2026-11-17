# CHI Program — Ask CHI Chatbot Prototype

A responsive React/TypeScript prototype for testing an embedded, site-aware CHI program chatbot. The surrounding Program, Map, People, and My sections provide the lofi site context; Ask CHI is the primary test surface.

All conference data is fictional and exists only for prototype evaluation.

## What the chatbot can answer

- Session times, dates, rooms, topics, papers, abstracts, and authors.
- Cross-site questions that connect Program, Map, People, and My.
- Suggestions grounded in the visitor's selected interests, planned sessions, and saved papers.
- Room access and sensory conditions available in the prototype data.
- Clickable source cards that navigate back to the exact page used in an answer.

The browser sends only public prototype context and recent chat turns to the local `/api/chat` endpoint. The API key stays on the server. If the endpoint is not configured or temporarily fails, the UI clearly switches to **Demo mode** and uses a small deterministic fallback so the prototype remains testable.

## Run locally

```bash
npm install
npm run dev
```

To use the real AI path, copy `.env.example` to `.env.local` and add a valid server-side key:

```bash
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-4.1-mini
npm run dev
```

Open the local URL printed by Vite. For a production check, run:

```bash
npm run build
npm run preview
```

> Do not use an editor's direct HTML/file preview for `index.html`. The entry file imports TypeScript/React source and must be served by Vite; a direct `file://` preview cannot compile `.tsx` modules.

## AI integration

`vite.config.ts` registers the prototype `/api/chat` server route for both `npm run dev` and `npm run preview`. It calls OpenAI's Responses API with Structured Outputs and returns:

```json
{
  "answer": "...",
  "references": [{ "kind": "session", "id": "ai-shared-control" }],
  "mode": "live",
  "model": "gpt-4.1-mini"
}
```

For the real CHI website, keep the React `Chatbot` component and `buildChatKnowledge()` adapter, and move the same `/api/chat` handler into the site's existing server or serverless runtime. Do not expose `OPENAI_API_KEY` through a `VITE_` environment variable.

## Prototype test flow

1. Ask one of the four suggested questions or type a new one.
2. Confirm the status changes from **Live AI** to **Demo mode** if the server call fails.
3. Open a colored source card and verify that it navigates to the referenced Session, Map, People, Program, or My page.
4. Change Interests and ask for recommendations again; the next request uses the updated visitor context.
5. Test the floating panel on desktop and the full-screen assistant on mobile.

## Project structure

```text
src/
  components/       UI and interaction components
    Chatbot.tsx      embedded assistant UI and local fallback
  data/             fictional session data and interest options
  lib/chatKnowledge.ts  site-data adapter passed to the AI proxy
  lib/relevance.ts  transparent keyword matching logic
  App.tsx            view state, history, and scroll restoration
  styles.css         responsive visual system
  types.ts           shared TypeScript data structures
```

The mock dataset is isolated in `src/data/sessions.ts` so it can later be replaced with real program data.
