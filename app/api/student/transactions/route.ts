import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.NEON_DATABASE_URL!)

function getStudentIdFromToken(token: string): number {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8")
    const [id] = decoded.split(":")
    return Number.parseInt(id)
  } catch {
    return 0
  }
}

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return Response.json({ message: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const studentId = getStudentIdFromToken(token)

    const transactions = await sql`
      SELECT * FROM transactions 
      WHERE student_id = ${studentId}
      ORDER BY created_at DESC
    `

    return Response.json(transactions)
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return Response.json({ message: "Internal server error" }, { status: 500 })
  }
}
