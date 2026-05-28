import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import Nodemailer from "next-auth/providers/nodemailer"
import { db } from "@/lib/db"
import { authConfig } from "@/lib/auth.config"
import { getGoogleOAuthCredentials } from "@/lib/auth-env"

const googleOAuthCredentials = getGoogleOAuthCredentials()

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db),
  secret: process.env.AUTH_SECRET,
  providers: [
    Google(googleOAuthCredentials),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    ...(process.env.EMAIL_SERVER && process.env.EMAIL_FROM
      ? [
          Nodemailer({
            server: process.env.EMAIL_SERVER,
            from: process.env.EMAIL_FROM,
          }),
        ]
      : []),
  ],
})
