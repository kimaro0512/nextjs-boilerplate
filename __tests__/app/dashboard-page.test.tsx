import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const authMocks = vi.hoisted(() => ({
  auth: vi.fn(),
  redirect: vi.fn((path: string) => {
    throw new Error(`NEXT_REDIRECT:${path}`)
  }),
  signOut: vi.fn(),
}))

vi.mock("@/lib/auth", () => ({
  auth: authMocks.auth,
  signOut: authMocks.signOut,
}))

vi.mock("next/navigation", () => ({
  redirect: authMocks.redirect,
}))

import DashboardPage from "@/app/(dashboard)/dashboard/page"

describe("Dashboard page", () => {
  beforeEach(() => {
    authMocks.auth.mockReset()
    authMocks.redirect.mockClear()
    authMocks.signOut.mockReset()
  })

  it("redirects signed-out visitors to login", async () => {
    authMocks.auth.mockResolvedValue(null)

    await expect(DashboardPage()).rejects.toThrow("NEXT_REDIRECT:/login")
    expect(authMocks.redirect).toHaveBeenCalledWith("/login")
  })

  it("renders signed-in account details and sign out control", async () => {
    authMocks.auth.mockResolvedValue({
      expires: "2099-01-01T00:00:00.000Z",
      user: {
        id: "user-1",
        email: "user@example.com",
        name: "Example User",
      },
    })

    render(await DashboardPage())

    expect(
      screen.getByRole("heading", { name: "대시보드" })
    ).toBeInTheDocument()
    expect(screen.getByText("Example User")).toBeInTheDocument()
    expect(screen.getByText("user@example.com")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "로그아웃" })).toBeInTheDocument()
  })
})
