import { describe, expect, it } from "vitest"

import { getGoogleOAuthCredentials } from "@/lib/auth-env"

describe("getGoogleOAuthCredentials", () => {
  it("uses GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET when present", () => {
    expect(
      getGoogleOAuthCredentials({
        GOOGLE_CLIENT_ID: "google-client-id",
        GOOGLE_CLIENT_SECRET: "google-client-secret",
        AUTH_GOOGLE_ID: "auth-google-id",
        AUTH_GOOGLE_SECRET: "auth-google-secret",
      })
    ).toEqual({
      clientId: "google-client-id",
      clientSecret: "google-client-secret",
    })
  })

  it("falls back to Auth.js Google environment variable names", () => {
    expect(
      getGoogleOAuthCredentials({
        AUTH_GOOGLE_ID: "auth-google-id",
        AUTH_GOOGLE_SECRET: "auth-google-secret",
      })
    ).toEqual({
      clientId: "auth-google-id",
      clientSecret: "auth-google-secret",
    })
  })

  it("throws a clear error when the Google client id is missing", () => {
    expect(() =>
      getGoogleOAuthCredentials({
        GOOGLE_CLIENT_SECRET: "google-client-secret",
      })
    ).toThrow(
      "Missing Google OAuth client id. Set GOOGLE_CLIENT_ID or AUTH_GOOGLE_ID."
    )
  })

  it("throws a clear error when the Google client secret is missing", () => {
    expect(() =>
      getGoogleOAuthCredentials({
        GOOGLE_CLIENT_ID: "google-client-id",
      })
    ).toThrow(
      "Missing Google OAuth client secret. Set GOOGLE_CLIENT_SECRET or AUTH_GOOGLE_SECRET."
    )
  })
})
