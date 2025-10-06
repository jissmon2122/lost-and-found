"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { userStorage } from "@/lib/storage"
import { categories, securityQuestions } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"
import type { District, Venue, LostItem } from "@/lib/types"

interface LostItemFormProps {
  district: District
  venue: Venue
}

export function LostItemForm({ district, venue }: LostItemFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const [itemName, setItemName] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [dateLost, setDateLost] = useState("")
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>(["", "", ""])
  const [answers, setAnswers] = useState<string[]>(["", "", ""])

  const handleQuestionChange = (index: number, questionId: string) => {
    const newQuestions = [...selectedQuestions]
    newQuestions[index] = questionId
    setSelectedQuestions(newQuestions)
  }

  const handleAnswerChange = (index: number, answer: string) => {
    const newAnswers = [...answers]
    newAnswers[index] = answer
    setAnswers(newAnswers)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const currentUser = userStorage.getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }

    // Validate all questions are selected and answered
    if (selectedQuestions.some((q) => !q) || answers.some((a) => !a.trim())) {
      toast({
        title: "Incomplete security questions",
        description: "Please answer all three security questions",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    // Check for duplicate questions
    const uniqueQuestions = new Set(selectedQuestions)
    if (uniqueQuestions.size !== selectedQuestions.length) {
      toast({
        title: "Duplicate questions",
        description: "Please select three different security questions",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    // Send lost item to backend
    try {
      const token = localStorage.getItem("token")
      const res = await fetch("http://localhost:5000/api/lost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          userId: currentUser.id,
          districtId: district.id,
          venueId: venue.id,
          itemName,
          description,
          category,
          dateLost,
          securityQuestions: selectedQuestions.map((questionId, index) => ({
            questionId,
            answer: answers[index].toLowerCase().trim(),
          })),
        })
      })
      if (!res.ok) throw new Error("Failed to report lost item")
      toast({
        title: "Lost item reported!",
        description: "We'll notify you if a match is found",
      })
      router.push("/dashboard")
    } catch (err) {
      toast({
        title: "Error",
        description: "Could not report lost item. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Report a Lost Item</CardTitle>
        <CardDescription>
          Fill in the details about the item you lost. Security questions help verify ownership.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="itemName">Item Name *</Label>
            <Input
              id="itemName"
              placeholder="e.g., Black Leather Wallet"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateLost">Date Lost *</Label>
            <Input
              id="dateLost"
              type="date"
              value={dateLost}
              onChange={(e) => setDateLost(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Provide additional details about the item..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
            />
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-base">Security Questions *</Label>
              <p className="text-sm text-muted-foreground mt-1">
                Answer three questions to help verify ownership when someone finds your item
              </p>
            </div>

            {[0, 1, 2].map((index) => (
              <div key={index} className="space-y-3 p-4 border rounded-lg bg-secondary/20">
                <Label>Question {index + 1}</Label>
                <Select
                  value={selectedQuestions[index]}
                  onValueChange={(value) => handleQuestionChange(index, value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a question" />
                  </SelectTrigger>
                  <SelectContent>
                    {securityQuestions.map((q) => (
                      <SelectItem key={q.id} value={q.id} disabled={selectedQuestions.includes(q.id)}>
                        {q.question}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Your answer"
                  value={answers[index]}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  required
                />
              </div>
            ))}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Report Lost Item"}
          </Button>
        </CardContent>
      </form>
    </Card>
  )
}
