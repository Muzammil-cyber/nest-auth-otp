# Testing

## Commands

```bash
# e2e tests
pnpm test

# e2e tests
pnpm test:e2e

# coverage
pnpm test:cov
```

## E2E setup

- Uses `mongodb-memory-server` to spin up MongoDB in memory.
- Each suite sets `process.env.MONGO_URI` dynamically.
- `jest-e2e.json` increases timeout and forces exit to avoid lingering handles.

## Mailer mocking

- In e2e tests, `MailService` is overridden with a fake to capture OTP codes.
- See `test/auth.e2e-spec.ts` for an example.

## Common pitfalls

- If a test hangs, try running with `--detectOpenHandles`.
- Ensure unique emails per test run to avoid unique index collisions.
- When adding new modules that require async initialisation, initialise them in the test `beforeAll` similar to `AppModule`.
