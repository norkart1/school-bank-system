import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.NEON_DATABASE_URL!)

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return Response.json({ message: "Unauthorized" }, { status: 401 })
    }

    const result = await sql`
      SELECT 
        COUNT(DISTINCT s.id) as total_students,
        COALESCE(SUM(s.balance), 0) as total_balance,
        COUNT(t.id) as total_transactions
      FROM students s
      LEFT JOIN transactions t ON s.id = t.student_id
    `

    const stats = result[0]
    return Response.json({
      totalStudents: Number.parseInt(stats.total_students),
      totalBalance: Number.parseFloat(stats.total_balance),
      totalTransactions: Number.parseInt(stats.total_transactions),
    })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return Response.json({ message: "Internal server error" }, { status: 500 })
  }
}
