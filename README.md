# Luma Chat

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/myschoolstory/luma-chat)

A production-ready fullstack chat application built on Cloudflare Workers and Pages. Features a modern React frontend with shadcn/ui, TailwindCSS, and a Hono-powered backend with Durable Objects for persistent storage.

## Features

- **Fullstack Architecture**: React + Vite frontend served via Cloudflare Pages, Hono API backend on Workers
- **Persistent Storage**: Cloudflare Durable Objects for counters, demo data, and real-time state
- **Modern UI**: shadcn/ui components, TailwindCSS with custom gradients, animations, and dark mode
- **Type-Safe APIs**: Shared TypeScript types between frontend and backend
- **State Management**: Tanstack Query for data fetching, caching, and mutations
- **Developer Experience**: Hot reload, error boundaries, client error reporting, theme toggle
- **Responsive Design**: Mobile-first with sidebar layout, glassmorphism effects
- **Production-Ready**: CORS, logging, health checks, SPA routing

## Tech Stack

- **Frontend**: React 18, Vite, TypeScript, TailwindCSS, shadcn/ui, Lucide React, Tanstack Query, React Router, Sonner (toasts), Framer Motion
- **Backend**: Cloudflare Workers, Hono, Durable Objects
- **Utilities**: clsx, Tailwind Merge, Zod, Immer, Zustand
- **Build Tools**: Bun, Wrangler, Cloudflare Vite Plugin
- **Dev Tools**: ESLint, TypeScript

## Quick Start

```bash
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) (or your configured PORT).

## Installation

1. **Prerequisites**:
   - [Bun](https://bun.sh/) (recommended package manager)
   - [Cloudflare Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)
   - Cloudflare account and Wrangler login (`wrangler login`)

2. **Clone & Install**:
   ```bash
   git clone <your-repo-url>
   cd luma-chat-m85tlcc3jfytkyphfvdz8
   bun install
   ```

3. **Environment Setup** (optional):
   - Copy `.dev.vars` example to `.dev.vars` and configure API keys if needed.
   - Run `bun run cf-typegen` to generate Worker types.

## Development

- **Start Dev Server**:
  ```bash
  bun run dev
  ```
  Frontend: http://localhost:3000  
  API: http://localhost:8787/api/health (Worker proxy)

- **Type Generation**:
  ```bash
  bun run cf-typegen  # Updates worker types
  ```

- **Linting**:
  ```bash
  bun run lint
  ```

- **Build for Production**:
  ```bash
  bun run build
  ```

- **Preview Production Build**:
  ```bash
  bun run preview
  ```

### Project Structure

```
├── src/              # React frontend (Vite)
├── worker/           # Hono API + Durable Objects
├── shared/           # Shared TypeScript types
├── public/           # Static assets
└── wrangler.jsonc    # Cloudflare config
```

### API Endpoints

Extend routes in `worker/userRoutes.ts`. Examples:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/test` | GET | Simple test |
| `/api/demo` | GET/POST | CRUD demo items (Durable Object) |
| `/api/counter` | GET | Get counter value |
| `/api/counter/increment` | POST | Increment counter |
| `/api/client-errors` | POST | Report frontend errors |

Responses: `{ success: boolean, data?: T, error?: string }`

## Deployment

1. **Build Assets**:
   ```bash
   bun run build
   ```

2. **Deploy to Cloudflare**:
   ```bash
   bun run deploy  # Builds + wrangler deploy
   ```
   Or manually:
   ```bash
   bun run build
   wrangler deploy
   ```

3. **One-Click Deploy**:
   [![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/myschoolstory/luma-chat)

4. **Custom Domain** (Wrangler):
   ```bash
   wrangler deploy --var PREFIX:your-custom-value
   ```

5. **Pages Integration**:
   - Dist folder auto-deploys as Pages Functions via `assets` in `wrangler.jsonc`
   - API routes (`/api/*`) handled by Worker first

**Production Config**: Update `wrangler.jsonc` for secrets, custom domains, or additional DO bindings.

## Customization

- **UI Components**: Add/edit in `src/components/ui/` (shadcn CLI: `bunx shadcn-ui@latest add <component>`)
- **Routes**: Frontend (`src/main.tsx`), Backend (`worker/userRoutes.ts`)
- **Theme**: Edit `tailwind.config.js` and `src/index.css`
- **Durable Objects**: Extend `worker/durableObject.ts`
- **Pages**: Replace `src/pages/HomePage.tsx`

## Contributing

1. Fork the repo
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Open PR

## License

MIT License. See [LICENSE](LICENSE) for details.