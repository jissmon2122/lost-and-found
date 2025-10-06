import { lostItemStorage, foundItemStorage, matchStorage } from "./storage"
import type { LostItem, FoundItem, Match } from "./types"

export function calculateMatchScore(lostItem: LostItem, foundItem: FoundItem): number {
  let score = 0
  let totalQuestions = 0

  // Check if items are in the same location
  if (lostItem.districtId !== foundItem.districtId || lostItem.venueId !== foundItem.venueId) {
    return 0
  }

  // Check if categories match
  if (lostItem.category !== foundItem.category) {
    return 0
  }

  // Compare security question answers
  lostItem.securityQuestions.forEach((lostQ) => {
    const foundQ = foundItem.securityQuestions.find((fq) => fq.questionId === lostQ.questionId)
    if (foundQ) {
      totalQuestions++
      if (lostQ.answer === foundQ.answer) {
        score++
      }
    }
  })

  // Return percentage match (need at least 2 out of 3 matching answers)
  const matchPercentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0
  return matchPercentage >= 67 ? matchPercentage : 0
}

export function findMatches(userId: string): Match[] {
  const allLostItems = lostItemStorage.getAll()
  const allFoundItems = foundItemStorage.getAll()
  const existingMatches = matchStorage.getAll()
  const newMatches: Match[] = []

  // Find matches for user's lost items
  const userLostItems = allLostItems.filter((item) => item.userId === userId && item.status === "pending")

  userLostItems.forEach((lostItem) => {
    allFoundItems.forEach((foundItem) => {
      if (foundItem.status === "pending") {
        const matchScore = calculateMatchScore(lostItem, foundItem)
        if (matchScore >= 67) {
          // Check if match already exists
          const matchExists = existingMatches.some(
            (m) => m.lostItemId === lostItem.id && m.foundItemId === foundItem.id,
          )

          if (!matchExists) {
            // Get contact details
            const finderContact = foundItem.userId
            const claimerContact = lostItem.userId

            const match: Match = {
              id: Date.now().toString() + Math.random(),
              lostItemId: lostItem.id,
              foundItemId: foundItem.id,
              matchScore,
              finderContact,
              claimerContact,
              createdAt: new Date().toISOString(),
            }

            matchStorage.add(match)
            newMatches.push(match)
          }
        }
      }
    })
  })

  // Find matches for user's found items
  const userFoundItems = allFoundItems.filter((item) => item.userId === userId && item.status === "pending")

  userFoundItems.forEach((foundItem) => {
    allLostItems.forEach((lostItem) => {
      if (lostItem.status === "pending") {
        const matchScore = calculateMatchScore(lostItem, foundItem)
        if (matchScore >= 67) {
          // Check if match already exists
          const matchExists = existingMatches.some(
            (m) => m.lostItemId === lostItem.id && m.foundItemId === foundItem.id,
          )

          if (!matchExists) {
            const finderContact = foundItem.userId
            const claimerContact = lostItem.userId

            const match: Match = {
              id: Date.now().toString() + Math.random(),
              lostItemId: lostItem.id,
              foundItemId: foundItem.id,
              matchScore,
              finderContact,
              claimerContact,
              createdAt: new Date().toISOString(),
            }

            matchStorage.add(match)
            newMatches.push(match)
          }
        }
      }
    })
  })

  return newMatches
}

export function getUserMatches(userId: string): {
  lostItemMatches: Array<{ match: Match; lostItem: LostItem; foundItem: FoundItem }>
  foundItemMatches: Array<{ match: Match; lostItem: LostItem; foundItem: FoundItem }>
} {
  const allMatches = matchStorage.getAll()
  const allLostItems = lostItemStorage.getAll()
  const allFoundItems = foundItemStorage.getAll()

  const lostItemMatches = allMatches
    .map((match) => {
      const lostItem = allLostItems.find((item) => item.id === match.lostItemId)
      const foundItem = allFoundItems.find((item) => item.id === match.foundItemId)

      if (lostItem && foundItem && lostItem.userId === userId) {
        return { match, lostItem, foundItem }
      }
      return null
    })
    .filter((item): item is { match: Match; lostItem: LostItem; foundItem: FoundItem } => item !== null)

  const foundItemMatches = allMatches
    .map((match) => {
      const lostItem = allLostItems.find((item) => item.id === match.lostItemId)
      const foundItem = allFoundItems.find((item) => item.id === match.foundItemId)

      if (lostItem && foundItem && foundItem.userId === userId) {
        return { match, lostItem, foundItem }
      }
      return null
    })
    .filter((item): item is { match: Match; lostItem: LostItem; foundItem: FoundItem } => item !== null)

  return { lostItemMatches, foundItemMatches }
}
