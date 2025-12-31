# Pastebin Lite

A simple web app where you can paste text and share it with others. Think of it like a digital sticky note that you can send to anyone!

🚀 **Live Demo:** [https://pastebin-lite-delta-ashen.vercel.app/](https://pastebin-lite-delta-ashen.vercel.app/)

## What Does It Do?

**Create & Share Text:**
- Type or paste any text (code, notes, messages, etc.)
- Get a shareable link instantly
- Send the link to anyone to view your text

**Smart Expiry Options:**
- **Time Limit**: Set how long before your paste disappears (e.g., 1 hour, 1 day)
- **View Limit**: Set how many people can view it before it disappears (e.g., only 5 views)
- **Both**: Paste disappears when either limit is reached
- **Neither**: Paste stays forever (until you lose the link)

## Real-World Examples

- **Share code snippets** with colleagues (expires after 1 day)
- **Send passwords** securely (disappears after 1 view)
- **Share meeting notes** with your team (expires after 10 views)
- **Post temporary announcements** (expires after 2 hours)

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Browser   │    │   Next.js App   │    │  Redis Database │
│                 │    │                 │    │                 │
│  - Create Form  │◄──►│  - API Routes   │◄──►│  - Store Pastes │
│  - View Paste   │    │  - HTML Pages   │    │  - Atomic Ops   │
│  - Share Links  │    │  - View Counter │    │  - Persistence  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

**Flow:**
1. **User creates paste** → Form sends data to `/api/pastes`
2. **Server processes** → Validates input, generates ID, stores in Redis
3. **User gets link** → `https://yourapp.com/p/abc123`
4. **Someone visits link** → Server checks constraints, increments views
5. **Content served** → If still available, shows paste; otherwise 404

**Key Components:**
- **Frontend**: Simple React form + paste viewer
- **API Layer**: 4 endpoints (health, create, fetch, view)
- **Database**: Redis with atomic counters and TTL
- **Logic**: Constraint checking (time + view limits)

## How to Run This Project

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the app:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Go to [http://localhost:3000](http://localhost:3000)

4. **Start pasting!**
   - Type your text
   - Optionally set time/view limits
   - Click "Create Paste"
   - Share the generated link

## How It Works Behind the Scenes

**Database:** Uses Redis for fast, reliable storage with atomic operations and persistence

**Smart Features:**
- **Atomic View Counting**: Prevents race conditions when multiple people view simultaneously
- **Deterministic Testing**: Supports special test headers for predictable behavior
- **Serverless Ready**: Works perfectly on platforms like Vercel without memory issues
- **Safe Content**: All text is displayed safely (no script execution risks)

## Tech Stack
- **Frontend**: Next.js with React (simple, clean interface)
- **Backend**: Next.js API routes (handles all the logic)
- **Database**: Redis (fast, atomic operations, persistence)
- **Deployment**: Vercel (serverless, auto-scaling)

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|----------|
| `GET` | `/api/healthz` | Check if app is running |
| `POST` | `/api/pastes` | Create a new paste |
| `GET` | `/api/pastes/:id` | Get paste data (JSON) |
| `GET` | `/p/:id` | View paste (HTML page) |

This isn't just another pastebin - it's built like a production system with proper error handling, security, and scalability in mind!