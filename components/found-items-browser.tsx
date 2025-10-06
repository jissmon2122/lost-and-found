"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ClaimItemDialog } from "@/components/claim-item-dialog"
// import removed: foundItemStorage
import { categories } from "@/lib/data"
import type { FoundItem, District, Venue } from "@/lib/types"
import { Calendar, MapPin, Search, Package } from "lucide-react"

interface FoundItemsBrowserProps {
  district: District
  venue: Venue
}

export function FoundItemsBrowser({ district, venue }: FoundItemsBrowserProps) {
  const [foundItems, setFoundItems] = useState<FoundItem[]>([])
  const [filteredItems, setFilteredItems] = useState<FoundItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [selectedItem, setSelectedItem] = useState<FoundItem | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    // Fetch found items for this venue from backend
    const fetchFoundItems = async () => {
      try {
        const token = localStorage.getItem("token")
        const headers: HeadersInit = {}
        if (token) headers["Authorization"] = `Bearer ${token}`
        const res = await fetch(`http://localhost:5000/api/found?districtId=${district.id}&venueId=${venue.id}`, { headers })
        const data = await res.json()
        setFoundItems(data)
        setFilteredItems(data)
      } catch (err) {
        setFoundItems([])
        setFilteredItems([])
      }
    }
    fetchFoundItems()
  }, [district.id, venue.id])

  useEffect(() => {
    let filtered = foundItems

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by category
    if (categoryFilter !== "all") {
      filtered = filtered.filter((item) => item.category === categoryFilter)
    }

    setFilteredItems(filtered)
  }, [searchQuery, categoryFilter, foundItems])

  const handleClaimItem = (item: FoundItem) => {
    setSelectedItem(item)
    setDialogOpen(true)
  }

  return (
    <>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Browse Found Items</CardTitle>
          <CardDescription>
            Click on an item you think is yours to answer security questions and get the finder's contact details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by item name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Found Items List */}
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No found items yet</p>
              <p className="text-sm mt-1">
                {foundItems.length === 0
                  ? "No items have been reported found at this location"
                  : "Try adjusting your search filters"}
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredItems.map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Photos */}
                      {item.photos && item.photos.length > 0 && (
                        <div className="flex gap-2 sm:w-32 flex-shrink-0">
                          <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-secondary">
                            <img
                              src={item.photos[0] || "/placeholder.svg"}
                              alt={item.itemName}
                              className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={() => window.open(item.photos![0], "_blank")}
                            />
                            {item.photos.length > 1 && (
                              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                +{item.photos.length - 1}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Item Details */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-lg">{item.itemName}</h3>
                          <Badge variant="secondary">{item.category}</Badge>
                        </div>

                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{item.description}</p>

                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-2">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>Found: {new Date(item.dateFound).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{venue.name}</span>
                          </div>
                        </div>

                        <div className="pt-3">
                          <Button onClick={() => handleClaimItem(item)} size="sm" className="w-full sm:w-auto">
                            This is My Item
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <ClaimItemDialog item={selectedItem} open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  )
}
