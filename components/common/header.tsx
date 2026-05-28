import Link from "next/link"
import type { Session } from "next-auth"
import { LayoutDashboard, LogIn, LogOut, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"

type AuthAction = (formData: FormData) => void | Promise<void>

type HeaderProps = {
  loginAction?: AuthAction
  logoutAction?: AuthAction
  session: Session | null
}

export function Header({ loginAction, logoutAction, session }: HeaderProps) {
  const displayName = session?.user?.name ?? session?.user?.email

  return (
    <header className="border-b bg-background/95">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-6">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2 text-sm font-semibold"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
            <Rocket className="size-4" aria-hidden="true" />
          </span>
          <span className="truncate">Next.js Boilerplate</span>
        </Link>

        <nav className="flex shrink-0 items-center gap-2">
          {session ? (
            <>
              {displayName ? (
                <span className="hidden max-w-48 truncate text-sm text-muted-foreground sm:inline">
                  {displayName}
                </span>
              ) : null}
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">
                  <LayoutDashboard className="size-4" aria-hidden="true" />
                  대시보드
                </Link>
              </Button>
              <form action={logoutAction}>
                <Button type="submit" variant="outline" size="sm">
                  <LogOut className="size-4" aria-hidden="true" />
                  로그아웃
                </Button>
              </form>
            </>
          ) : (
            <form action={loginAction}>
              <Button type="submit" size="sm">
                <LogIn className="size-4" aria-hidden="true" />
                Google로 로그인
              </Button>
            </form>
          )}
        </nav>
      </div>
    </header>
  )
}
