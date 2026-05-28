import { MainAuthPanel } from "@/components/auth/main-auth-panel"
import { Header } from "@/components/common/header"
import { auth, signIn, signOut } from "@/lib/auth"
import { Blocks, Database, ShieldCheck, Zap } from "lucide-react"

export default async function Home() {
  const session = await auth()
  const loginAction = async () => {
    "use server"
    await signIn("google", { redirectTo: "/" })
  }
  const logoutAction = async () => {
    "use server"
    await signOut({ redirectTo: "/" })
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header
        loginAction={loginAction}
        logoutAction={logoutAction}
        session={session}
      />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-10">
        <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="space-y-7">
            <div className="space-y-4">
              <p className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-800">
                <Zap className="size-4" aria-hidden="true" />
                Ready for personal projects
              </p>
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                Next.js Boilerplate
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                인증, 데이터베이스, 서버 쿼리, 클라이언트 캐시까지 한 번에
                시작할 수 있는 개인용 Next.js 기본 구성입니다.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["Auth.js", "Google OAuth", ShieldCheck],
                ["Prisma", "PostgreSQL", Database],
                ["Query", "TanStack v5", Blocks],
              ].map(([title, caption, Icon]) => (
                <div
                  className="rounded-lg border bg-card p-4 text-sm"
                  key={title as string}
                >
                  <Icon
                    className="mb-3 size-5 text-sky-700"
                    aria-hidden="true"
                  />
                  <p className="font-medium">{title as string}</p>
                  <p className="mt-1 text-muted-foreground">
                    {caption as string}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <MainAuthPanel
            loginAction={loginAction}
            logoutAction={logoutAction}
            session={session}
          />
        </section>
      </main>
    </div>
  )
}
