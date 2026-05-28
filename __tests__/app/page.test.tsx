import { describe, expect, it, vi, beforeEach } from "vitest"

const authMocks = vi.hoisted(() => ({
  auth: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
}))

vi.mock("@/lib/auth", () => authMocks)

import Home from "@/app/page"

describe("Home page", () => {
  beforeEach(() => {
    authMocks.auth.mockReset()
    authMocks.signIn.mockReset()
    authMocks.signOut.mockReset()
  })

  it("renders the main page for signed-out visitors and signs in to the main page", async () => {
    authMocks.auth.mockResolvedValue(null)

    const element = await Home()

    expect(element.props.session).toBe(null)

    await element.props.loginAction(new FormData())

    expect(authMocks.signIn).toHaveBeenCalledWith("google", {
      redirectTo: "/",
    })
  })

  it("renders the main page for signed-in visitors and signs out to the main page", async () => {
    authMocks.auth.mockResolvedValue({
      expires: "2099-01-01T00:00:00.000Z",
      user: {
        id: "user-1",
        email: "user@example.com",
        name: "Example User",
      },
    })

    const element = await Home()

    expect(element.props.session?.user.email).toBe("user@example.com")

    await element.props.logoutAction(new FormData())

    expect(authMocks.signOut).toHaveBeenCalledWith({
      redirectTo: "/",
    })
  })
})
