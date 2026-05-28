# Next.js Boilerplate

Personal Next.js starter with authentication, database access, and client data
state already wired together.

## Site

- Production: https://nextjs-boilerplate-ecru-one-96.vercel.app/

## Tech Stack

| Area         | Choice                                    |
| ------------ | ----------------------------------------- |
| Framework    | Next.js 16 App Router                     |
| Language     | TypeScript strict                         |
| Styling      | Tailwind CSS v4 + shadcn/ui               |
| Auth         | Auth.js v5 / NextAuth.js v5, Google OAuth |
| ORM / DB     | Prisma + PostgreSQL                       |
| Client state | TanStack Query v5                         |
| Quality      | ESLint, Prettier, Vitest                  |

## Getting Started

```bash
npm install
cp .env.example .env.local
npm run docker:up
npm run db:push
npm run dev
```

Open http://localhost:3000.

## Environment Variables

Set these values in `.env.local` for local development and in Vercel
Environment Variables for deployment.

| Name                                          | Purpose                                               |
| --------------------------------------------- | ----------------------------------------------------- |
| `DATABASE_URL`                                | PostgreSQL connection string                          |
| `AUTH_SECRET`                                 | Auth.js secret, for example `openssl rand -base64 32` |
| `AUTH_URL` / `NEXTAUTH_URL`                   | App origin, such as `http://localhost:3000`           |
| `GOOGLE_CLIENT_ID` / `AUTH_GOOGLE_ID`         | Google OAuth client ID                                |
| `GOOGLE_CLIENT_SECRET` / `AUTH_GOOGLE_SECRET` | Google OAuth client secret                            |

Google Cloud OAuth redirect URI:

```text
https://YOUR_DOMAIN/api/auth/callback/google
```

For this deployment:

```text
https://nextjs-boilerplate-ecru-one-96.vercel.app/api/auth/callback/google
```

## Login Flow

- `/` is the main screen and is public.
- Signed-out users can start Google login from the main screen or `/login`.
- Google OAuth returns to `/`.
- Signed-in users stay on the main screen with account actions available.
- `/dashboard` exists as a protected example page.

## Scripts

| Command                | Description                       |
| ---------------------- | --------------------------------- |
| `npm run dev`          | Start local development server    |
| `npm run build`        | Build production app              |
| `npm run lint`         | Run ESLint                        |
| `npm run test`         | Run Vitest in watch mode          |
| `npm run test:run`     | Run Vitest once                   |
| `npm run format`       | Format with Prettier              |
| `npm run format:check` | Check formatting                  |
| `npm run docker:up`    | Start local PostgreSQL            |
| `npm run docker:down`  | Stop local PostgreSQL             |
| `npm run db:push`      | Push Prisma schema to DB          |
| `npm run db:studio`    | Open Prisma Studio                |
| `npm run db:migrate`   | Create and apply Prisma migration |

## Project Structure

```text
app/
  (auth)/login/              Google login entry
  (dashboard)/dashboard/     Protected example page
  api/auth/[...nextauth]/    Auth.js route handlers
  layout.tsx                 Root layout and providers
  page.tsx                   Public main screen
components/
  auth/                      Auth-aware UI
  common/                    Shared app components
  ui/                        shadcn/ui components
lib/
  auth.ts                    Node Auth.js config
  auth.edge.ts               Proxy-safe Auth.js config
  auth-env.ts                OAuth environment variable resolution
  db.ts                      Prisma client
  query-client.ts            TanStack Query client factory
server/queries/              Server-only query examples
prisma/schema.prisma         Database schema
proxy.ts                     Next.js 16 request proxy
```
