# School Bank Management System

## Overview

This is a Next.js-based School Bank Management System that enables educational institutions to manage student bank accounts. The application provides two separate interfaces: an admin dashboard for managing students and viewing transactions, and a student portal for checking balances and making transfers between accounts.

The system simulates a basic banking environment where students can maintain account balances, transfer funds to other students, and view their transaction history. Administrators have full oversight of all student accounts and system-wide transaction activity.

## Recent Changes

**October 30, 2025 - Migrated from Vercel to Replit**:
- Switched from external Neon database to Replit's built-in PostgreSQL database
- Fixed critical security vulnerabilities:
  - Removed hardcoded admin passwords
  - Implemented proper bcrypt verification in admin login
  - Added environment variable requirement (fails fast if ADMIN_PASSWORD not set)
- Updated all database connection strings to use Replit's `DATABASE_URL`
- Configured Next.js to bind to 0.0.0.0:5000 for Replit compatibility
- Set up deployment configuration for Replit autoscale
- Fixed inconsistent environment variable naming across API routes

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: Next.js 14+ with App Router and React Server Components
- The application uses Next.js App Router architecture with client-side components marked with "use client" directive
- TypeScript is used throughout for type safety
- Client-side routing handles navigation between admin and student portals

**UI Components**: shadcn/ui with Radix UI primitives
- Component library uses the "new-york" style variant
- Tailwind CSS for styling with custom OKLCH color system for both light and dark modes
- Lucide React for iconography
- Form handling via React Hook Form with Zod resolvers (configured but not extensively used in current implementation)

**State Management**: Local React state with localStorage for authentication
- Authentication tokens stored in browser localStorage
- Simple token-based auth using base64-encoded user identifiers
- No complex state management library; relies on React hooks and component state

**Routing Structure**:
- `/` - Root page that runs migrations and redirects based on auth status
- `/admin/login` - Admin authentication
- `/admin/dashboard` - Admin control panel
- `/student` - Student login and portal

### Backend Architecture

**API Routes**: Next.js API Routes (App Router format)
- RESTful API endpoints under `/api` directory
- Separation of admin and student API namespaces
- Authentication via Bearer token in Authorization headers

**Authentication**:
- Admin: Username/password with bcrypt password hashing
- Students: Account number-based login (no password required)
- Simple token generation using base64 encoding of user identifiers
- No JWT or session management - stateless authentication

**Database Operations**: Direct SQL queries via Neon serverless driver
- No ORM used; raw SQL queries throughout the application
- Transaction handling for money transfers to ensure data consistency
- Parameterized queries to prevent SQL injection

### Data Storage

**Database**: PostgreSQL via Replit Database (Neon-backed)
- Connection string stored in `DATABASE_URL` environment variable (automatically provided by Replit)
- Neon serverless driver (`@neondatabase/serverless`) for database connectivity
- Built-in Replit PostgreSQL database with automatic environment variable injection

**Schema Design**:

1. **students table**:
   - Primary key: `id` (serial)
   - Unique constraints: `email`, `student_id`, `account_number`
   - Stores student information and current balance
   - Timestamps for record tracking

2. **transactions table**:
   - Primary key: `id` (serial)
   - Foreign key: `student_id` references students(id) with CASCADE delete
   - Records all financial transactions (deposits, withdrawals, transfers)
   - Stores balance snapshot after each transaction

3. **admin table**:
   - Primary key: `id` (serial)
   - Unique constraint: `username`
   - Stores admin credentials with bcrypt-hashed passwords

**Migration Strategy**:
- Database migrations run automatically on first page load via `/api/migrate` endpoint
- Creates tables with IF NOT EXISTS clauses for idempotency
- Seeds default admin account (username: "admin") from required `ADMIN_PASSWORD` environment variable
- Migration fails fast if `ADMIN_PASSWORD` is not set (no insecure defaults)

### Authentication & Authorization

**Admin Authentication**:
- Bcrypt password hashing (10 rounds)
- Credentials verified against database using bcrypt.compare()
- Token format: base64 encoded `username:admin_id`
- Protected routes check for token presence in localStorage and Authorization header
- No hardcoded credentials - requires `ADMIN_PASSWORD` environment variable to be set

**Student Authentication**:
- Account number-only login (simplified security model)
- Token format: base64 encoded `student_id:account_number`
- No password protection for student accounts

**Authorization Pattern**:
- API routes validate Authorization header presence
- Token decoding to extract user identifiers
- No role-based access control beyond admin vs student separation
- No token expiration or refresh mechanism

### External Dependencies

**Third-Party Services**:

1. **Replit PostgreSQL Database** (Neon-backed)
   - Built-in Replit database service
   - Serverless PostgreSQL with automatic environment variable injection
   - Connection via `DATABASE_URL` environment variable (automatically managed)
   - Supports database rollback through Replit's checkpoint system

2. **Vercel Analytics**
   - Integrated for usage tracking
   - No configuration required beyond component inclusion

**NPM Packages**:

1. **UI & Styling**:
   - `@radix-ui/*` - Accessible component primitives (dialogs, dropdowns, tables, tabs, etc.)
   - `tailwindcss` - Utility-first CSS framework
   - `tw-animate-css` - Animation utilities
   - `class-variance-authority` - Component variant handling
   - `clsx` & `tailwind-merge` - Conditional class management

2. **Authentication & Security**:
   - `bcryptjs` - Password hashing for admin accounts

3. **Forms**:
   - `@hookform/resolvers` - Configured but not actively used
   - `react-hook-form` - Likely installed as peer dependency

4. **Utilities**:
   - `date-fns` - Date manipulation (installed but not extensively used)
   - `lucide-react` - Icon library

**Environment Variables Required**:
- `DATABASE_URL` - PostgreSQL connection string (automatically provided by Replit)
- `ADMIN_PASSWORD` - Admin account password (required, will be hashed with bcrypt)
  - No default fallback for security
  - Migration will fail if not set
  - Used to create the default "admin" user on first migration

**Development Setup**:
- Development server runs on port 5000 with host 0.0.0.0
- Production build via standard Next.js build process