'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Hero } from '@/components/hero'
import { AuthButton } from '@/components/auth-button'
import { ThemeSwitcher } from '@/components/theme-switcher'

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
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [annotations, setAnnotations] = useState<Annotation[]>([])

  useEffect(() => {
    // 로그인 상태 확인
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null)
    })
  }, [])

  useEffect(() => {
    // 주석 데이터 가져오기
    const fetchAnnotations = async () => {
      const { data, error } = await supabase
        .from('annotations')
        .select('id, visibility, metadata')
        .order('created_at', { ascending: false })

      if (data && !error) {
        const visible = userEmail
          ? data // 로그인한 사용자는 전체 주석 보기
          : data.filter((a) => a.visibility === 'public') // 비로그인은 공개만
        setAnnotations(visible as Annotation[])
      }
    }

    fetchAnnotations()
  }, [userEmail])

  return (
    <main className="min-h-screen flex flex-col items-center bg-background text-foreground">
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

      <section className="w-full max-w-5xl px-6 py-12">
        <h1 className="text-2xl font-bold mb-4">
          {userEmail
            ? `Welcome back, ${userEmail}!`
            : 'Explore Public Annotations'}
        </h1>

        {annotations.length === 0 ? (
          <p className="text-gray-500">
            {userEmail ? 'No annotations found.' : 'No public annotations yet.'}
          </p>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {annotations.map((a) => (
              <li key={a.id} className="border p-4 rounded shadow-sm bg-white dark:bg-zinc-900">
                <div className="text-xs text-gray-500 mb-1 uppercase tracking-widest">
                  {a.visibility}
                </div>
                <h3 className="text-lg font-semibold">
                  {a.metadata.author} → <em>{a.metadata.object}</em>
                </h3>
                {a.metadata.description && (
                  <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                    {a.metadata.description}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <footer className="w-full border-t border-t-foreground/10 py-6 text-xs text-center text-gray-500">
        Powered by Supabase & Next.js Starter
      </footer>
    </main>
  )
}
