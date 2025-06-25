// app/auth/callback/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function Callback() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // OAuth 리다이렉션 처리 및 세션 복구
    supabase.auth.getSession().then(() => {
      router.replace('/') // 로그인 후 메인 페이지로 이동
    })
  }, [router, supabase])

  return <p className="text-center mt-10">로그인 처리 중입니다...</p>
}
