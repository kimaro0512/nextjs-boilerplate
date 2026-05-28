import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { MainAuthPanel } from "@/components/auth/main-auth-panel"

describe("MainAuthPanel", () => {
  it("shows a Google login action for signed-out visitors without starting login", () => {
    const loginAction = vi.fn()

    render(<MainAuthPanel loginAction={loginAction} session={null} />)

    expect(
      screen.getByRole("heading", { name: "로그인 없이 시작하기" })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Google로 로그인" })
    ).toBeInTheDocument()
    expect(loginAction).not.toHaveBeenCalled()
  })

  it("shows the signed-in user and a sign-out action", () => {
    const logoutAction = vi.fn()

    render(
      <MainAuthPanel
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

    expect(
      screen.getByRole("heading", { name: "로그인되었습니다" })
    ).toBeInTheDocument()
    expect(screen.getByText("Example User")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "로그아웃" })).toBeInTheDocument()
    expect(logoutAction).not.toHaveBeenCalled()
  })
})
