# lachlon.com

Personal portfolio for Lachlon Felizardo — designer and engineer based in Sydney, AU.

## Stack

- **Vite + React** — frontend
- **React Router** — tab-based navigation (About, Projects, Contact)
- **Framer Motion** — page transitions and project viewer animations
- **Liveblocks** — real-time collaborative drawing on the About page

## Features

- Random ink colour on every page load
- Live drawing canvas on the About page (desktop only) — visitors can draw and see each other's strokes in real time
- Project iframe viewer with open/close animations
- Fully responsive

## Dev

```bash
npm install
npm run dev
```

## Deploy

```bash
npm run build
```

Deploy the `dist/` folder to Vercel. Add your Liveblocks public key to `src/liveblocks.config.js` before deploying.

## Admin

Press **Shift + Alt + C** on the About page to clear all drawings.
