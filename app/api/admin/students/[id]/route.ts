import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return Response.json({ message: "Unauthorized" }, { status: 401 })
    }

    await sql`DELETE FROM students WHERE id = ${Number.parseInt(params.id)}`
    return Response.json({ message: "Student deleted" })
  } catch (error) {
    console.error("Error deleting student:", error)
    return Response.json({ message: "Internal server error" }, { status: 500 })
  }
}
