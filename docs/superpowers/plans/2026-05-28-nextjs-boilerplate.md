# Next.js 보일러플레이트 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 인증, DB, 데이터 페칭이 사전 구성된 개인용 Next.js 15 범용 보일러플레이트를 구축한다.

**Architecture:** Next.js 15 App Router 기반 미니멀 레이어드 구조. `app/`은 라우트, `lib/`은 설정, `server/`는 DB 쿼리, `components/`는 UI를 담당한다. 라우트 그룹 `(auth)` / `(dashboard)`로 인증 여부에 따른 레이아웃을 분리하고, middleware가 보호된 라우트를 제어한다.

**Tech Stack:** Next.js 15, TypeScript strict, Tailwind CSS v4, shadcn/ui, NextAuth.js v5 (Auth.js), Prisma, PostgreSQL, TanStack Query v5, ESLint, Prettier, Vitest

---

## 파일 구조

**생성할 파일:**

```
docker-compose.yml               — PostgreSQL 로컬 컨테이너
.env.example                     — 환경변수 템플릿
.env.local                       — 로컬 개발용 환경변수 (gitignored)
prisma/schema.prisma             — NextAuth 필수 모델 포함 DB 스키마
lib/db.ts                        — Prisma 클라이언트 싱글턴
lib/auth.ts                      — NextAuth v5 설정 (providers, adapter, callbacks)
lib/query-client.ts              — TanStack Query 클라이언트 팩토리
middleware.ts                    — 보호된 라우트 리다이렉트 제어
app/layout.tsx                   — 루트 레이아웃 (Providers 래핑)
app/page.tsx                     — 랜딩 페이지
app/(auth)/login/page.tsx        — 로그인 페이지 (소셜 로그인 버튼)
app/(dashboard)/dashboard/page.tsx — 로그인 필수 대시보드 페이지
app/api/auth/[...nextauth]/route.ts — NextAuth API 핸들러
components/common/providers.tsx  — QueryClientProvider 클라이언트 래퍼
components/common/header.tsx     — 공통 헤더 (로그인 상태에 따른 네비게이션)
server/queries/user.ts           — 유저 DB 쿼리 예시 (서버 전용)
types/index.ts                   — NextAuth Session 타입 확장
vitest.config.ts                 — Vitest 설정
vitest.setup.ts                  — Vitest 전역 설정
__tests__/components/ui/button.test.tsx
__tests__/components/common/providers.test.tsx
```

---

### Task 1: Next.js 프로젝트 초기화

**Files:**

- Create: `package.json`, `tsconfig.json`, `next.config.ts` (create-next-app 자동 생성)

- [ ] **Step 1: Next.js 15 프로젝트 생성**

현재 디렉터리(`C:\dev\agentic_coding\claude\nextjs-boilerplate`)에서 실행한다. `docs/` 폴더가 이미 있으므로 "directory contains files" 경고가 나타나면 `y`로 계속 진행한다.

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*"
```

프롬프트 응답:

- `Would you like to use Turbopack?` → Yes
- `The directory . contains files...` → y

Expected output: `Success! Created Next.js app in ...`

- [ ] **Step 2: TypeScript strict mode 확인**

`tsconfig.json`을 열어 `"strict": true`가 있는지 확인한다. 없으면 `compilerOptions`에 추가:

```json
{
  "compilerOptions": {
    "strict": true,
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: 개발 서버 실행 확인**

```bash
npm run dev
```

Expected: `▲ Next.js 15.x.x` 출력 및 `http://localhost:3000`에서 기본 페이지 렌더링 확인 후 `Ctrl+C`로 서버 중지.

- [ ] **Step 4: git 초기화 및 커밋**

```bash
git init
git add .
git commit -m "chore: initialize Next.js 15 project with TypeScript and Tailwind"
```

---

### Task 2: Prettier + Vitest 설정

**Files:**

- Create: `.prettierrc`
- Create: `.prettierignore`
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Modify: `package.json` (scripts 추가)
- Modify: `eslint.config.mjs` (prettier 추가)

- [ ] **Step 1: Prettier 및 관련 패키지 설치**

```bash
npm install --save-dev prettier eslint-config-prettier
```

- [ ] **Step 2: .prettierrc 생성**

```json
{
  "semi": false,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80
}
```

- [ ] **Step 3: .prettierignore 생성**

```
.next
node_modules
prisma/migrations
```

- [ ] **Step 4: ESLint flat config에 prettier 추가**

`eslint.config.mjs`를 다음 내용으로 교체:

```js
import { FlatCompat } from "@eslint/eslintrc"

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
})

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),
]

export default eslintConfig
```

- [ ] **Step 5: Vitest 및 Testing Library 설치**

```bash
npm install --save-dev vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

- [ ] **Step 6: vitest.config.ts 생성**

```typescript
import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
})
```

- [ ] **Step 7: vitest.setup.ts 생성**

```typescript
import "@testing-library/jest-dom"
```

- [ ] **Step 8: package.json scripts에 추가**

`package.json`의 `"scripts"` 객체에 다음 항목을 추가:

```json
"test": "vitest",
"test:run": "vitest run",
"format": "prettier --write .",
"format:check": "prettier --check ."
```

- [ ] **Step 9: Vitest 동작 확인**

```bash
npm run test:run
```

Expected: `No test files found, exiting with code 0` — 에러 없이 종료

- [ ] **Step 10: 커밋**

```bash
git add .
git commit -m "chore: add Prettier and Vitest configuration"
```

---

### Task 3: shadcn/ui 초기화 및 기본 컴포넌트 설치

**Files:**

- Create: `components/ui/button.tsx` (shadcn 자동 생성)
- Create: `components/ui/card.tsx`
- Create: `components/ui/input.tsx`
- Create: `components/ui/form.tsx`
- Create: `components/ui/label.tsx`
- Create: `__tests__/components/ui/button.test.tsx`
- Modify: `app/globals.css` (shadcn CSS 변수 추가)

- [ ] **Step 1: 테스트 먼저 작성**

`__tests__/components/ui/button.test.tsx` 생성:

```typescript
import { render, screen } from "@testing-library/react"
import { Button } from "@/components/ui/button"

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Click me</Button>)
    expect(
      screen.getByRole("button", { name: "Click me" })
    ).toBeInTheDocument()
  })

  it("applies variant class", () => {
    render(<Button variant="outline">Outline</Button>)
    const btn = screen.getByRole("button", { name: "Outline" })
    expect(btn).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: 테스트 실행 — 실패 확인**

```bash
npm run test:run
```

Expected: FAIL — `Cannot find module '@/components/ui/button'`

- [ ] **Step 3: shadcn/ui 초기화**

```bash
npx shadcn@latest init
```

프롬프트 응답:

- Style: `Default`
- Base color: `Slate`
- CSS variables: `Yes`

- [ ] **Step 4: 기본 컴포넌트 설치**

```bash
npx shadcn@latest add button card input form label
```

Expected: `components/ui/` 아래 `button.tsx`, `card.tsx`, `input.tsx`, `form.tsx`, `label.tsx` 생성

- [ ] **Step 5: 테스트 실행 — 통과 확인**

```bash
npm run test:run
```

Expected: `2 passed`

- [ ] **Step 6: 커밋**

```bash
git add .
git commit -m "feat: add shadcn/ui with base components (button, card, input, form, label)"
```

---

### Task 4: Docker Compose + 환경변수 설정

**Files:**

- Create: `docker-compose.yml`
- Create: `.env.example`
- Create: `.env.local`
- Modify: `package.json` (docker:up 스크립트 추가)

- [ ] **Step 1: docker-compose.yml 생성**

```yaml
services:
  db:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: boilerplate
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

- [ ] **Step 2: .env.example 생성**

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/boilerplate"
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
EMAIL_SERVER=smtp://user:pass@smtp.example.com:587
EMAIL_FROM=noreply@example.com
```

- [ ] **Step 3: .env.local 생성**

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/boilerplate"
NEXTAUTH_SECRET=dev-secret-change-in-production
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=placeholder
GOOGLE_CLIENT_SECRET=placeholder
GITHUB_CLIENT_ID=placeholder
GITHUB_CLIENT_SECRET=placeholder
EMAIL_SERVER=smtp://user:pass@smtp.example.com:587
EMAIL_FROM=noreply@example.com
```

- [ ] **Step 4: .gitignore에 .env.local 포함 여부 확인**

`.gitignore`에 아래 줄이 있는지 확인한다. 없으면 추가:

```
.env.local
.env*.local
```

- [ ] **Step 5: package.json scripts에 docker:up 추가**

`"scripts"` 객체에 추가:

```json
"docker:up": "docker compose up -d",
"docker:down": "docker compose down"
```

- [ ] **Step 6: PostgreSQL 컨테이너 시작**

```bash
npm run docker:up
```

Expected: `Container nextjs-boilerplate-db-1  Started`

- [ ] **Step 7: 컨테이너 상태 확인**

```bash
docker compose ps
```

Expected: `db` 서비스가 `running (healthy)` 또는 `running` 상태

- [ ] **Step 8: 커밋**

```bash
git add docker-compose.yml .env.example package.json .gitignore
git commit -m "chore: add Docker Compose for local PostgreSQL and env templates"
```

---

### Task 5: Prisma 설정

**Files:**

- Create: `prisma/schema.prisma`
- Create: `lib/db.ts`
- Modify: `package.json` (DB 스크립트 + postinstall 추가)

- [ ] **Step 1: Prisma 설치**

```bash
npm install @prisma/client
npm install --save-dev prisma
```

- [ ] **Step 2: Prisma 초기화**

```bash
npx prisma init --datasource-provider postgresql
```

Expected: `prisma/schema.prisma` 및 `.env` 생성

- [ ] **Step 3: .gitignore에 .env 추가**

Prisma CLI는 `.env.local`을 읽지 않고 `.env`를 읽는다. `prisma init`이 생성한 `.env`를 활용하되 커밋되지 않도록 `.gitignore`에 추가한다:

`.gitignore`에 아래 줄 추가:

```
.env
```

그리고 생성된 `.env`의 `DATABASE_URL`을 올바른 값으로 교체한다:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/boilerplate"
```

> 참고: Next.js는 `.env.local`을 `.env`보다 우선해서 로드하므로 런타임에는 `.env.local`의 값이 사용된다. Prisma CLI만 `.env`를 사용한다.

- [ ] **Step 4: prisma/schema.prisma를 NextAuth 스키마로 교체**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Account {
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@id([provider, providerAccountId])
}

model Session {
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model VerificationToken {
  identifier String
  token      String
  expires    DateTime

  @@id([identifier, token])
}
```

- [ ] **Step 5: 스키마 유효성 검사**

```bash
npx prisma validate
```

Expected: `The schema at prisma/schema.prisma is valid 🚀`

- [ ] **Step 6: DB에 스키마 적용**

```bash
npx prisma db push
```

Expected: `Your database is now in sync with your Prisma schema. 🚀`

- [ ] **Step 7: Prisma 클라이언트 생성**

```bash
npx prisma generate
```

Expected: `Generated Prisma Client (v5.x.x)`

- [ ] **Step 8: lib/db.ts 생성**

```typescript
import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query"] : [],
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db
```

- [ ] **Step 9: package.json scripts에 DB 스크립트 추가**

```json
"db:push": "prisma db push",
"db:studio": "prisma studio",
"db:migrate": "prisma migrate dev",
"db:generate": "prisma generate",
"postinstall": "prisma generate"
```

- [ ] **Step 10: TypeScript 타입 체크**

```bash
npx tsc --noEmit
```

Expected: 에러 없음

- [ ] **Step 11: 커밋**

```bash
git add prisma/schema.prisma lib/db.ts package.json
git commit -m "feat: add Prisma with PostgreSQL and NextAuth schema models"
```

---

### Task 6: NextAuth.js v5 설정

**Files:**

- Create: `lib/auth.ts`
- Create: `app/api/auth/[...nextauth]/route.ts`
- Create: `middleware.ts`
- Create: `types/index.ts`
- Create: `app/(auth)/login/page.tsx`

- [ ] **Step 1: NextAuth v5 및 Prisma 어댑터 설치**

```bash
npm install next-auth@beta @auth/prisma-adapter
```

- [ ] **Step 2: types/index.ts 생성 — Session 타입 확장**

```typescript
import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
    } & DefaultSession["user"]
  }
}
```

- [ ] **Step 3: lib/auth.ts 생성**

```typescript
import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import Nodemailer from "next-auth/providers/nodemailer"
import { db } from "@/lib/db"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    Nodemailer({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id
      return session
    },
  },
})
```

- [ ] **Step 4: app/api/auth/[...nextauth]/route.ts 생성**

디렉터리를 먼저 생성한다 (PowerShell에서 대괄호를 와일드카드로 해석하지 않도록 `-LiteralPath` 사용):

```powershell
New-Item -ItemType Directory -Force -LiteralPath "app/api/auth/[...nextauth]"
```

`app/api/auth/[...nextauth]/route.ts` 생성:

```typescript
import { handlers } from "@/lib/auth"

export const { GET, POST } = handlers
```

- [ ] **Step 5: middleware.ts 생성**

```typescript
import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { auth: session, nextUrl } = req

  const isOnDashboard = nextUrl.pathname.startsWith("/dashboard")
  const isOnLogin = nextUrl.pathname.startsWith("/login")

  if (isOnDashboard && !session) {
    return NextResponse.redirect(new URL("/login", nextUrl))
  }

  if (isOnLogin && session) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
```

- [ ] **Step 6: app/(auth)/login/page.tsx 생성**

```typescript
import { signIn } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center text-2xl">로그인</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <form
            action={async () => {
              "use server"
              await signIn("google", { redirectTo: "/dashboard" })
            }}
          >
            <Button type="submit" className="w-full" variant="outline">
              Google로 계속하기
            </Button>
          </form>
          <form
            action={async () => {
              "use server"
              await signIn("github", { redirectTo: "/dashboard" })
            }}
          >
            <Button type="submit" className="w-full" variant="outline">
              GitHub로 계속하기
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
```

- [ ] **Step 7: TypeScript 타입 체크**

```bash
npx tsc --noEmit
```

Expected: 에러 없음

- [ ] **Step 8: 커밋**

```bash
git add lib/auth.ts "app/api/auth" middleware.ts "app/(auth)" types/index.ts
git commit -m "feat: add NextAuth v5 with Google, GitHub, and email magic link"
```

---

### Task 7: TanStack Query v5 설정

**Files:**

- Create: `lib/query-client.ts`
- Create: `components/common/providers.tsx`
- Create: `__tests__/components/common/providers.test.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: TanStack Query 설치**

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

- [ ] **Step 2: 테스트 먼저 작성**

`__tests__/components/common/providers.test.tsx` 생성:

```typescript
import { render, screen } from "@testing-library/react"
import { Providers } from "@/components/common/providers"

describe("Providers", () => {
  it("renders children without error", () => {
    render(
      <Providers>
        <div>test content</div>
      </Providers>
    )
    expect(screen.getByText("test content")).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: 테스트 실행 — 실패 확인**

```bash
npm run test:run
```

Expected: FAIL — `Cannot find module '@/components/common/providers'`

- [ ] **Step 4: lib/query-client.ts 생성**

```typescript
import { QueryClient } from "@tanstack/react-query"

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: 1,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

export function getQueryClient() {
  if (typeof window === "undefined") {
    return makeQueryClient()
  }
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient()
  }
  return browserQueryClient
}
```

- [ ] **Step 5: components/common/providers.tsx 생성**

```typescript
"use client"

import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { getQueryClient } from "@/lib/query-client"

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
}
```

- [ ] **Step 6: 테스트 실행 — 통과 확인**

```bash
npm run test:run
```

Expected: `3 passed` (Button x2 + Providers x1)

- [ ] **Step 7: app/layout.tsx를 Providers 래핑으로 교체**

```typescript
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Providers } from "@/components/common/providers"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Next.js 보일러플레이트",
  description:
    "Next.js 15 + TypeScript + Tailwind + shadcn/ui + NextAuth + Prisma + TanStack Query",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

- [ ] **Step 8: TypeScript 타입 체크**

```bash
npx tsc --noEmit
```

Expected: 에러 없음

- [ ] **Step 9: 커밋**

```bash
git add lib/query-client.ts components/common/providers.tsx app/layout.tsx __tests__/
git commit -m "feat: add TanStack Query v5 with QueryClientProvider"
```

---

### Task 8: 서버 쿼리 예시 + 대시보드 페이지

**Files:**

- Create: `server/queries/user.ts`
- Create: `app/(dashboard)/dashboard/page.tsx`

- [ ] **Step 1: server/queries/user.ts 생성**

```typescript
import { db } from "@/lib/db"

export async function getUserById(id: string) {
  return db.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
    },
  })
}

export async function getAllUsers() {
  return db.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  })
}
```

- [ ] **Step 2: app/(dashboard)/dashboard/page.tsx 생성**

```typescript
import { auth, signOut } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function DashboardPage() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">대시보드</h1>
        <form
          action={async () => {
            "use server"
            await signOut({ redirectTo: "/" })
          }}
        >
          <Button type="submit" variant="outline">
            로그아웃
          </Button>
        </form>
      </div>
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>내 프로필</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm">
            <span className="font-medium">이름:</span>{" "}
            <span className="text-muted-foreground">
              {session.user?.name ?? "-"}
            </span>
          </p>
          <p className="text-sm">
            <span className="font-medium">이메일:</span>{" "}
            <span className="text-muted-foreground">
              {session.user?.email ?? "-"}
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
```

- [ ] **Step 3: TypeScript 타입 체크**

```bash
npx tsc --noEmit
```

Expected: 에러 없음

- [ ] **Step 4: 커밋**

```bash
git add server/queries/user.ts "app/(dashboard)"
git commit -m "feat: add dashboard page and server query examples"
```

---

### Task 9: 랜딩 페이지 + 공통 헤더

**Files:**

- Create: `components/common/header.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: components/common/header.tsx 생성**

```typescript
import Link from "next/link"
import { auth, signOut } from "@/lib/auth"
import { Button } from "@/components/ui/button"

export async function Header() {
  const session = await auth()

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="font-bold text-lg">
          보일러플레이트
        </Link>
        <nav className="flex items-center gap-2">
          {session ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  대시보드
                </Button>
              </Link>
              <form
                action={async () => {
                  "use server"
                  await signOut({ redirectTo: "/" })
                }}
              >
                <Button type="submit" variant="outline" size="sm">
                  로그아웃
                </Button>
              </form>
            </>
          ) : (
            <Link href="/login">
              <Button size="sm">로그인</Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
```

- [ ] **Step 2: app/page.tsx를 랜딩 페이지로 교체**

```typescript
import Link from "next/link"
import { Header } from "@/components/common/header"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center gap-6 p-8 text-center">
        <h1 className="text-5xl font-bold tracking-tight">
          Next.js 보일러플레이트
        </h1>
        <p className="max-w-lg text-xl text-muted-foreground">
          Next.js 15 · TypeScript · Tailwind CSS · shadcn/ui · NextAuth v5 ·
          Prisma · TanStack Query
        </p>
        <div className="flex gap-4">
          <Link href="/login">
            <Button size="lg">시작하기</Button>
          </Link>
          <Link href="/dashboard">
            <Button size="lg" variant="outline">
              대시보드
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
```

- [ ] **Step 3: TypeScript 타입 체크**

```bash
npx tsc --noEmit
```

Expected: 에러 없음

- [ ] **Step 4: 커밋**

```bash
git add components/common/header.tsx app/page.tsx
git commit -m "feat: add landing page and common header component"
```

---

### Task 10: 최종 검증 및 README 업데이트

**Files:**

- Modify: `README.md`

- [ ] **Step 1: 전체 테스트 실행**

```bash
npm run test:run
```

Expected: `3 passed` — 에러 없음

- [ ] **Step 2: ESLint 검사**

```bash
npm run lint
```

Expected: 에러 없음

- [ ] **Step 3: Prettier 형식 검사**

```bash
npm run format:check
```

형식 이슈가 있으면 자동 수정:

```bash
npm run format
```

- [ ] **Step 4: TypeScript 전체 타입 체크**

```bash
npx tsc --noEmit
```

Expected: 에러 없음

- [ ] **Step 5: 프로덕션 빌드 확인**

```bash
npm run build
```

Expected: `✓ Compiled successfully` — 빌드 에러 없음

- [ ] **Step 6: README.md 업데이트**

`README.md`를 다음 내용으로 교체:

```markdown
# Next.js 보일러플레이트

Next.js 15 기반 개인용 범용 스타터. 인증, DB, 데이터 페칭이 사전 구성되어 있다.

## 기술 스택

| 영역        | 선택                                             |
| ----------- | ------------------------------------------------ |
| 프레임워크  | Next.js 15 (App Router)                          |
| 언어        | TypeScript strict                                |
| 스타일링    | Tailwind CSS v4 + shadcn/ui                      |
| 인증        | NextAuth.js v5 (Google, GitHub, 이메일 매직링크) |
| ORM         | Prisma + PostgreSQL                              |
| 데이터 페칭 | TanStack Query v5                                |

## 시작하기

### 1. 환경변수 설정

\`\`\`bash
cp .env.example .env.local
\`\`\`

`.env.local`에 아래 값을 채운다:

- `NEXTAUTH_SECRET`: 임의 랜덤 문자열 (`openssl rand -base64 32`)
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`: [Google Cloud Console](https://console.cloud.google.com) → OAuth 2.0 클라이언트
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET`: [GitHub Developer Settings](https://github.com/settings/developers) → OAuth Apps

### 2. 데이터베이스 시작

\`\`\`bash
npm run docker:up
npm run db:push
\`\`\`

### 3. 개발 서버 실행

\`\`\`bash
npm run dev
\`\`\`

[http://localhost:3000](http://localhost:3000) 접속

## 주요 스크립트

| 명령어               | 설명                      |
| -------------------- | ------------------------- |
| `npm run dev`        | 개발 서버 실행            |
| `npm run build`      | 프로덕션 빌드             |
| `npm run test`       | 테스트 실행 (watch)       |
| `npm run test:run`   | 테스트 1회 실행           |
| `npm run lint`       | ESLint 검사               |
| `npm run format`     | Prettier 포맷             |
| `npm run docker:up`  | PostgreSQL 컨테이너 시작  |
| `npm run db:push`    | DB 스키마 동기화          |
| `npm run db:studio`  | Prisma Studio 실행        |
| `npm run db:migrate` | 마이그레이션 생성 및 적용 |

## 프로젝트 구조

\`\`\`
app/
(auth)/login/ — 로그인 페이지 (비로그인 전용)
(dashboard)/ — 대시보드 (로그인 필수)
api/auth/ — NextAuth API 핸들러
components/
ui/ — shadcn/ui 컴포넌트
common/ — 프로젝트 공통 컴포넌트
lib/
auth.ts — NextAuth 설정
db.ts — Prisma 클라이언트
query-client.ts — TanStack Query 클라이언트
server/queries/ — 서버 전용 DB 쿼리 함수
prisma/schema.prisma — DB 스키마
middleware.ts — 라우트 보호 미들웨어
\`\`\`
```

- [ ] **Step 7: 최종 커밋**

```bash
git add README.md
git commit -m "docs: add README with setup guide and project structure"
```
