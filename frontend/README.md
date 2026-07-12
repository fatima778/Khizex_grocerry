# Khizex Grocery — Frontend

React + TypeScript + Vite storefront and admin dashboard for the Khizex Grocery assignment.

## New packages used in this build

If you're merging this into your existing project, install these on top of what you already have:

```bash
npm install react-router-dom axios zustand socket.io-client framer-motion lucide-react
npm install @react-three/fiber @react-three/drei three
npm install -D @types/three
npm install tailwindcss @tailwindcss/vite
```

## Environment variables

Create a `.env` file (see `.env.example`):

```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## Run

```bash
npm install
npm run dev
```

## What's inside

- `src/pages/Home.tsx` — storefront landing: animated hero carousel with a 3D
  floating produce basket (React Three Fiber), infinite category marquee,
  category grid, live product grid.
- `src/pages/ProductDetail.tsx` — product page with a mouse-tilt 3D card effect.
- `src/pages/Cart.tsx`, `Checkout.tsx` — cart and test-mode checkout, calm/animation-free
  per the assignment's own guidance that critical flows stay fast and distraction-free.
- `src/pages/Login.tsx`, `Signup.tsx` — split-screen auth screens sharing the brand's
  visual language.
- `src/pages/Orders.tsx` — customer order history and status tracking.
- `src/pages/admin/` — admin dashboard (live Socket.IO feed for orders/stock/low-stock
  alerts), product CRUD, and order status management.
- `src/pages/NotFound.tsx` — custom 404.
- `src/components/ProduceScene3D.tsx` — the 3D component (2nd 3D touchpoint is the
  tilt-card on product detail). Falls back to a static emoji graphic if WebGL fails.
- All animations respect `prefers-reduced-motion` (see `src/index.css`).

## Design system

- Colors, fonts and animation utilities are defined as Tailwind v4 theme tokens in
  `src/index.css` (`@theme { ... }`) — no separate `tailwind.config.js` needed in v4.
- Palette: sage field background, deep forest green, leaf green, coral, mustard.
- Fonts: Fraunces (display/serif) + Plus Jakarta Sans (body), loaded in `index.html`.
