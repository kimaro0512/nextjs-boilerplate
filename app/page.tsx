import { MainAuthPanel } from "@/components/auth/main-auth-panel"
import { auth, signIn, signOut } from "@/lib/auth"

export default async function Home() {
  const session = await auth()

  return (
    <MainAuthPanel
      loginAction={async () => {
        "use server"
        await signIn("google", { redirectTo: "/" })
      }}
      logoutAction={async () => {
        "use server"
        await signOut({ redirectTo: "/" })
      }}
      session={session}
    />
  )
}
