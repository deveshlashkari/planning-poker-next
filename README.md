# Planning Poker

A real-time planning poker app for agile teams. Create a session, share the link, and let your team vote using Fibonacci cards — no sign-up required.

Built with **Next.js 16**, **Firebase Firestore**, **Framer Motion**, and **Tailwind CSS v4**.

---

## Features

- **Instant sessions** — create a room in one click and share the link
- **Real-time sync** — votes and reveals update live for everyone via Firestore `onSnapshot`
- **No accounts** — players join by name only
- **Host controls** — reveal cards, start a new round, or close the session
- **Light & dark mode** — toggleable, persisted to `localStorage`
- **Fully responsive** — works on desktop, tablet, and mobile
- **Animated UI** — star field background, card flip animations, spring-based interactions

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Database | Firebase Firestore |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Particles | tsparticles |
| Icons | Lucide React |
| Deployment | Vercel |

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/planning-poker-next.git
cd planning-poker-next
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example file and fill in your Firebase credentials:

```bash
cp .env.example .env.local
```

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_FIREBASE_*` | Firebase Console → Project Settings → General → Your apps |
| `FIREBASE_PROJECT_ID` | Firebase Console → Project Settings → General |
| `FIREBASE_CLIENT_EMAIL` | Firebase Console → Project Settings → Service accounts → Generate new private key |
| `FIREBASE_PRIVATE_KEY` | Same JSON file as above |

### 4. Set up Firestore security rules

In **Firebase Console → Firestore → Rules**, paste:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /sessions/{sessionId} {
      allow read: if true;   // client SDK needs read access for real-time updates
      allow write: if false; // all writes go through server-side API routes (Admin SDK)
    }
  }
}
```

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deployment on Vercel

1. Push the repo to GitHub
2. Import it at [vercel.com/new](https://vercel.com/new)
3. Add all environment variables from `.env.example` in **Vercel → Project → Settings → Environment Variables**

> **Important for `FIREBASE_PRIVATE_KEY`**: Paste the key with **real newlines**, not `\n` literals. Copy the value from the downloaded JSON file directly — Vercel preserves line breaks in the dashboard.

The share link uses `window.location.origin` so it automatically resolves to your Vercel domain after deployment.

---

## Project Structure

```
app/
├── api/
│   └── sessions/          # REST API routes (create, join, vote, reveal, reset, delete)
│       ├── route.ts        # POST /api/sessions
│       └── [id]/
│           ├── route.ts    # GET, DELETE /api/sessions/:id
│           ├── join/       # POST /api/sessions/:id/join
│           ├── vote/       # POST /api/sessions/:id/vote
│           └── control/    # POST /api/sessions/:id/control (reveal / reset)
├── session/[id]/
│   └── page.tsx            # Session room (join screen + voting room)
├── page.tsx                # Home / create session
├── layout.tsx              # Root layout with theme toggle
└── globals.css             # Tailwind base + dark mode variant

components/
├── deck.tsx                # Fibonacci card row
├── player-grid.tsx         # Player cards arranged around the table
├── session-actions.tsx     # Host controls (reveal, new round, close)
├── star-background.tsx     # Animated star/particle background (dark mode only)
├── theme-toggle.tsx        # Light / dark mode button
└── ui/                     # Shared primitives (Button, Input, Badge, Card)

hooks/
├── useIdentity.ts          # Persists player identity in localStorage
├── useSession.ts           # Real-time Firestore subscription
└── useTheme.ts             # Theme toggle with localStorage persistence

lib/
├── firebase.ts             # Client-side Firebase SDK init
└── firebase-admin.ts       # Server-side Firebase Admin SDK init

services/
└── sessions.ts             # Client-side fetch wrappers for all API routes
```

---

## License

MIT
