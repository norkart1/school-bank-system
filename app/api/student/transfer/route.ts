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

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return Response.json({ message: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const senderId = getStudentIdFromToken(token)
    const { recipient_account, amount, description } = await request.json()

    // Get sender's current balance
    const senderResult = await sql`SELECT balance FROM students WHERE id = ${senderId}`
    if (senderResult.length === 0) {
      return Response.json({ message: "Sender not found" }, { status: 404 })
    }

    const senderBalance = Number.parseFloat(senderResult[0].balance)
    if (senderBalance < amount) {
      return Response.json({ message: "Insufficient balance" }, { status: 400 })
    }

    // Get recipient
    const recipientResult = await sql`SELECT id FROM students WHERE account_number = ${recipient_account}`
    if (recipientResult.length === 0) {
      return Response.json({ message: "Recipient account not found" }, { status: 404 })
    }

    const recipientId = recipientResult[0].id

    // Update sender balance
    const newSenderBalance = senderBalance - amount
    await sql`UPDATE students SET balance = ${newSenderBalance} WHERE id = ${senderId}`

    // Record sender transaction
    await sql`
      INSERT INTO transactions (student_id, type, amount, description, balance_after)
      VALUES (${senderId}, 'withdrawal', ${amount}, ${description || "Transfer to " + recipient_account}, ${newSenderBalance})
    `

    // Get recipient's current balance
    const recipientBalanceResult = await sql`SELECT balance FROM students WHERE id = ${recipientId}`
    const recipientBalance = Number.parseFloat(recipientBalanceResult[0].balance)
    const newRecipientBalance = recipientBalance + amount

    // Update recipient balance
    await sql`UPDATE students SET balance = ${newRecipientBalance} WHERE id = ${recipientId}`

    // Record recipient transaction
    await sql`
      INSERT INTO transactions (student_id, type, amount, description, balance_after)
      VALUES (${recipientId}, 'deposit', ${amount}, ${description || "Transfer from " + senderId}, ${newRecipientBalance})
    `

    return Response.json({ message: "Transfer successful" })
  } catch (error) {
    console.error("Error processing transfer:", error)
    return Response.json({ message: "Internal server error" }, { status: 500 })
  }
}
