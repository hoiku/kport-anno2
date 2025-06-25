import Link from "next/link"
import { DeployButton } from "@/components/deploy-button"
import { EnvVarWarning } from "@/components/env-var-warning"
import { AuthButton } from "@/components/auth-button"
import { Hero } from "@/components/hero"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { ConnectSupabaseSteps } from "@/components/tutorial/connect-supabase-steps"
import { SignUpUserSteps } from "@/components/tutorial/sign-up-user-steps"
import { hasEnvVars } from "@/lib/utils"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
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

        {!hasEnvVars && <EnvVarWarning />}

        {hasEnvVars ? <SignUpUserSteps /> : <ConnectSupabaseSteps />}

        <DeployButton />
      </div>
    </main>
  )
}
