"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppHeader } from "@/components/app-header"
import { FoundItemForm } from "@/components/found-item-form"
import { FoundItemsBrowser } from "@/components/found-items-browser"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { storage } from "@/lib/storage"
import type { District, Venue } from "@/lib/types"
import { ArrowLeft } from "lucide-react"

export default function LostAndFoundPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null)
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null)

  useEffect(() => {
    // Check for JWT token in localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.replace("/login")
      return
    }

    const district = storage.get("selectedDistrict")
    const venue = storage.get("selectedVenue")

    if (!district || !venue) {
      router.push("/districts")
      return
    }

    setSelectedDistrict(district)
    setSelectedVenue(venue)
    setIsLoading(false)
  }, [router])

  const handleBack = () => {
    router.push("/venues")
  }

  if (isLoading) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <Button variant="ghost" onClick={handleBack} className="mb-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Venues
          </Button>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Lost and Found</h1>
            <p className="text-muted-foreground leading-relaxed">
              Location: <span className="font-medium text-foreground">{selectedVenue?.name}</span>,{" "}
              <span className="font-medium text-foreground">{selectedDistrict?.name}</span>
            </p>
          </div>

          <Tabs defaultValue="lost" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="lost">I Lost Something</TabsTrigger>
              <TabsTrigger value="found">I Found Something</TabsTrigger>
            </TabsList>
            <TabsContent value="lost" className="mt-6">
              {selectedDistrict && selectedVenue && (
                <FoundItemsBrowser district={selectedDistrict} venue={selectedVenue} />
              )}
            </TabsContent>
            <TabsContent value="found" className="mt-6">
              {selectedDistrict && selectedVenue && <FoundItemForm district={selectedDistrict} venue={selectedVenue} />}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
