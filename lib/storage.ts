import type { User, LostItem, FoundItem, Match } from "./types"

// Generic storage utilities
export const storage = {
  get: (key: string): any | null => {
    if (typeof window === "undefined") return null
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  },
  set: (key: string, value: any): void => {
    if (typeof window === "undefined") return
    localStorage.setItem(key, JSON.stringify(value))
  },
  remove: (key: string): void => {
    if (typeof window === "undefined") return
    localStorage.removeItem(key)
  },
}

// User management
export const userStorage = {
  getAll: (): User[] => storage.get("users") || [],
  add: (user: User): void => {
    const users = userStorage.getAll()
    users.push(user)
    storage.set("users", users)
  },
  findByEmail: (email: string): User | undefined => {
    return userStorage.getAll().find((u) => u.email === email)
  },
  getCurrentUser: (): User | null => storage.get("currentUser"),
  setCurrentUser: (user: User | null): void => {
    if (user) {
      storage.set("currentUser", user)
    } else {
      storage.remove("currentUser")
    }
  },
}

// Lost items management
export const lostItemStorage = {
  getAll: (): LostItem[] => storage.get("lostItems") || [],
  add: (item: LostItem): void => {
    const items = lostItemStorage.getAll()
    items.push(item)
    storage.set("lostItems", items)
  },
  getByUser: (userId: string): LostItem[] => {
    return lostItemStorage.getAll().filter((item) => item.userId === userId)
  },
}

// Found items management
export const foundItemStorage = {
  getAll: (): FoundItem[] => storage.get("foundItems") || [],
  add: (item: FoundItem): void => {
    const items = foundItemStorage.getAll()
    items.push(item)
    storage.set("foundItems", items)
  },
  getByUser: (userId: string): FoundItem[] => {
    return foundItemStorage.getAll().filter((item) => item.userId === userId)
  },
}

// Match management
export const matchStorage = {
  getAll: (): Match[] => storage.get("matches") || [],
  add: (match: Match): void => {
    const matches = matchStorage.getAll()
    matches.push(match)
    storage.set("matches", matches)
  },
}
