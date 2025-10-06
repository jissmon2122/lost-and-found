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
// import removed: userStorage
import { categories, securityQuestions } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"
import type { District, Venue, FoundItem } from "@/lib/types"
import { Upload, X } from "lucide-react"

interface FoundItemFormProps {
  district: District
  venue: Venue
}

export function FoundItemForm({ district, venue }: FoundItemFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const [itemName, setItemName] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [dateFound, setDateFound] = useState("")
  const [photos, setPhotos] = useState<string[]>([])
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

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    if (photos.length + files.length > 5) {
      toast({
        title: "Too many photos",
        description: "You can upload a maximum of 5 photos",
        variant: "destructive",
      })
      return
    }

    Array.from(files).forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} is larger than 5MB`,
          variant: "destructive",
        })
        return
      }

      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please upload only image files",
          variant: "destructive",
        })
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotos((prev) => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })

    e.target.value = ""
  }

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)


    // Check for JWT token
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    if (selectedQuestions.some((q) => !q) || answers.some((a) => !a.trim())) {
      toast({
        title: "Incomplete security questions",
        description: "Please answer all three security questions",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

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

    // Send found item to backend
    try {
      const res = await fetch("http://localhost:5000/api/found", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          districtId: district.id,
          venueId: venue.id,
          itemName,
          description,
          category,
          dateFound,
          photos: photos.length > 0 ? photos : undefined,
          securityQuestions: selectedQuestions.map((questionId, index) => ({
            questionId,
            answer: answers[index].toLowerCase().trim(),
          })),
        })
      })
      if (!res.ok) throw new Error("Failed to report found item")
      toast({
        title: "Found item reported!",
        description: "We'll notify you if a match is found",
      })
      router.push("/dashboard")
    } catch (err) {
      toast({
        title: "Error",
        description: "Could not report found item. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Report a Found Item</CardTitle>
        <CardDescription>
          Fill in the details about the item you found. Security questions help verify the rightful owner.
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
            <Label htmlFor="dateFound">Date Found *</Label>
            <Input
              id="dateFound"
              type="date"
              value={dateFound}
              onChange={(e) => setDateFound(e.target.value)}
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

          <div className="space-y-3">
            <Label htmlFor="photos">Photos (Optional)</Label>
            <p className="text-sm text-muted-foreground">Upload up to 5 photos of the item (max 5MB each)</p>

            <div className="flex flex-wrap gap-3">
              {photos.map((photo, index) => (
                <div key={index} className="relative group">
                  <img
                    src={photo || "/placeholder.svg"}
                    alt={`Photo ${index + 1}`}
                    className="w-24 h-24 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {photos.length < 5 && (
                <label
                  htmlFor="photos"
                  className="w-24 h-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-secondary/50 transition-colors"
                >
                  <Upload className="w-6 h-6 text-muted-foreground mb-1" />
                  <span className="text-xs text-muted-foreground">Upload</span>
                  <input
                    id="photos"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-base">Security Questions *</Label>
              <p className="text-sm text-muted-foreground mt-1">
                Set three questions that the owner should be able to answer to claim this item
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
                  placeholder="Expected answer"
                  value={answers[index]}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  required
                />
              </div>
            ))}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Report Found Item"}
          </Button>
        </CardContent>
      </form>
    </Card>
  )
}
