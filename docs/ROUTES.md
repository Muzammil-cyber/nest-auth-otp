# Routes

All routes are prefixed with `/api`. Swagger is available at `/api/docs`.

## Auth

- POST `/api/auth/signup`
  - body: `{ email: string, password: string }`
  - response: `{ message: string }` → sends OTP to email
- POST `/api/auth/verify-otp`
  - body: `{ email: string, code: string }`
  - response: `{ accessToken: string, refreshToken: string }`
- POST `/api/auth/login`
  - body: `{ email: string, password: string }`
  - response: `{ accessToken: string, refreshToken: string }`

## Users

- GET `/api/users/me` (Bearer auth)
  - response: `{ userId, email, roles }`
- GET `/api/users/admin` (Bearer auth + ADMIN role)
  - response: `{ ok: true }`

## AuthN/AuthZ

- Bearer token (JWT) is required for protected routes.
- Use `@Roles('ADMIN')` for role-based protection (backed by `RolesGuard`).

## Error semantics

- 400: validation errors
- 401: missing/invalid token
- 403: insufficient role
- 404: OTP not found/expired or resource not found
