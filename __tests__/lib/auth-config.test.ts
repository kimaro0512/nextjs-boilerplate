import { describe, expect, it } from "vitest"
import type { AdapterUser } from "next-auth/adapters"

import { authConfig } from "@/lib/auth.config"

describe("authConfig callbacks", () => {
  it("copies a signed-in user's id into the JWT", async () => {
    const token = await authConfig.callbacks?.jwt?.({
      account: null,
      profile: undefined,
      token: {},
      trigger: "signIn",
      user: {
        id: "user-1",
        email: "user@example.com",
        emailVerified: null,
      } satisfies AdapterUser,
    })

    expect(token).toMatchObject({ id: "user-1" })
  })

  it("copies the JWT user id into the session without requiring a database user", async () => {
    const adapterUser = {
      id: "",
      email: "user@example.com",
      emailVerified: null,
      name: "Example User",
    } satisfies AdapterUser

    const session = await authConfig.callbacks?.session?.({
      newSession: undefined,
      session: {
        expires: new Date("2099-01-01T00:00:00.000Z") as unknown as Date &
          string,
        sessionToken: "session-token",
        user: adapterUser,
        userId: "user-1",
      },
      token: {
        id: "user-1",
      },
      trigger: undefined,
      user: adapterUser,
    })

    expect(session?.user?.id).toBe("user-1")
  })
})
