# Relay — Reliable Webhook Delivery System

A production-style webhook relay: source systems send events once, Relay
guarantees every subscribed endpoint eventually receives them — with
HMAC-signed payloads, automatic retries with exponential backoff, a
dead-letter queue for exhausted deliveries, and a live dashboard that
shows delivery status update in real time.

Think of it as a small, self-hosted version of what Svix, Hookdeck, or
Stripe's internal webhook infrastructure does.

**Live demo:** `https://webhookrelay-frontend.vercel.app`
**API:** `https://webhookrelay-vykx.onrender.com/api/v1`

---

## What problem this solves

When System A needs to tell System B "something happened," the naive
approach — `fetch(subscriberUrl, { method: 'POST', body: event })` — fails
silently the moment B's server is slow, deploying, or down. That lost
event is often unrecoverable and undetectable.

Relay sits in between: A sends the event to Relay once, and Relay takes
responsibility for getting it to every subscriber, retrying with backoff
if they're unreachable, and giving both sides full visibility into what
happened and why.

---

## Architecture

```
Source System                Relay                      Subscriber
     │                         │                              │
     │   POST /events          │                              │
     ├────────────────────────►│                              │
     │   202 Accepted           │                              │
     │◄────────────────────────┤                              │
     │                         │ 1. persist event               │
     │                         │ 2. find matching subscribers   │
     │                         │ 3. create delivery attempt(s)  │
     │                         │ 4. enqueue job(s) in Redis      │
     │                         │                              │
     │                         │  worker picks up job          │
     │                         │  signs payload (HMAC)         │
     │                         ├─────────────────────────────►│
     │                         │  2xx / timeout / error        │
     │                         │◄─────────────────────────────┤
     │                         │ update delivery status        │
     │                         │ push live update (Socket.IO)  │
     │                         │ retry w/ backoff if failed     │
```

**Backend** — Node.js / Express, layered architecture (middleware →
routes → controllers → services), Prisma + PostgreSQL for durable
storage, Redis + BullMQ for the delivery queue, Socket.IO for live
status push.

**Frontend** — Next.js (App Router), a `useReducer`-based store for
state management, Tailwind for styling.

**Deployment** — Render (API + merged worker process, PostgreSQL,
Redis), Vercel (frontend).

---

## Core features

- **HMAC-SHA256 signed deliveries** — every payload carries an
  `X-Webhook-Signature` header the receiver can verify, proving the
  request genuinely came from Relay and wasn't tampered with
- **Exponential backoff retries** — 8 attempts, doubling delay, before
  a delivery is marked dead
- **Dead-letter tracking** — exhausted deliveries are visible and
  inspectable, not silently dropped
- **Live dashboard** — delivery status (`QUEUED` → `RETRYING` →
  `DELIVERED`/`DEAD`) updates in the browser without a refresh, via
  Socket.IO
- **Encrypted secrets at rest** — subscriber signing secrets are
  AES-256-GCM encrypted in the database, decrypted only at delivery time
- **Multi-tenant** — each user's subscribers and event history are
  fully isolated
- **Built-in test sandbox** — `/test` page spins up a real public
  receiving endpoint, registers it, fires a real event, and shows the
  delivery live, without touching a terminal

---

## Tech stack

| Layer | Choice |
|---|---|
| API framework | Express |
| Database | PostgreSQL + Prisma ORM |
| Queue | Redis + BullMQ |
| Real-time | Socket.IO |
| Auth | JWT (dashboard), HMAC (webhook delivery) |
| Validation | Zod |
| Frontend | Next.js (App Router), Tailwind |
| Hosting | Render (backend), Vercel (frontend) |

---

## Project structure

```
backend/
  src/
    api/            routes, controllers, middlewares, validators
    services/       business logic (auth, subscriber, event, delivery)
    queue/           BullMQ connection, producer, worker
    db/              Prisma client + schema
    sockets/         Socket.IO setup
    utils/           HMAC signing, AES encryption, response helpers
    errors/          typed error classes
    config/          env validation, logger
  server.js          API entrypoint (also runs the delivery worker — see below)
  worker.js          standalone worker entrypoint (for split-process deployments)

frontend/
  app/               Next.js pages (dashboard, subscribers, events, test, help)
  components/        shared UI
  store/              useReducer-based state (actions, reducer, context)
  lib/                API client functions
  hooks/              Socket.IO hook
```

---

## Setup

### Backend
```bash
cd backend
npm install
cp .env.example .env   # fill in DATABASE_URL, REDIS_URL, JWT_SECRET, ENCRYPTION_KEY
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

### Frontend
```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

---

## API reference (summary)

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/api/v1/auth/register` | — | Create an account |
| POST | `/api/v1/auth/login` | — | Get a JWT |
| GET | `/api/v1/auth/me` | JWT | Validate current session |
| GET/POST | `/api/v1/subscribers` | JWT | List / register subscribers |
| PATCH/DELETE | `/api/v1/subscribers/:id` | JWT | Update / remove a subscriber |
| POST | `/api/v1/subscribers/:id/regenerate-secret` | JWT | Rotate signing secret |
| POST | `/api/v1/events` | — (rate-limited) | Ingest an event — the public entrypoint |
| GET | `/api/v1/events` | JWT | View event history |
| GET | `/api/v1/health/ready` | — | Checks DB + Redis connectivity |

Full request/response examples are in the app's `/help` page.

---

## A known trade-off, stated deliberately

The backend runs as a **single Render Web Service**, with the BullMQ
delivery worker booted inside the same process as the API
(`server.js`), rather than as a separate process. This was a deliberate
choice to fit Render's free tier, which doesn't include Background
Worker services.

The codebase still supports running them separately —
`worker.js` is a standalone entrypoint — and that's what a real
production deployment with budget for it should do, to avoid a slow
delivery competing with the event loop for incoming API requests.