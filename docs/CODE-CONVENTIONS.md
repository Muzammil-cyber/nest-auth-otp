# Code Conventions

These conventions keep the codebase consistent, readable, and secure.

## Project structure

- Follow standard NestJS modular layout:
  - `src/<feature>/` contains `*.module.ts`, `*.controller.ts`, `*.service.ts`, related `dto/`, `entities/` or schemas, and tests.
  - Cross-cutting utilities live in `src/utils/` (e.g., guards, decorators).
  - Mailer-related code in `src/mail/`.

## Naming

- Modules: `PascalCase` (e.g., `AuthModule`)
- Providers/Services/Controllers: `PascalCase` (e.g., `UsersService`, `AuthController`)
- Files: `kebab-case` (e.g., `users.service.ts`)
- DTOs: `PascalCase` with `Dto` suffix (e.g., `SignupDto`)
- Enums: `PascalCase` with uppercase members (e.g., `UserRole.ADMIN`)
- Variables: descriptive `camelCase` (avoid single-letter names)

## DTOs and validation

- All incoming payloads must have DTOs with `class-validator` decorators and `@ApiProperty` for Swagger.
- Enable global `ValidationPipe` with `whitelist`, `forbidNonWhitelisted`, and `transform` (already configured in `main.ts`).
- Example:

```ts
export class SignupDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ minLength: 8, example: 'StrongPassw0rd!' })
  @IsString()
  @MinLength(8)
  password: string;
}
```

## Controllers

- Lightweight, delegating logic to services.
- Annotate with Swagger decorators: `@ApiTags`, `@ApiOperation`, `@ApiOkResponse`, etc.
- Use `@UseGuards` for auth/role protection.

## Services

- Encapsulate business logic; no HTTP specifics.
- Validate assumptions; throw `BadRequestException`, `UnauthorizedException`, `ForbiddenException`, or `NotFoundException` as appropriate.
- Avoid catching errors without rethrowing or meaningful handling.

## Guards and authorization

- JWT auth via `JwtAuthGuard` for protected routes.
- Role checks via `RolesGuard` and `@Roles('ADMIN')` metadata.
- Keep guards stateless and rely on JWT payload (`sub`, `email`, `roles`).

## Security practices

- Hash passwords with `argon2id`.
- OTPs are short-lived (10 minutes) and single-use.
- Helmet and CORS enabled globally.
- Throttling (`@nestjs/throttler`) enabled globally.
- Never log secrets or tokens. Avoid logging OTPs in production.

## Mongoose schemas

- Use `@Prop({ unique: true })` for unique fields; avoid duplicate manual indexes.
- Export `HydratedDocument<T>` types for documents.
- Keep optional fields explicitly typed and, if nullable, define `{ default: null }`.

## Error responses

- Prefer Nest exceptions for consistent HTTP status codes.
- Validation errors return 400; auth 401; RBAC 403; missing resources/invalid OTP 404.

## Formatting & linting

- Use Prettier and ESLint. Format with `pnpm format`; lint with `pnpm lint`.
- Prefer multi-line, readable code over dense one-liners.
- No inline comments for trivial code; write short docstrings above complex blocks.

## Testing

- Add e2e tests for routes in `test/*.e2e-spec.ts` using `supertest` and `mongodb-memory-server`.
- Mock external services (e.g., `MailService`) in e2e when verifying side effects.
- Use unique test data (e.g., emails) to avoid unique index conflicts.
- Keep tests independent and deterministic; avoid ordering dependencies.

## Commit messages (suggested)

- Use conventional commits where possible:
  - `feat(auth): add refresh token rotation`
  - `fix(users): prevent duplicate email signup`
  - `docs(routes): clarify error semantics`
  - `test(e2e): cover admin-only endpoint`
