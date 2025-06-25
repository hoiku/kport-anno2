import { supabase } from '@/lib/supabaseClient'
import { LoginForm } from '@/components/login-form'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/protected` },
    })
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm space-y-4">
        <LoginForm />
        <Button className="w-full" onClick={handleGoogleLogin}>
          Sign in with Google
        </Button>
      </div>
    </div>
  )
}
