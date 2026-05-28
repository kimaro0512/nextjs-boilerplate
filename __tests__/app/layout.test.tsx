import { describe, expect, it, vi } from "vitest"

const providerMock = vi.hoisted(() => ({
  Providers: vi.fn(({ children }: { children: React.ReactNode }) => (
    <div data-testid="providers">{children}</div>
  )),
}))

vi.mock("@/components/common/providers", () => providerMock)

import RootLayout from "@/app/layout"

describe("RootLayout", () => {
  it("wraps application content with shared providers", () => {
    const element = RootLayout({ children: <span>app content</span> })
    const body = element.props.children
    const providers = body.props.children

    expect(element.props.lang).toBe("ko")
    expect(providers.type).toBe(providerMock.Providers)
    expect(providers.props.children.type).toBe("span")
    expect(providers.props.children.props.children).toBe("app content")
  })
})
