# Khizex Grocery — Full-Stack E-Commerce Platform

A production-style grocery e-commerce platform built for the Khizex Full-Stack Internship assignment — React + TypeScript storefront/admin dashboard, Express + TypeScript API, MongoDB Atlas, real-time Socket.IO sync, and concurrency-safe checkout.

## Live Links
- **Live app:** https://khizex-grocerry-tvbg.vercel.app
- **API:** https://khizex-grocerry.onrender.com
- **Repository:** https://github.com/fatima778/Khizex_grocerry

## Tech Stack
- **Frontend:** React, TypeScript, Vite, Tailwind CSS v4, Framer Motion, React Three Fiber, Zustand, Socket.IO client
- **Backend:** Node.js, Express, TypeScript, MongoDB (Mongoose), Socket.IO, JWT, bcrypt, Zod
- **Database:** MongoDB Atlas (cloud-hosted)

## Project Structure
khizex_grocery/

├── backend/     — Express API, MongoDB models, real-time server, seed scripts

└── frontend/    — React storefront + admin dashboard

## Setup Instructions

### Backend
```bash
cd backend
npm install
```
Create a `.env` file with (see `.env.example` for the full list of required keys):
PORT, MONGO_URI, JWT_SECRET, JWT_REFRESH_SECRET, NODE_ENV, CLIENT_URL,
ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD

Then seed the first admin account and starter product catalog (one-time, real-world pattern — no manual DB editing needed after this):
```bash
npm run seed:admin
npm run seed:products
npm run dev
```

### Frontend
```bash
cd frontend
npm install
```
Create a `.env` file (see `.env.example`):
VITE_API_URL, VITE_SOCKET_URL

```bash
npm run dev
```

## Architecture Overview

**Backend** follows a layered structure: `routes` (thin, just wiring) → `controllers` (request/response handling) → `services` (reusable business logic, e.g. mock payments, Socket.IO emitters) → `models` (Mongoose schemas). All inputs are validated at the API boundary with Zod before touching the database. Authentication uses short-lived JWT access tokens (15 min) plus a long-lived refresh token stored in an `httpOnly`, `secure`, `sameSite: strict` cookie — access tokens are never persisted to `localStorage`.

**Frontend** is a single Vite React app serving both the customer storefront and a role-gated `/admin` dashboard, sharing one design system, auth store, and API layer. Route guards (`ProtectedRoute`, `AdminRoute`) enforce access on the client, while the server independently re-checks role on every admin request — the client-side check is a UX convenience, never the security boundary.

## Concurrency & Stock-Safety

Overselling is prevented using a single atomic MongoDB operation per line item during checkout:

```ts
Product.findOneAndUpdate(
  { _id: productId, stock: { $gte: quantity } },
  { $inc: { stock: -quantity } }
)
```

The stock-check and the decrement happen together, indivisibly, at the database level — there is no "read stock, check it in application code, then write" step, which is the classic race condition under concurrent load. If hundreds of requests hit this for a product with only a few units left, MongoDB serializes the writes internally: only as many requests succeed as there is real stock, and the rest correctly receive a "not enough stock" response — no double-selling is possible.

If a later step in checkout fails (declined payment, or a different item in the same cart is out of stock), all previously decremented items for that request are rolled back (`$inc` with the same quantity, reversed), so a failed order never permanently loses stock.

Idempotency: each order stores a unique `paymentId`. If the same payment confirmation is ever processed twice, the second attempt finds the existing order by that ID and returns it instead of creating a duplicate.

## Connection Pooling

Mongoose is configured with `maxPoolSize: 20, minPoolSize: 5` — sized for a small-to-medium app's expected concurrent load without exhausting MongoDB Atlas's free-tier connection limit, while keeping a few warm connections ready to avoid cold-start latency on every request.

## Real-Time Sync (Socket.IO)

A single Socket.IO server runs alongside the Express API. On every checkout, the server emits:
- `stock:update` — new stock level for the affected product
- `stock:low` — fired when stock crosses the product's configured low-stock threshold
- `order:new` — a full order object, the instant it's placed

The admin dashboard listens for all three and updates its UI with no polling and no manual refresh. Order status changes made by an admin emit `order:status`, which the customer's own "Track Orders" page listens for — so a customer sees their delivery status update live, without reloading. The same real-time layer also powers a two-way support chat: a customer's complaint and any admin reply are pushed instantly to both sides via `complaint:new` / `complaint:reply`.

## Security

- Passwords hashed with bcrypt (10 salt rounds)
- JWT access + refresh token pattern, refresh token in an `httpOnly` cookie
- Every request body validated with Zod before reaching a controller
- All database access goes through Mongoose (parameterized/ODM — no raw string-built queries, no NoSQL injection surface)
- `helmet` for security headers, scoped CORS (not wildcard)
- Rate limiting on `/auth/login`, `/auth/signup`, and `/checkout`
- Every admin-only route re-verifies the requester's role server-side (`requireAdmin` middleware) — the UI never hides an action as its only protection
- No secrets committed — `.env` is git-ignored on both frontend and backend, `.env.example` documents required keys by name only

## Payment Gateway Note

Stripe and PayPal account registration were not available in Pakistan at the time of this build (both require a supported business country). Per the assignment's allowance for "an equivalent sandbox gateway," a self-built mock payment service (`mockPaymentService.ts`) replicates the same test-mode contract: it accepts a card number, simulates a decline for the Stripe-convention test number `4000000000000002`, generates a unique transaction ID, and never stores raw card data. The idempotency and rollback logic around it is identical to what a real Stripe/PayPal integration would require.

## Tradeoffs & What I'd Improve With More Time

- The payment gateway is a self-built sandbox rather than real Stripe/PayPal, due to regional account restrictions — the integration contract (idempotency, decline handling, no raw card storage) mirrors what a real gateway would need, so swapping it in later would mainly mean replacing `mockPaymentService.ts`.
- Product photography is a mix of a curated set of verified real photos and clean vector illustrations as a fallback; the admin dashboard lets any product's image be updated with a real photo URL at any time.
- Automated test coverage is currently light — with more time I'd add unit tests for the atomic stock-decrement path and an integration test for the full checkout flow, since those are the highest-risk paths.
- Reviews/ratings shown on product cards are illustrative placeholders (deterministic per product) rather than real customer reviews, since a full review-submission system was out of scope for the time available.
- Delivery slot scheduling and Google login were treated as explicitly optional per the assignment brief and were not built.
