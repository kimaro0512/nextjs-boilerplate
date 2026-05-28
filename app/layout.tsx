import type { Metadata } from "next"
import { Providers } from "@/components/common/providers"
import "./globals.css"

export const metadata: Metadata = {
  title: "Next.js Boilerplate",
  description:
    "Next.js 16, TypeScript, Tailwind CSS, Auth.js, Prisma, and TanStack Query starter.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
