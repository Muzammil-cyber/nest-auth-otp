# Security

## Defaults enabled

- Helmet security headers
- CORS enabled (adjust origins in production)
- Global `ValidationPipe` (sanitize and forbid unknown fields)
- Rate limiting via `@nestjs/throttler`
- JWT auth with short-lived access tokens, longer refresh tokens
- Role-based authorization via `RolesGuard`

## Recommendations

- Rotate JWT secrets regularly; store in secret manager
- Use HTTPS and trusted reverse proxy
- Enable logging/monitoring and anomaly detection
- Add account lockout/backoff for repeated auth failures
- Implement refresh token rotation and revocation list
- Use a transactional mail provider for OTPs; include anti-phishing text

## Threats addressed

- Input validation reduces injection risks
- Rate limiting mitigates brute-force attacks
- JWT ensures stateless auth; RBAC restricts access by role
- OTP verifies email ownership before granting tokens
