"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StudentInfo {
  name: string
  email: string
  student_id: string
  account_number: string
  balance: number
}

export default function StudentBalance() {
  const [student, setStudent] = useState<StudentInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStudentInfo = async () => {
      try {
        const response = await fetch("/api/student/info", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("studentToken")}`,
          },
        })
        const data = await response.json()
        setStudent(data)
      } catch (error) {
        console.error("Failed to fetch student info:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStudentInfo()
  }, [])

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  if (!student) {
    return <div className="text-center py-8 text-red-600">Failed to load account information</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Account Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-green-600">${student.balance.toFixed(2)}</div>
          <p className="text-xs text-gray-500 mt-2">Available balance</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Account Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div>
            <span className="text-gray-600">Name:</span>
            <span className="font-medium ml-2">{student.name}</span>
          </div>
          <div>
            <span className="text-gray-600">Account Number:</span>
            <span className="font-medium ml-2">{student.account_number}</span>
          </div>
          <div>
            <span className="text-gray-600">Student ID:</span>
            <span className="font-medium ml-2">{student.student_id}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
