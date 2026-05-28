"use client"

import { useEffect, useRef } from "react"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"

export function AutoGoogleSignIn() {
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true

    void signIn("google", { redirectTo: "/dashboard" })
  }, [])

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-zinc-50">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/30 backdrop-blur">
        <p className="text-sm uppercase tracking-[0.3em] text-zinc-400">
          Google Login
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          Google 로그인으로 이동 중입니다
        </h1>
        <p className="mt-4 text-sm leading-6 text-zinc-300">
          잠시만 기다려 주세요. 자동 이동이 차단되면 아래 버튼을 눌러 계속할 수
          있습니다.
        </p>
        <Button
          type="button"
          className="mt-6 w-full"
          onClick={() => {
            void signIn("google", { redirectTo: "/dashboard" })
          }}
        >
          Google로 계속하기
        </Button>
      </div>
    </main>
  )
}
