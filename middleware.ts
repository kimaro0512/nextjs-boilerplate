import { auth } from "@/lib/auth.edge"
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
