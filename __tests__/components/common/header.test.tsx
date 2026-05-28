import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { Header } from "@/components/common/header"

describe("Header", () => {
  it("shows a Google login action for signed-out visitors", () => {
    const loginAction = vi.fn()

    render(<Header loginAction={loginAction} session={null} />)

    expect(
      screen.getByRole("link", { name: "Next.js Boilerplate" })
    ).toHaveAttribute("href", "/")
    expect(
      screen.getByRole("button", { name: "Google로 로그인" })
    ).toBeInTheDocument()
    expect(loginAction).not.toHaveBeenCalled()
  })

  it("shows dashboard navigation and sign-out for signed-in visitors", () => {
    const logoutAction = vi.fn()

    render(
      <Header
        logoutAction={logoutAction}
        session={{
          expires: "2099-01-01T00:00:00.000Z",
          user: {
            id: "user-1",
            email: "user@example.com",
            name: "Example User",
          },
        }}
      />
    )

    expect(screen.getByText("Example User")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "대시보드" })).toHaveAttribute(
      "href",
      "/dashboard"
    )
    expect(screen.getByRole("button", { name: "로그아웃" })).toBeInTheDocument()
    expect(logoutAction).not.toHaveBeenCalled()
  })
})
