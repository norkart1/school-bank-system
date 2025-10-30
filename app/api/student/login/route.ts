import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: Request) {
  try {
    const { account_number } = await request.json()

    const result = await sql`SELECT * FROM students WHERE account_number = ${account_number}`

    if (result.length === 0) {
      return Response.json({ message: "Account not found" }, { status: 404 })
    }

    const student = result[0]
    const token = Buffer.from(`${student.id}:${account_number}`).toString("base64")

    return Response.json({
      token,
      student_id: student.id,
      message: "Login successful",
    })
  } catch (error) {
    console.error("Error during login:", error)
    return Response.json({ message: "Internal server error" }, { status: 500 })
  }
}
