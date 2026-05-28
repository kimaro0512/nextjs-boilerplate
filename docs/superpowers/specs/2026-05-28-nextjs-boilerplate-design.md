# Next.js 개인 보일러플레이트 디자인

**날짜:** 2026-05-28  
**목적:** 개인 프로젝트에서 반복 사용할 범용 Next.js 스타터

---

## 개요

SaaS 앱과 콘텐츠 사이트를 모두 커버할 수 있는 개인용 Next.js 보일러플레이트. 인증, DB, 데이터 페칭이 사전 구성된 상태로 새 프로젝트를 빠르게 시작할 수 있도록 설계한다.

---

## 기술 스택

| 영역 | 선택 |
|------|------|
| 프레임워크 | Next.js 15, App Router |
| 언어 | TypeScript (strict mode) |
| 스타일링 | Tailwind CSS v4 + shadcn/ui |
| 인증 | NextAuth.js v5 (Auth.js) |
| ORM | Prisma |
| DB | PostgreSQL (로컬: Docker Compose) |
| 데이터 페칭 | TanStack Query v5 |
| 린팅/포맷 | ESLint + Prettier |

---

## 디렉터리 구조

```
nextjs-boilerplate/
├── app/
│   ├── (auth)/
│   │   └── login/page.tsx
│   ├── (dashboard)/
│   │   └── dashboard/page.tsx
│   ├── api/
│   │   └── auth/[...nextauth]/route.ts
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                  # shadcn/ui 자동 생성 컴포넌트
│   └── common/              # 프로젝트 공통 컴포넌트
├── lib/
│   ├── auth.ts              # NextAuth 설정
│   ├── db.ts                # Prisma 클라이언트 싱글턴
│   └── query-client.ts      # React Query 클라이언트 설정
├── server/
│   └── queries/             # DB 쿼리 함수 (서버 전용)
├── prisma/
│   └── schema.prisma
├── types/
│   └── index.ts
├── middleware.ts
├── docker-compose.yml
└── .env.example
```

---

## 인증 흐름

- `middleware.ts`가 보호된 라우트 접근을 가로채 미인증 사용자를 `/login`으로 리다이렉트
- `(auth)` 라우트 그룹: 비로그인 전용 페이지
- `(dashboard)` 라우트 그룹: 로그인 필수 페이지
- 소셜 로그인: Google, GitHub
- 이메일 인증: 매직링크 방식
- Prisma 어댑터를 통해 세션을 PostgreSQL에 저장
- 초기 스키마: `User`, `Account`, `Session`, `VerificationToken` (NextAuth 필수 모델)

---

## 데이터 페칭 패턴

- `app/layout.tsx`에 `QueryClientProvider` 래핑
- 서버 컴포넌트에서 prefetch 후 클라이언트에서 hydrate하는 패턴을 예시 파일로 제공
- `lib/query-client.ts`에서 전역 기본값 설정 (`staleTime: 60_000`, `retry: 1`)
- `server/queries/` 파일은 서버 전용으로 클라이언트 컴포넌트에서 직접 import 금지

---

## 개발 환경

**Docker Compose** — PostgreSQL 로컬 컨테이너

**package.json 스크립트**

```json
"dev": "next dev",
"build": "next build",
"db:push": "prisma db push",
"db:studio": "prisma studio",
"db:migrate": "prisma migrate dev",
"docker:up": "docker compose up -d"
```

**시작 순서**

1. `.env.example` → `.env.local` 복사 후 값 채우기
2. `npm run docker:up`
3. `npm run db:push`
4. `npm run dev`

---

## 사전 설치 shadcn/ui 컴포넌트

- Button
- Card
- Input
- Form

---

## 환경변수 (.env.example)

```
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
EMAIL_SERVER=
EMAIL_FROM=
```
