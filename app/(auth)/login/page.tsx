import { MainAuthPanel } from "@/components/auth/main-auth-panel"
import { auth, signIn } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function LoginPage() {
  const session = await auth()

  if (session) {
    redirect("/")
  }

  return (
    <MainAuthPanel
      loginAction={async () => {
        "use server"
        await signIn("google", { redirectTo: "/" })
      }}
      session={null}
      signedOutTitle="Google 로그인"
    />
  )
}
