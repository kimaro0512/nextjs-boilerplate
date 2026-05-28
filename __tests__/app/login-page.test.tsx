import { beforeEach, describe, expect, it, vi } from "vitest"

const authMocks = vi.hoisted(() => ({
  auth: vi.fn(),
  redirect: vi.fn((path: string) => {
    throw new Error(`NEXT_REDIRECT:${path}`)
  }),
  signIn: vi.fn(),
}))

vi.mock("@/lib/auth", () => ({
  auth: authMocks.auth,
  signIn: authMocks.signIn,
}))

vi.mock("next/navigation", () => ({
  redirect: authMocks.redirect,
}))

import LoginPage from "@/app/(auth)/login/page"

describe("Login page", () => {
  beforeEach(() => {
    authMocks.auth.mockReset()
    authMocks.redirect.mockClear()
    authMocks.signIn.mockReset()
  })

  it("offers Google sign-in back to the main page", async () => {
    authMocks.auth.mockResolvedValue(null)

    const element = await LoginPage()

    expect(element.props.session).toBe(null)
    expect(element.props.signedOutTitle).toBe("Google 로그인")

    await element.props.loginAction(new FormData())

    expect(authMocks.signIn).toHaveBeenCalledWith("google", {
      redirectTo: "/",
    })
  })

  it("redirects signed-in visitors back to the main page", async () => {
    authMocks.auth.mockResolvedValue({
      expires: "2099-01-01T00:00:00.000Z",
      user: {
        id: "user-1",
      },
    })

    await expect(LoginPage()).rejects.toThrow("NEXT_REDIRECT:/")
    expect(authMocks.redirect).toHaveBeenCalledWith("/")
  })
})
