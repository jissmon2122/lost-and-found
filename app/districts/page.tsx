"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppHeader } from "@/components/app-header"
import { DistrictSearch } from "@/components/district-search"
import { storage } from "@/lib/storage"
import type { District } from "@/lib/types"

export default function DistrictsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for JWT token in localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.replace("/login")
    } else {
      setIsLoading(false)
    }
  }, [router])

  const handleSelectDistrict = (district: District) => {
    storage.set("selectedDistrict", district)
    router.push("/venues")
  }

  if (isLoading) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Select Your District</h1>
            <p className="text-muted-foreground leading-relaxed">
              Choose the district where you lost or found an item. You can search by district or state name.
            </p>
          </div>
          <DistrictSearch onSelectDistrict={handleSelectDistrict} />
        </div>
      </main>
    </div>
  )
}
