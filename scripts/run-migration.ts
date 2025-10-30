import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"

const sql = neon(process.env.NEON_DATABASE_URL!)

async function runMigration() {
  try {
    console.log("[v0] Starting database migration...")

    // Create students table
    await sql`
      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        student_id VARCHAR(50) UNIQUE NOT NULL,
        account_number VARCHAR(20) UNIQUE NOT NULL,
        balance DECIMAL(10, 2) DEFAULT 0.00,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log("[v0] Created students table")

    // Create transactions table
    await sql`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        description VARCHAR(255),
        balance_after DECIMAL(10, 2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log("[v0] Created transactions table")

    // Create admin table
    await sql`
      CREATE TABLE IF NOT EXISTS admin (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log("[v0] Created admin table")

    // Generate bcrypt hash for password "12345"
    const passwordHash = await bcrypt.hash("12345", 10)
    console.log("[v0] Generated password hash")

    // Insert default admin user
    await sql`
      INSERT INTO admin (username, password_hash) 
      VALUES ('admin', ${passwordHash})
      ON CONFLICT (username) DO NOTHING
    `
    console.log("[v0] Inserted admin user")

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_students_email ON students(email)`
    await sql`CREATE INDEX IF NOT EXISTS idx_students_student_id ON students(student_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_students_account_number ON students(account_number)`
    await sql`CREATE INDEX IF NOT EXISTS idx_transactions_student_id ON transactions(student_id)`
    console.log("[v0] Created indexes")

    console.log("[v0] Migration completed successfully!")
  } catch (error) {
    console.error("[v0] Migration failed:", error)
    process.exit(1)
  }
}

runMigration()
