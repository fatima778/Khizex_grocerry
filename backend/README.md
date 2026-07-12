# Khizex Grocery — Backend

Express + TypeScript + MongoDB backend for the Khizex Grocery assignment.

## Setup

```bash
npm install
```

Create `.env` (see `.env.example`) with your MongoDB URI and JWT secrets.

## Seeding real data (real-world pattern — no manual DB editing needed)

Add to your `.env`:
```
ADMIN_NAME=Store Admin
ADMIN_EMAIL=admin@khizex.com
ADMIN_PASSWORD=Admin@12345
```

Then run once:
```bash
npm run seed:admin
npm run seed:products
```

This creates/promotes your admin account and seeds 30 real products across 5 categories.
Safe to re-run — it skips products/admins that already exist.

## Run

```bash
npm run dev
```
