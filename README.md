# Outskyz

**Premium adventure travel — cinematic journeys to the world's wildest horizons.**

Outskyz is a premium adventure travel company. This repository contains the production Next.js application powering the Outskyz website.

## Tech Stack

| Layer              | Technology                              |
| ------------------ | --------------------------------------- |
| Framework          | Next.js 16 (App Router)                 |
| Language           | TypeScript 5                            |
| Styling            | Tailwind CSS v4                         |
| Fonts              | Playfair Display + Inter (next/font)    |
| Animation          | Framer Motion                           |
| Icons              | Lucide React                            |
| Validation         | Zod + React Hook Form                   |
| Backend            | Supabase (PostgreSQL + Auth + Storage)  |
| Payments           | Razorpay                                |
| Linting            | ESLint 9                                |
| Formatting         | Prettier                                |
| Deployment         | Vercel                                  |

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/outskyz.git
cd outskyz

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
```

Fill in the required values in `.env.local`:

| Variable                        | Required | Description                        |
| ------------------------------- | -------- | ---------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Yes      | Supabase project URL               |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes      | Supabase anonymous key (public)    |
| `SUPABASE_SERVICE_ROLE_KEY`     | Dev      | Supabase service role key (secret) |
| `RAZORPAY_KEY_ID`               | Prod     | Razorpay API key ID                |
| `RAZORPAY_KEY_SECRET`           | Prod     | Razorpay API secret                |

### Development

```bash
# Start the development server
npm run dev

# Open http://localhost:3000
```

### Production Build

```bash
# Create a production build
npm run build

# Start the production server
npm start
```

### Linting & Formatting

```bash
# Lint all files
npm run lint

# Format all files
npx prettier --write .
```

## Project Structure

```
src/
├── app/            # App Router: pages, layouts, error boundaries
├── components/     # Shared UI components
├── config/         # Site configuration & resource paths
├── hooks/          # Custom React hooks
├── lib/            # Third-party client setups (Supabase, etc.)
├── services/       # Domain service layer
├── styles/         # Global CSS & design tokens
├── types/          # TypeScript type definitions
└── utils/          # Utility functions

public/
├── resources/      # Static assets (images, etc.)
└── ...
```

## Architecture Decisions

- **Supabase clients are lazy-loaded** — never crash at import time when env vars are missing.
- **Service layer** keeps all data access isolated from UI components.
- **Resource paths are centralized** in `src/config/resources.ts` — never hardcode image paths.
- **Dark mode only** — the brand is built around a dark, cinematic aesthetic. No light-mode toggle.
- **Fonts are self-hosted** via `next/font` — zero external network requests for typography.

## Deployment

This project is designed for seamless deployment on [Vercel](https://vercel.com).

1. Push your repository to GitHub.
2. Import the project into Vercel.
3. Add the required environment variables in the Vercel dashboard.
4. Deploy.

## License

Private — All rights reserved.