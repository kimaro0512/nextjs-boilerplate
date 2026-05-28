import { redirect } from "next/navigation"
import { LogOut, ShieldCheck, UserRound } from "lucide-react"
import { auth, signOut } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function DashboardPage() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  const displayName = session.user?.name ?? session.user?.email ?? "Google user"

  return (
    <main className="min-h-screen bg-background px-6 py-8 text-foreground">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <p className="flex items-center gap-2 text-sm font-medium text-emerald-700">
              <ShieldCheck className="size-4" aria-hidden="true" />
              Authenticated workspace
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">대시보드</h1>
          </div>
          <form
            action={async () => {
              "use server"
              await signOut({ redirectTo: "/" })
            }}
          >
            <Button type="submit" variant="outline">
              <LogOut className="size-4" aria-hidden="true" />
              로그아웃
            </Button>
          </form>
        </header>

        <section className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserRound className="size-4" aria-hidden="true" />내 프로필
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">이름</p>
                <p className="mt-1 text-lg font-medium">{displayName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">이메일</p>
                <p className="mt-1 text-base">{session.user?.email ?? "-"}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle>세션 상태</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>Google OAuth 세션이 활성화되어 있습니다.</p>
              <p>메인 화면으로 돌아가도 로그인 상태가 유지됩니다.</p>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  )
}
