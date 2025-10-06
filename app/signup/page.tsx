import { AuthHeader } from "@/components/auth-header"
import { SignupForm } from "@/components/signup-form"

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-secondary/20">
      <div className="w-full max-w-md">
        <AuthHeader />
        <SignupForm />
      </div>
    </div>
  )
}
