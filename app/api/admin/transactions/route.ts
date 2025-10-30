import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.NEON_DATABASE_URL!)

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return Response.json({ message: "Unauthorized" }, { status: 401 })
    }

    const transactions = await sql`
      SELECT 
        t.id,
        t.student_id,
        s.name as student_name,
        t.type,
        t.amount,
        t.description,
        t.balance_after,
        t.created_at
      FROM transactions t
      JOIN students s ON t.student_id = s.id
      ORDER BY t.created_at DESC
    `

    return Response.json(transactions)
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return Response.json({ message: "Internal server error" }, { status: 500 })
  }
}
