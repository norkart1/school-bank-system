import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    const result = await sql`SELECT * FROM admin WHERE username = ${username}`
    
    if (result.length === 0) {
      return Response.json({ message: "Invalid credentials" }, { status: 401 })
    }

    const admin = result[0]
    const isValidPassword = await bcrypt.compare(password, admin.password_hash)

    if (!isValidPassword) {
      return Response.json({ message: "Invalid credentials" }, { status: 401 })
    }

    const token = Buffer.from(`${username}:${admin.id}`).toString("base64")
    return Response.json({ token, message: "Login successful" })
  } catch (error) {
    console.error("Error during admin login:", error)
    return Response.json({ message: "Internal server error" }, { status: 500 })
  }
}
