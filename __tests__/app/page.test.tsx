import { describe, expect, it, vi, beforeEach } from "vitest"
import type { ReactElement, ReactNode } from "react"
import type { Session } from "next-auth"

const authMocks = vi.hoisted(() => ({
  auth: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
}))

vi.mock("@/lib/auth", () => authMocks)

import { MainAuthPanel } from "@/components/auth/main-auth-panel"
import { Header } from "@/components/common/header"
import Home from "@/app/page"

type AuthAction = (formData: FormData) => void | Promise<void>
type AuthSurfaceProps = {
  loginAction: AuthAction
  logoutAction: AuthAction
  session: Session | null
}

function findElementByType<Props>(
  node: ReactNode,
  type: ReactElement["type"]
): ReactElement<Props> | null {
  if (!node || typeof node !== "object" || !("type" in node)) {
    return null
  }

  const element = node as ReactElement<Props & { children?: ReactNode }>

  if (element.type === type) {
    return element as ReactElement<Props>
  }

  const children = element.props.children
  const childList = Array.isArray(children) ? children : [children]

  for (const child of childList) {
    const match = findElementByType<Props>(child, type)
    if (match) {
      return match
    }
  }

  return null
}

describe("Home page", () => {
  beforeEach(() => {
    authMocks.auth.mockReset()
    authMocks.signIn.mockReset()
    authMocks.signOut.mockReset()
  })

  it("renders the main page for signed-out visitors and signs in to the main page", async () => {
    authMocks.auth.mockResolvedValue(null)

    const element = await Home()
    const header = findElementByType<AuthSurfaceProps>(element, Header)
    const panel = findElementByType<AuthSurfaceProps>(element, MainAuthPanel)

    expect(header?.props.session).toBe(null)
    expect(panel?.props.session).toBe(null)

    await panel?.props.loginAction(new FormData())

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
    const header = findElementByType<AuthSurfaceProps>(element, Header)
    const panel = findElementByType<AuthSurfaceProps>(element, MainAuthPanel)

    expect(header?.props.session?.user.email).toBe("user@example.com")
    expect(panel?.props.session?.user.email).toBe("user@example.com")

    await panel?.props.logoutAction(new FormData())

    expect(authMocks.signOut).toHaveBeenCalledWith({
      redirectTo: "/",
    })
  })
})
