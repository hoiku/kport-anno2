'use client'

import { supabase } from '@/lib/supabase/client'

export default function Page() {
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-xl font-bold text-center">Google 로그인</h1>
        <button
          className="flex items-center justify-center gap-3 w-full bg-white text-[#3c4043] border border-[#dadce0] rounded-md py-2 px-4 text-sm font-medium shadow-sm hover:shadow-md"
          onClick={handleGoogleLogin}
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google Logo"
            className="w-5 h-5"
          />
          <span>Sign in with Google</span>
        </button>
      </div>
    </div>
  )
}
