"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import StudentBalance from "@/components/student/student-balance"
import StudentTransactions from "@/components/student/student-transactions"
import StudentTransfer from "@/components/student/student-transfer"

export default function StudentDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("studentToken")
    if (!token) {
      router.push("/student")
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("studentToken")
    localStorage.removeItem("studentId")
    router.push("/student")
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="border-b bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">My Bank Account</h1>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <StudentBalance />

        <Tabs defaultValue="transactions" className="mt-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="transactions">Transaction History</TabsTrigger>
            <TabsTrigger value="transfer">Transfer Money</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="mt-6">
            <StudentTransactions />
          </TabsContent>

          <TabsContent value="transfer" className="mt-6">
            <StudentTransfer />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
