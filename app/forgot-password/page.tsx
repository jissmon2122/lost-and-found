import { AuthHeader } from "@/components/auth-header"
import { ForgotPasswordForm } from "@/components/forgot-password-form"

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-secondary/20">
      <div className="w-full max-w-md">
        <AuthHeader />
        <ForgotPasswordForm />
      </div>
    </div>
  )
}
