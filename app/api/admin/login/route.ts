import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.NEON_DATABASE_URL!)

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    // Simple authentication - in production, use proper password hashing
    if (username === "admin" && password === "12345") {
      const token = Buffer.from(`${username}:${password}`).toString("base64")
      return Response.json({ token, message: "Login successful" })
    }

    return Response.json({ message: "Invalid credentials" }, { status: 401 })
  } catch (error) {
    return Response.json({ message: "Internal server error" }, { status: 500 })
  }
}
