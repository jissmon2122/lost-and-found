"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { userStorage } from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"
import { LogOut } from "lucide-react"

export function AppHeader() {
  const router = useRouter()
  const { toast } = useToast()
  const currentUser = userStorage.getCurrentUser()

  const handleLogout = () => {
    userStorage.setCurrentUser(null)
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    })
    router.push("/")
  }

  return (
    <header className="border-b bg-card sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">Lost & Found</h1>
        <div className="flex items-center gap-4">
          {currentUser && (
            <>
              <span className="text-sm text-muted-foreground hidden sm:inline">{currentUser.name}</span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
