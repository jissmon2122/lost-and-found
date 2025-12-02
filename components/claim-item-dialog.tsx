"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { API_BASE_URL } from "@/lib/api"
// import removed: userStorage
import type { FoundItem } from "@/lib/types"
import { securityQuestions } from "@/lib/data"
import { CheckCircle2, XCircle, Phone, Mail, User } from "lucide-react"

interface ClaimItemDialogProps {
  item: FoundItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ClaimItemDialog({ item, open, onOpenChange }: ClaimItemDialogProps) {
  const { toast } = useToast()
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState<{
    success: boolean
    matchScore: number
    finderInfo?: { name: string; email: string; phone: string }
  } | null>(null)

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleVerify = async () => {
    if (!item) return

    setIsVerifying(true)

    // Check if all questions are answered
    const allAnswered = item.securityQuestions.every((sq) => answers[sq.questionId]?.trim())

    if (!allAnswered) {
      toast({
        title: "Missing Answers",
        description: "Please answer all security questions",
        variant: "destructive",
      })
      setIsVerifying(false)
      return
    }

    // Calculate match score
    let correctAnswers = 0
    item.securityQuestions.forEach((sq) => {
      const userAnswer = answers[sq.questionId]?.trim().toLowerCase()
      const correctAnswer = sq.answer.trim().toLowerCase()
      if (userAnswer === correctAnswer) {
        correctAnswers++
      }
    })

    const matchScore = (correctAnswers / item.securityQuestions.length) * 100

    // Need at least 67% match (2 out of 3 questions correct)
    if (matchScore >= 67) {
      // Fetch finder's information from backend
      try {
        const res = await fetch(`${API_BASE_URL}/api/user/${item.userId}`)
        const finder = await res.json()
        if (res.ok && finder) {
          setVerificationResult({
            success: true,
            matchScore,
            finderInfo: {
              name: finder.name || finder.username || 'Unknown',
              email: finder.email || 'N/A',
              phone: finder.phone || 'N/A',
            },
          })
          toast({
            title: "Verification Successful!",
            description: "Your answers match! Here are the finder's contact details.",
          })
        } else {
          setVerificationResult({ success: true, matchScore })
        }
      } catch {
        setVerificationResult({ success: true, matchScore })
      }
    } else {
      setVerificationResult({
        success: false,
        matchScore,
      })
      toast({
        title: "Verification Failed",
        description: "Your answers don't match the security questions. This might not be your item.",
        variant: "destructive",
      })
    }

    setIsVerifying(false)
  }

  const handleClose = () => {
    setAnswers({})
    setVerificationResult(null)
    onOpenChange(false)
  }

  if (!item) return null

  const getQuestionText = (questionId: string) => {
    return securityQuestions.find((q) => q.id === questionId)?.question || ""
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Claim Item: {item.itemName}</DialogTitle>
          <DialogDescription>
            Answer the security questions to verify this is your item. You need to answer at least 2 out of 3 questions
            correctly.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Item Details */}
          <Card>
            <CardContent className="pt-6 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{item.itemName}</h3>
                  <Badge variant="secondary" className="mt-1">
                    {item.category}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              <p className="text-sm text-muted-foreground">Found on: {new Date(item.dateFound).toLocaleDateString()}</p>

              {/* Photos */}
              {item.photos && item.photos.length > 0 && (
                <div className="flex gap-2 flex-wrap pt-2">
                  {item.photos.map((photo, index) => (
                    <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden bg-secondary">
                      <img
                        src={photo || "/placeholder.svg"}
                        alt={`${item.itemName} ${index + 1}`}
                        className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => window.open(photo, "_blank")}
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {!verificationResult ? (
            <>
              {/* Security Questions */}
              <div className="space-y-4">
                <h3 className="font-semibold">Security Questions</h3>
                <p className="text-sm text-muted-foreground">
                  The person who found this item set up these questions. Answer them to prove ownership.
                </p>

                {item.securityQuestions.map((sq, index) => (
                  <div key={sq.questionId} className="space-y-2">
                    <Label htmlFor={`answer-${index}`}>
                      Question {index + 1}: {getQuestionText(sq.questionId)}
                    </Label>
                    <Input
                      id={`answer-${index}`}
                      placeholder="Your answer"
                      value={answers[sq.questionId] || ""}
                      onChange={(e) => handleAnswerChange(sq.questionId, e.target.value)}
                    />
                  </div>
                ))}
              </div>

              <Button onClick={handleVerify} disabled={isVerifying} className="w-full">
                {isVerifying ? "Verifying..." : "Verify & Get Contact Details"}
              </Button>
            </>
          ) : (
            <>
              {/* Verification Result */}
              {verificationResult.success ? (
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-center gap-2 text-green-700">
                      <CheckCircle2 className="w-6 h-6" />
                      <h3 className="font-semibold text-lg">Verification Successful!</h3>
                    </div>
                    <p className="text-sm text-green-700">
                      Your answers matched {verificationResult.matchScore.toFixed(0)}% of the security questions.
                    </p>

                    {verificationResult.finderInfo && (
                      <div className="space-y-3 pt-4 border-t border-green-200">
                        <h4 className="font-semibold text-green-900">Finder's Contact Information:</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <User className="w-4 h-4 text-green-600" />
                            <span className="font-medium">Name:</span>
                            <span>{verificationResult.finderInfo.name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-4 h-4 text-green-600" />
                            <span className="font-medium">Email:</span>
                            <a
                              href={`mailto:${verificationResult.finderInfo.email}`}
                              className="text-blue-600 hover:underline"
                            >
                              {verificationResult.finderInfo.email}
                            </a>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-4 h-4 text-green-600" />
                            <span className="font-medium">Phone:</span>
                            <a
                              href={`tel:${verificationResult.finderInfo.phone}`}
                              className="text-blue-600 hover:underline"
                            >
                              {verificationResult.finderInfo.phone}
                            </a>
                          </div>
                        </div>
                        <p className="text-sm text-green-700 pt-2">
                          Please contact the finder to arrange pickup of your item.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-center gap-2 text-red-700">
                      <XCircle className="w-6 h-6" />
                      <h3 className="font-semibold text-lg">Verification Failed</h3>
                    </div>
                    <p className="text-sm text-red-700">
                      Your answers matched only {verificationResult.matchScore.toFixed(0)}% of the security questions.
                      You need at least 67% to verify ownership.
                    </p>
                    <p className="text-sm text-red-700">
                      This might not be your item, or you may have answered incorrectly. Please try again or look for
                      other found items.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setVerificationResult(null)
                        setAnswers({})
                      }}
                      className="w-full"
                    >
                      Try Again
                    </Button>
                  </CardContent>
                </Card>
              )}

              <Button variant="outline" onClick={handleClose} className="w-full bg-transparent">
                Close
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
