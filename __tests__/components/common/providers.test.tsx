import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Providers } from "@/components/common/providers"

describe("Providers", () => {
  it("renders children without error", () => {
    render(
      <Providers>
        <div>test content</div>
      </Providers>
    )

    expect(screen.getByText("test content")).toBeInTheDocument()
  })
})
