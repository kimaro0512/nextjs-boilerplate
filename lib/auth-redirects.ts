type AuthRedirectParams = {
  isAuthenticated: boolean
  pathname: string
}

export function getAuthRedirectPath({
  isAuthenticated,
  pathname,
}: AuthRedirectParams) {
  const isOnLogin = pathname === "/login" || pathname.startsWith("/login/")

  if (isAuthenticated && isOnLogin) {
    return "/"
  }

  return null
}
