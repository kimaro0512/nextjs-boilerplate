import type { Session } from "next-auth"
import { Button } from "@/components/ui/button"

type AuthAction = (formData: FormData) => void | Promise<void>

type MainAuthPanelProps = {
  loginAction?: AuthAction
  logoutAction?: AuthAction
  session: Session | null
  signedOutTitle?: string
}

export function MainAuthPanel({
  loginAction,
  logoutAction,
  session,
  signedOutTitle = "로그인 없이 시작하기",
}: MainAuthPanelProps) {
  const displayName =
    session?.user?.name ?? session?.user?.email ?? "Google user"

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-10 text-foreground">
      <section className="w-full max-w-xl space-y-8">
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">
            Next.js Boilerplate
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {session ? "로그인되었습니다" : signedOutTitle}
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">
            {session
              ? "현재 메인 화면을 로그인된 상태로 보고 있습니다."
              : "메인 화면은 로그인 없이 접근할 수 있습니다."}
          </p>
        </div>

        {session ? (
          <div className="space-y-4 rounded-lg border bg-card p-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Signed in as
              </p>
              <p className="mt-1 text-base font-medium">{displayName}</p>
              {session.user?.email ? (
                <p className="mt-1 text-sm text-muted-foreground">
                  {session.user.email}
                </p>
              ) : null}
            </div>
            <form action={logoutAction}>
              <Button type="submit" variant="outline">
                로그아웃
              </Button>
            </form>
          </div>
        ) : (
          <form action={loginAction}>
            <Button type="submit" size="lg">
              Google로 로그인
            </Button>
          </form>
        )}
      </section>
    </main>
  )
}
