# UniSync Backend — API Reference

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Auth:** NextAuth.js v5 (JWT cookie-based sessions)
- **Database:** PostgreSQL via Prisma ORM
- **Email:** Nodemailer (Mailtrap sandbox for dev)

---

## Authentication Overview

UniSync uses NextAuth.js for authentication. Login is not handled by a custom API route — it is managed internally by NextAuth.

### How to Log In (Frontend)

Install and use the NextAuth client:

```ts
import { signIn } from "next-auth/react";

await signIn("credentials", {
  email: "user@eemc.edu.np",
  password: "password123",
  callbackUrl: "/dashboard",
});
```

This sends credentials to NextAuth's internal endpoint and sets a JWT session cookie automatically. No manual token handling is needed.

### How to Log Out (Frontend)

```ts
import { signOut } from "next-auth/react";

await signOut({ callbackUrl: "/login" });
```

Or call the logout API route directly.

---

## Endpoints

### 1. Register

**`POST /api/signup`**

Creates a new user account and sends a verification email.

**Request Body:**
```json
{
  "fullName": "Rabindra Yadav",
  "email": "rabindra@eemc.edu.np",
  "password": "password123"
}
```

**Validations:**
- All fields are required
- Password must be at least 8 characters
- Email must be valid
- Email domain must match a registered institution (e.g. `eemc.edu.np`)
- Email must not already be registered

**Success Response `201`:**
```json
{
  "message": "Account created. Please check your email to verify your account."
}
```

**Error Responses:**

| Status | Message |
|--------|---------|
| `400` | `"All fields are required."` |
| `400` | `"Password must be at least 8 characters."` |
| `400` | `"Invalid email format."` |
| `400` | `"Your institution is not registered with UniSync."` |
| `409` | `"An account with this email already exists."` |
| `500` | `"Internal server error."` |

---

### 2. Verify Email

**`GET /api/verify-email?token=<token>`**

Verifies the user's email address using the token sent in the verification email. Called automatically when the user clicks the link in their email.

**Query Parameter:**

| Param | Type | Description |
|-------|------|-------------|
| `token` | `string` | The verification token from the email link |

**On success:** Redirect

**Error Responses:**

| Status | Message |
|--------|---------|
| `400` | `"Token is required."` |
| `400` | `"Invalid or expired token."` |

---

### 3. Session Check

**`GET /api/session-check`**

Returns the currently authenticated user's basic info. Use this to check if a user is logged in.

**Headers:** Requires a valid session cookie (set automatically after login).

**Success Response `200`:**
```json
{
  "success": true,
  "user": {
    "id": "cm9x...",
    "name": "Rabindra Yadav",
    "email": "rabindra@eemc.edu.np"
  }
}
```

**Not Authenticated `401`:**
```json
{
  "success": false,
  "message": "Not authenticated."
}
```

---

### 4. Logout

**`POST /api/logout`**

Ends the current session and clears the session cookie.

**Request Body:** None

**Success Response `200`:**
```json
{
  "success": true
}
```

> **Note:** On the frontend, prefer calling NextAuth's `signOut()` directly. Use this endpoint only if you need programmatic logout from server-side code or a non-NextAuth context.

---

### 5. Get Skills

**`GET /api/skills`**

Returns all available skills. Optionally filter by type.

**Query Parameter (optional):**

| Param | Type | Description |
|-------|------|-------------|
| `type` | `string` | Filter by skill type — e.g. `SKILL`, `INTEREST` |

**Success Response `200`:**
```json
{
  "success": true,
  "skills": [
    { "id": "cm9x...", "name": "Machine Learning", "type": "INTEREST" },
    { "id": "cm9y...", "name": "Cybersecurity", "type": "INTEREST" }
  ]
}
```

**Examples:**
```
GET /api/skills              → all skills
GET /api/skills?type=SKILL   → only skills
GET /api/skills?type=INTEREST → only interests
```

---

### 6. Save User Skills

**`POST /api/users/skills`**

Saves (or updates) the authenticated user's selected skills. Safe to call multiple times — uses upsert so re-submitting the onboarding step won't create duplicates.

**Requires:** Valid session cookie (user must be logged in).

**Request Body:**
```json
{
  "skills": [
    { "skillId": "cm9x...", "proficiency": "2" },
    { "skillId": "cm9y...", "proficiency": null }
  ]
}
```

**Validations:**
- User must be authenticated
- `skills` must be a non-empty array
- All `skillId` values must exist in the `Skill` table

**Success Response `200`:**
```json
{
  "success": true
}
```

**Error Responses:**

| Status | Message |
|--------|---------|
| `401` | `"Not authenticated."` |
| `400` | `"Skills must be a non-empty array."` |
| `400` | `"One or more skill IDs are invalid."` |

---

## Email Verification Flow

```
POST /api/signup
      ↓
User row created (unverified)
      ↓
Verification email sent via Mailtrap
      ↓
User clicks link → GET /api/verify-email?token=...
      ↓
emailVerified timestamp set on user row
      ↓
Redirect → /auth/login?verified=true
Redirect
```

Users cannot log in until their email is verified. Attempting to log in with an unverified account returns an `EmailNotVerified` error.
