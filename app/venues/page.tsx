"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppHeader } from "@/components/app-header"
import { VenueList } from "@/components/venue-list"
import { Button } from "@/components/ui/button"
import { storage } from "@/lib/storage"
import { venues } from "@/lib/data"
import type { District, Venue } from "@/lib/types"
import { ArrowLeft } from "lucide-react"

export default function VenuesPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null)
  const [districtVenues, setDistrictVenues] = useState<Venue[]>([])

  useEffect(() => {
    // Check for JWT token in localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.replace("/login")
      return
    }

    const district = storage.get("selectedDistrict")
    if (!district) {
      router.push("/districts")
      return
    }

    setSelectedDistrict(district)
    const filteredVenues = venues.filter((v) => v.districtId === district.id)
    setDistrictVenues(filteredVenues)
    setIsLoading(false)
  }, [router])

  const handleSelectVenue = (venue: Venue) => {
    storage.set("selectedVenue", venue)
    router.push("/lost-and-found")
  }

  const handleBack = () => {
    router.push("/districts")
  }

  if (isLoading) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <Button variant="ghost" onClick={handleBack} className="mb-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Districts
          </Button>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Select a Venue</h1>
            <p className="text-muted-foreground leading-relaxed">
              Choose the specific venue in <span className="font-medium text-foreground">{selectedDistrict?.name}</span>{" "}
              where you lost or found an item.
            </p>
          </div>

          <VenueList venues={districtVenues} onSelectVenue={handleSelectVenue} />
        </div>
      </main>
    </div>
  )
}
