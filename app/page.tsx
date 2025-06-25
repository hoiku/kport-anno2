'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { DeployButton } from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { Hero } from "@/components/hero";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { ConnectSupabaseSteps } from "@/components/tutorial/connect-supabase-steps";
import { SignUpUserSteps } from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";


interface Annotation {
  id: string
  visibility: string
  metadata: {
    author: string
    object: string
    description?: string
  }
}

export default function Home() {
  const supabase = createClient()
  const [user, setUser] = useState<boolean>(false)
  const [annotations, setAnnotations] = useState<Annotation[]>([])

  // 1) 로그인 여부 확인
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(!!data.user)
    })
  }, [])

  // 2) 주석 데이터 로드
  useEffect(() => {
    let q = supabase
      .from('annotations')
      .select('id, visibility, metadata')
      .order('created_at', { ascending: false })

    if (!user) {
      // 비로그인 상태면 공개 주석만
      q = q.eq('visibility', 'public')
    }

    q.then(({ data, error }) => {
      if (!error && data) {
        setAnnotations(data as Annotation[])
      }
    })
  }, [user])

  return (
    <main className="min-h-screen flex flex-col items-center">
      {/* 기존 네비/영웅 섹션 유지 */}
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <Link href="/">
              <Hero />
            </Link>
            <div className="flex items-center gap-4">
              <AuthButton />
              <ThemeSwitcher />
            </div>
          </div>
        </nav>

        {/* (환경 변수 경고 / 튜토리얼) 필요 시 그대로 유지 */}
        <EnvVarWarning />
        <ConnectSupabaseSteps />
        <SignUpUserSteps />
        <DeployButton />

        {/* ▶ 여기에 주석 리스트 추가 */}
        <section className="w-full max-w-5xl p-4">
          <h2 className="text-2xl font-bold mb-4">Annotations</h2>
          <ul className="space-y-4">
            {annotations.length === 0 ? (
              <li className="text-center text-gray-500">
                {user ? 'No annotations yet.' : 'No public annotations available.'}
              </li>
            ) : (
              annotations.map(a => (
                <li key={a.id} className="border rounded p-3">
                  <div className="text-sm text-gray-500">{a.visibility}</div>
                  <strong>{a.metadata.author}</strong> annotated{' '}
                  <em>{a.metadata.object}</em>
                  {a.metadata.description && (
                    <p className="mt-1">{a.metadata.description}</p>
                  )}
                </li>
              ))
            )}
          </ul>
        </section>
      </div>
    </main>
  )
}
