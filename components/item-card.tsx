"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { LostItem, FoundItem } from "@/lib/types"
import { districts, venues } from "@/lib/data"
import { Package, MapPin, Calendar, ImageIcon } from "lucide-react"

interface ItemCardProps {
  item: LostItem | FoundItem
  type: "lost" | "found"
}

export function ItemCard({ item, type }: ItemCardProps) {
  const district = districts.find((d) => d.id === item.districtId)
  const venue = venues.find((v) => v.id === item.venueId)
  const date = "dateLost" in item ? item.dateLost : item.dateFound
  const photos = "photos" in item ? item.photos : undefined

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              {item.itemName}
            </CardTitle>
            <CardDescription className="mt-1">{item.category}</CardDescription>
          </div>
          <Badge variant={item.status === "pending" ? "secondary" : "default"}>{item.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{item.description}</p>

        {photos && photos.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <ImageIcon className="w-4 h-4" />
              <span>Photos ({photos.length})</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {photos.map((photo, index) => (
                <img
                  key={index}
                  src={photo || "/placeholder.svg"}
                  alt={`${item.itemName} photo ${index + 1}`}
                  className="w-20 h-20 object-cover rounded-lg border cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => window.open(photo, "_blank")}
                />
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>
              {venue?.name}, {district?.name}
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{new Date(date).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
