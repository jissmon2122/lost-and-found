import type { District, Venue, SecurityQuestion } from "./types"

export const districts: District[] = [
  { id: "1", name: "Mumbai", state: "Maharashtra" },
  { id: "2", name: "Delhi", state: "Delhi" },
  { id: "3", name: "Bangalore", state: "Karnataka" },
  { id: "4", name: "Hyderabad", state: "Telangana" },
  { id: "5", name: "Chennai", state: "Tamil Nadu" },
  { id: "6", name: "Kolkata", state: "West Bengal" },
  { id: "7", name: "Pune", state: "Maharashtra" },
  { id: "8", name: "Ahmedabad", state: "Gujarat" },
  { id: "9", name: "Jaipur", state: "Rajasthan" },
  { id: "10", name: "Lucknow", state: "Uttar Pradesh" },
]

export const venues: Venue[] = [
  // Mumbai venues
  { id: "1", name: "Gateway of India", address: "Apollo Bandar, Colaba", districtId: "1" },
  { id: "2", name: "Marine Drive", address: "Netaji Subhash Chandra Bose Road", districtId: "1" },
  { id: "3", name: "Juhu Beach", address: "Juhu Tara Road", districtId: "1" },

  // Delhi venues
  { id: "4", name: "India Gate", address: "Rajpath", districtId: "2" },
  { id: "5", name: "Red Fort", address: "Netaji Subhash Marg", districtId: "2" },
  { id: "6", name: "Qutub Minar", address: "Mehrauli", districtId: "2" },

  // Bangalore venues
  { id: "7", name: "Lalbagh Botanical Garden", address: "Mavalli", districtId: "3" },
  { id: "8", name: "Cubbon Park", address: "Kasturba Road", districtId: "3" },
  { id: "9", name: "Bangalore Palace", address: "Vasanth Nagar", districtId: "3" },

  // Hyderabad venues
  { id: "10", name: "Charminar", address: "Charminar Road", districtId: "4" },
  { id: "11", name: "Hussain Sagar Lake", address: "Tank Bund Road", districtId: "4" },

  // Chennai venues
  { id: "12", name: "Marina Beach", address: "Kamarajar Salai", districtId: "5" },
  { id: "13", name: "Kapaleeshwarar Temple", address: "Mylapore", districtId: "5" },

  // Kolkata venues
  { id: "14", name: "Victoria Memorial", address: "Queens Way", districtId: "6" },
  { id: "15", name: "Howrah Bridge", address: "Jagannath Ghat", districtId: "6" },
]

export const securityQuestions: SecurityQuestion[] = [
  { id: "1", question: "What color is the item?" },
  { id: "2", question: "What brand is the item?" },
  { id: "3", question: "What is the approximate size of the item?" },
  { id: "4", question: "Are there any unique markings or identifiers?" },
  { id: "5", question: "What material is the item made of?" },
  { id: "6", question: "What was inside the item (if applicable)?" },
]

export const categories = [
  "Electronics",
  "Bags & Luggage",
  "Wallets & Purses",
  "Jewelry",
  "Documents",
  "Keys",
  "Clothing",
  "Books",
  "Sports Equipment",
  "Other",
]
