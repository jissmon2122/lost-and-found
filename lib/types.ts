export interface User {
  id: string
  email: string
  password: string
  name: string
  phone: string
  createdAt: string
}

export interface District {
  id: string
  name: string
  state: string
}

export interface Venue {
  id: string
  name: string
  address: string
  districtId: string
}

export interface SecurityQuestion {
  id: string
  question: string
}

export interface LostItem {
  id: string
  userId: string
  districtId: string
  venueId: string
  itemName: string
  description: string
  category: string
  dateLost: string
  securityQuestions: {
    questionId: string
    answer: string
  }[]
  status: "pending" | "matched" | "claimed"
  createdAt: string
}

export interface FoundItem {
  id: string
  userId: string
  districtId: string
  venueId: string
  itemName: string
  description: string
  category: string
  dateFound: string
  photos?: string[]
  securityQuestions: {
    questionId: string
    answer: string
  }[]
  status: "pending" | "matched" | "returned"
  createdAt: string
}

export interface Match {
  id: string
  lostItemId: string
  foundItemId: string
  matchScore: number
  finderContact: string
  claimerContact: string
  createdAt: string
}
