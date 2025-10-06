"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { districts } from "@/lib/data"
import type { District } from "@/lib/types"
import { Search, MapPin } from "lucide-react"

interface DistrictSearchProps {
  onSelectDistrict: (district: District) => void
}

export function DistrictSearch({ onSelectDistrict }: DistrictSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredDistricts = useMemo(() => {
    if (!searchQuery.trim()) {
      return districts
    }

    const query = searchQuery.toLowerCase()
    return districts.filter(
      (district) => district.name.toLowerCase().includes(query) || district.state.toLowerCase().includes(query),
    )
  }, [searchQuery])

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="search">Search for your district</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="search"
            type="text"
            placeholder="Type district or state name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-3">
        {filteredDistricts.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">No districts found matching "{searchQuery}"</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              {filteredDistricts.length} district{filteredDistricts.length !== 1 ? "s" : ""} found
            </p>
            <div className="grid gap-3 max-h-[500px] overflow-y-auto pr-2">
              {filteredDistricts.map((district) => (
                <Card
                  key={district.id}
                  className="cursor-pointer hover:border-primary hover:shadow-md transition-all"
                  onClick={() => onSelectDistrict(district)}
                >
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg">{district.name}</h3>
                      <p className="text-sm text-muted-foreground">{district.state}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
