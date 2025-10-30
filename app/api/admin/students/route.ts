import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return Response.json({ message: "Unauthorized" }, { status: 401 })
    }

    const students = await sql`SELECT * FROM students ORDER BY created_at DESC`
    return Response.json(students)
  } catch (error) {
    console.error("Error fetching students:", error)
    return Response.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return Response.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { name, email, student_id } = await request.json()

    // Generate unique account number
    const accountNumber = `ACC${Date.now()}`

    const result = await sql`
      INSERT INTO students (name, email, student_id, account_number, balance)
      VALUES (${name}, ${email}, ${student_id}, ${accountNumber}, 0)
      RETURNING *
    `

    return Response.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating student:", error)
    return Response.json({ message: "Failed to create student" }, { status: 500 })
  }
}
