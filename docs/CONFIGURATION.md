# Configuration

Environment variables are read via `@nestjs/config` (global).

## Required env vars

- `PORT` (default 3000)
- `MONGO_URI`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `MAIL_HOST`, `MAIL_PORT`, `MAIL_USER`, `MAIL_PASS`, `MAIL_FROM`

## Mailer

Configured in `app.module.ts` using `MailerModule.forRootAsync`. Local dev can use Mailhog/Mailpit. In production, use a real SMTP.

## Security

- Helmet is enabled (`helmet`).
- CORS is enabled with permissive origins for API usage; restrict in production.
- ValidationPipe runs globally (whitelist + forbidNonWhitelisted + transform).
- Rate limiting enabled via `@nestjs/throttler` (60 rps per IP by default).
