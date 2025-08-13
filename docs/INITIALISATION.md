# Initialisation

This project is a secure NestJS API with JWT auth, OTP email verification, role-based authorization, Swagger docs, and MongoDB (Mongoose).

## Prerequisites

- Node.js 20+ and pnpm 10+ (via Corepack)
- MongoDB running locally or a connection string

## 1) Install dependencies

```bash
pnpm install
```

## 2) Configure environment

Create a `.env` file at the project root:

```ini
PORT=3000
MONGO_URI=mongodb://localhost:27017/nest_auth_otp
JWT_SECRET=replace-with-strong-secret
JWT_REFRESH_SECRET=replace-with-strong-refresh-secret
MAIL_HOST=localhost
MAIL_PORT=1025
MAIL_USER=
MAIL_PASS=
MAIL_FROM=no-reply@example.com
```

Notes:

- For local email testing, use Mailhog/Mailpit with `MAIL_HOST=localhost`, `MAIL_PORT=1025`.
- In production, set all secrets via your secret manager.

## 3) Run the app

```bash
# development (watch)
pnpm start:dev

# production build
pnpm build
pnpm start:prod
```

## 4) API docs (Swagger)

Open:

- <http://localhost:3000/api/docs>

Use the Authorize button to add a Bearer token (JWT) to try secured endpoints.

## 5) Basic flow

1. Signup: `POST /api/auth/signup` with email and password → an OTP is emailed
2. Verify OTP: `POST /api/auth/verify-otp` with email + OTP → receive access/refresh tokens
3. Login: `POST /api/auth/login` with email + password → receive access/refresh tokens
4. Authenticated routes: pass `Authorization: Bearer <accessToken>`
