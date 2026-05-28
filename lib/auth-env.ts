type AuthEnvironment = Record<string, string | undefined>
type GoogleEnvKey =
  | "AUTH_GOOGLE_ID"
  | "AUTH_GOOGLE_SECRET"
  | "GOOGLE_CLIENT_ID"
  | "GOOGLE_CLIENT_SECRET"

export type GoogleOAuthCredentials = {
  clientId: string
  clientSecret: string
}

function readRequiredEnv(
  env: AuthEnvironment,
  primaryKey: GoogleEnvKey,
  fallbackKey: GoogleEnvKey,
  label: string
) {
  const value = env[primaryKey]?.trim() || env[fallbackKey]?.trim()

  if (!value) {
    throw new Error(
      `Missing Google OAuth ${label}. Set ${primaryKey} or ${fallbackKey}.`
    )
  }

  return value
}

export function getGoogleOAuthCredentials(
  env: AuthEnvironment = process.env
): GoogleOAuthCredentials {
  return {
    clientId: readRequiredEnv(
      env,
      "GOOGLE_CLIENT_ID",
      "AUTH_GOOGLE_ID",
      "client id"
    ),
    clientSecret: readRequiredEnv(
      env,
      "GOOGLE_CLIENT_SECRET",
      "AUTH_GOOGLE_SECRET",
      "client secret"
    ),
  }
}
