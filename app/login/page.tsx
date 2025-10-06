import { AuthHeader } from "@/components/auth-header"
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-secondary/20">
      <div className="w-full max-w-md">
        <AuthHeader />
        <LoginForm />
      </div>
    </div>
  )
}
