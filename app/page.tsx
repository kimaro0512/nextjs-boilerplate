import { auth } from "@/lib/auth.edge"
import { redirect } from "next/navigation"
import { AutoGoogleSignIn } from "@/components/auth/auto-google-signin"

export default async function Home() {
  const session = await auth()

  if (session) {
    redirect("/dashboard")
  }

  return <AutoGoogleSignIn />
}
