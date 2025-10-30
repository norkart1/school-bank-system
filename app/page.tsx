"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function Home() {
  const router = useRouter()
  const [migrationDone, setMigrationDone] = useState(false)

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const migrationResponse = await fetch("/api/migrate")
        const migrationData = await migrationResponse.json()

        if (!migrationData.success) {
          console.error("[v0] Migration failed:", migrationData.error)
        } else {
          console.log("[v0] Migration successful")
        }
      } catch (error) {
        console.error("[v0] Migration error:", error)
      }

      setMigrationDone(true)
    }

    initializeApp()
  }, [])

  useEffect(() => {
    if (!migrationDone) return

    const token = localStorage.getItem("adminToken")
    if (token) {
      router.push("/admin/dashboard")
    } else {
      router.push("/admin/login")
    }
  }, [migrationDone, router])

  return null
}
