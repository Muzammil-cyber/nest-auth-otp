# Database

This project uses MongoDB with Mongoose.

## Connection

- Configured in `src/app.module.ts` via `MongooseModule.forRoot(process.env.MONGO_URI)`.
- Set `MONGO_URI` in `.env`.

## Models

- `User` (`src/users/users.schema.ts`)
  - `email` (unique, lowercase)
  - `passwordHash`
  - `roles` (array of `USER` or `ADMIN`)
  - `isEmailVerified` (boolean)
  - `otpCode` (nullable string)
  - `otpExpiresAt` (nullable Date)

## Indexes

- Unique index on `email` via `@Prop({ unique: true })`.

## Local development

- Use a local MongoDB instance (Docker or native).
- For tests, an in-memory MongoDB is started via `mongodb-memory-server`.

## Migrations

- Not required for Mongoose schemas; changes are applied at runtime.
- When adding fields, consider defaults to keep backward compatibility.
