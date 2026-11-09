# CHI Program — Session-First Discovery Prototype

A responsive React/TypeScript prototype for comparing three ways of previewing conference sessions before attendees open them: individual contents, topic summaries, and transparent interest matching.

All conference data is fictional and exists only for prototype evaluation.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. For a production check, run:

```bash
npm run build
npm run preview
```

> Do not use an editor's direct HTML/file preview for `index.html`. The entry file imports TypeScript/React source and must be served by Vite; a direct `file://` preview cannot compile `.tsx` modules.

## Test the three presentation modes

1. Use the Monday, Tuesday, and Wednesday tabs to switch days.
2. Switch **Contents**, **Topics**, and **For You** above the session gallery. Sessions remain in the same chronological order.
3. Open **Edit interests**, change several selections, and close the panel. The **For You** explanations update immediately through deterministic keyword matching.
4. Open any session card. Expand individual content abstracts, then use **Back to Program** (or the browser back button) to return to the preserved date, mode, interests, and scroll position.
5. Resize to desktop, tablet, and mobile widths. The gallery moves from three columns to two and then one; date navigation becomes horizontally scrollable on mobile.

## Project structure

```text
src/
  components/       UI and interaction components
  data/             fictional session data and interest options
  lib/relevance.ts  transparent keyword matching logic
  App.tsx            view state, history, and scroll restoration
  styles.css         responsive visual system
  types.ts           shared TypeScript data structures
```

The mock dataset is isolated in `src/data/sessions.ts` so it can later be replaced with real program data.
