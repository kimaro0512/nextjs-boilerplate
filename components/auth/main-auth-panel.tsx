import type { Session } from "next-auth"
import Link from "next/link"
import { LayoutDashboard, LogIn, LogOut, UserRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
    <Card className="rounded-lg">
      <CardHeader>
        <div className="mb-2 flex size-9 items-center justify-center rounded-lg bg-sky-50 text-sky-700 ring-1 ring-sky-200">
          <UserRound className="size-4" aria-hidden="true" />
        </div>
        <CardTitle aria-level={2} className="text-xl" role="heading">
          {session ? "로그인되었습니다" : signedOutTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-sm leading-6 text-muted-foreground">
          {session
            ? "현재 메인 화면을 로그인된 상태로 보고 있습니다."
            : "메인 화면은 로그인 없이 접근할 수 있습니다."}
        </p>
        {session ? (
          <div className="space-y-4">
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
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" asChild>
                <Link href="/dashboard">
                  <LayoutDashboard className="size-4" aria-hidden="true" />
                  대시보드
                </Link>
              </Button>
              <form action={logoutAction}>
                <Button type="submit" variant="outline">
                  <LogOut className="size-4" aria-hidden="true" />
                  로그아웃
                </Button>
              </form>
            </div>
          </div>
        ) : (
          <form action={loginAction}>
            <Button type="submit" size="lg">
              <LogIn className="size-4" aria-hidden="true" />
              Google로 로그인
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
