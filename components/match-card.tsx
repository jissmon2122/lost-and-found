import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { LostItem, FoundItem, Match } from "@/lib/types"
import { userStorage } from "@/lib/storage"
import { districts, venues } from "@/lib/data"
import { CheckCircle, Phone, Mail } from "lucide-react"

interface MatchCardProps {
  match: Match
  lostItem: LostItem
  foundItem: FoundItem
  type: "lost" | "found"
}

export function MatchCard({ match, lostItem, foundItem, type }: MatchCardProps) {
  const otherUserId = type === "lost" ? foundItem.userId : lostItem.userId
  const otherUser = userStorage.getAll().find((u) => u.id === otherUserId)
  const item = type === "lost" ? lostItem : foundItem
  const district = districts.find((d) => d.id === item.districtId)
  const venue = venues.find((v) => v.id === item.venueId)

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              {item.itemName}
            </CardTitle>
            <CardDescription className="mt-1">
              {type === "lost" ? "Someone found your item!" : "This matches a lost item!"}
            </CardDescription>
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {Math.round(match.matchScore)}% Match
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium">Item Details</p>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>
              <span className="font-medium text-foreground">Category:</span> {item.category}
            </p>
            <p>
              <span className="font-medium text-foreground">Location:</span> {venue?.name}, {district?.name}
            </p>
            <p>
              <span className="font-medium text-foreground">Date:</span>{" "}
              {new Date(type === "lost" ? lostItem.dateLost : foundItem.dateFound).toLocaleDateString()}
            </p>
            <p>
              <span className="font-medium text-foreground">Description:</span> {item.description}
            </p>
          </div>
        </div>

        {otherUser && (
          <div className="space-y-3 pt-4 border-t">
            <p className="text-sm font-medium">Contact Information</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <a href={`mailto:${otherUser.email}`} className="text-primary hover:underline">
                  {otherUser.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <a href={`tel:${otherUser.phone}`} className="text-primary hover:underline">
                  {otherUser.phone}
                </a>
              </div>
            </div>
            <Button className="w-full mt-2" asChild>
              <a href={`mailto:${otherUser.email}`}>Send Email</a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
