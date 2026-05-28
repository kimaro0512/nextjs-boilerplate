import { describe, expect, it } from "vitest"

import { getAuthRedirectPath } from "@/lib/auth-redirects"

describe("getAuthRedirectPath", () => {
  it("keeps the main page public for signed-out visitors", () => {
    expect(getAuthRedirectPath({ isAuthenticated: false, pathname: "/" })).toBe(
      null
    )
  })

  it("redirects signed-in visitors away from the login page to the main page", () => {
    expect(
      getAuthRedirectPath({ isAuthenticated: true, pathname: "/login" })
    ).toBe("/")
  })

  it("does not redirect signed-out visitors from the login page", () => {
    expect(
      getAuthRedirectPath({ isAuthenticated: false, pathname: "/login" })
    ).toBe(null)
  })
})
