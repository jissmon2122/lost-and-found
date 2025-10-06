"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AppHeader } from "@/components/app-header"
import { MatchCard } from "@/components/match-card"
import { ItemCard } from "@/components/item-card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { userStorage } from "@/lib/storage"
import { findMatches, getUserMatches } from "@/lib/matching"
import type { LostItem, FoundItem } from "@/lib/types"
import { Plus, Package } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [lostItems, setLostItems] = useState<LostItem[]>([])
  const [foundItems, setFoundItems] = useState<FoundItem[]>([])
  const [matches, setMatches] = useState<{
    lostItemMatches: Array<{ match: any; lostItem: LostItem; foundItem: FoundItem }>
    foundItemMatches: Array<{ match: any; lostItem: LostItem; foundItem: FoundItem }>
  }>({ lostItemMatches: [], foundItemMatches: [] })

  useEffect(() => {
    const currentUser = userStorage.getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }

    // Fetch lost and found items from backend
    const fetchItems = async () => {
      try {
        const token = localStorage.getItem("token")
        const headers: HeadersInit = {}
        if (token) headers["Authorization"] = `Bearer ${token}`
        const [lostRes, foundRes] = await Promise.all([
          fetch("http://localhost:5000/api/lost", { headers }),
          fetch("http://localhost:5000/api/found", { headers })
        ])
        const lostData = await lostRes.json()
        const foundData = await foundRes.json()
        setLostItems(lostData)
        setFoundItems(foundData)
        // TODO: fetch and set matches from backend if implemented
      } catch (err) {
        // handle error
      } finally {
        setIsLoading(false)
      }
    }
    fetchItems()
  }, [router])

  if (isLoading) {
    return null
  }

  const totalMatches = matches.lostItemMatches.length + matches.foundItemMatches.length

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground mt-1">Manage your lost and found items</p>
            </div>
            <Link href="/districts">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Report Item
              </Button>
            </Link>
          </div>

          {totalMatches > 0 && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Matches Found ({totalMatches})
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {matches.lostItemMatches.map((item) => (
                  <MatchCard
                    key={item.match.id}
                    match={item.match}
                    lostItem={item.lostItem}
                    foundItem={item.foundItem}
                    type="lost"
                  />
                ))}
                {matches.foundItemMatches.map((item) => (
                  <MatchCard
                    key={item.match.id}
                    match={item.match}
                    lostItem={item.lostItem}
                    foundItem={item.foundItem}
                    type="found"
                  />
                ))}
              </div>
            </div>
          )}

          <Tabs defaultValue="lost" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="lost">Lost Items ({lostItems.length})</TabsTrigger>
              <TabsTrigger value="found">Found Items ({foundItems.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="lost" className="mt-6">
              {lostItems.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">You haven't reported any lost items yet</p>
                  <Link href="/districts">
                    <Button>Report Lost Item</Button>
                  </Link>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {lostItems.map((item) => (
                    <ItemCard key={item.id} item={item} type="lost" />
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="found" className="mt-6">
              {foundItems.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">You haven't reported any found items yet</p>
                  <Link href="/districts">
                    <Button>Report Found Item</Button>
                  </Link>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {foundItems.map((item) => (
                    <ItemCard key={item.id} item={item} type="found" />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
