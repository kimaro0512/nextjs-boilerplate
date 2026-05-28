import { describe, expect, it } from "vitest"

import { authConfig } from "@/lib/auth.config"

describe("authConfig callbacks", () => {
  it("copies a signed-in user's id into the JWT", async () => {
    const token = await authConfig.callbacks?.jwt?.({
      account: null,
      profile: undefined,
      token: {},
      trigger: "signIn",
      user: { id: "user-1" },
    })

    expect(token).toMatchObject({ id: "user-1" })
  })

  it("copies the JWT user id into the session without requiring a database user", async () => {
    const session = await authConfig.callbacks?.session?.({
      newSession: undefined,
      session: {
        expires: "2099-01-01T00:00:00.000Z",
        user: {
          email: "user@example.com",
          name: "Example User",
        },
      },
      token: {
        id: "user-1",
      },
      trigger: undefined,
    })

    expect(session?.user.id).toBe("user-1")
  })
})
