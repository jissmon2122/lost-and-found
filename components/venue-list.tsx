"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { Venue } from "@/lib/types"
import { Building2, MapPin } from "lucide-react"

interface VenueListProps {
  venues: Venue[]
  onSelectVenue: (venue: Venue) => void
}

export function VenueList({ venues, onSelectVenue }: VenueListProps) {
  if (venues.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No venues available for this district</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        {venues.length} venue{venues.length !== 1 ? "s" : ""} available
      </p>
      <div className="grid gap-3">
        {venues.map((venue) => (
          <Card
            key={venue.id}
            className="cursor-pointer hover:border-primary hover:shadow-md transition-all"
            onClick={() => onSelectVenue(venue)}
          >
            <CardContent className="p-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Building2 className="w-5 h-5 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg mb-1">{venue.name}</h3>
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{venue.address}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
