"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function StudentTransfer() {
  const [formData, setFormData] = useState({
    recipient_account: "",
    amount: "",
    description: "",
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setMessage("")
    setLoading(true)

    try {
      const response = await fetch("/api/student/transfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("studentToken")}`,
        },
        body: JSON.stringify({
          recipient_account: formData.recipient_account,
          amount: Number.parseFloat(formData.amount),
          description: formData.description,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Transfer failed")
        return
      }

      setMessage("Transfer successful!")
      setFormData({ recipient_account: "", amount: "", description: "" })
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transfer Money</CardTitle>
        <CardDescription>Send money to another student account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleTransfer} className="space-y-4 max-w-md">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient Account Number</Label>
            <Input
              id="recipient"
              type="text"
              placeholder="Enter recipient account number"
              value={formData.recipient_account}
              onChange={(e) => setFormData({ ...formData, recipient_account: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              type="text"
              placeholder="Transfer reason"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          {error && <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}
          {message && <div className="text-sm text-green-600 bg-green-50 p-2 rounded">{message}</div>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Processing..." : "Send Transfer"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
