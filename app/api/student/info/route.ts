import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

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

    const result = await sql`SELECT * FROM students WHERE id = ${studentId}`

    if (result.length === 0) {
      return Response.json({ message: "Student not found" }, { status: 404 })
    }

    return Response.json(result[0])
  } catch (error) {
    console.error("Error fetching student info:", error)
    return Response.json({ message: "Internal server error" }, { status: 500 })
  }
}
