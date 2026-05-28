import { auth } from "@/lib/auth.edge"
import { getAuthRedirectPath } from "@/lib/auth-redirects"
import { NextResponse } from "next/server"

export default auth((req) => {
  const redirectPath = getAuthRedirectPath({
    isAuthenticated: Boolean(req.auth),
    pathname: req.nextUrl.pathname,
  })

  if (redirectPath) {
    return NextResponse.redirect(new URL(redirectPath, req.nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
