# Logging Guide

This application uses [Pino](https://getpino.io/) for structured, high-performance logging.

## Configuration

Logging is configured in `src/app.module.ts` via the `LoggerModule`.

### Environment Variables

- `LOG_LEVEL` - Sets the minimum log level (default: `info`)
  - `debug` - Most verbose, includes all logs
  - `info` - Standard application logs
  - `warn` - Warning messages
  - `error` - Error messages only

- `NODE_ENV` - Controls log formatting
  - `development` - Pretty-printed, colorized logs with timestamps
  - `production` - JSON formatted logs for log aggregation services

## Features

### Automatic HTTP Request Logging

All HTTP requests are automatically logged with:
- Request ID
- HTTP method
- URL
- Status code
- Response time

**Exclusions**: Static assets (`.js`, `.css`, `.ico`, `/assets/*`) are not logged to reduce noise.

### Structured Logging

All logs use structured data (JSON) which makes them:
- Easy to search and filter
- Compatible with log aggregation tools (e.g., ELK, Datadog, CloudWatch)
- Queryable in production environments

### Example Log Output

**Development (Pretty-printed)**:
```
[2025-10-25 15:30:45] INFO (UserService): Creating new user
    email: "user@example.com"
    authid: "auth0|123456"

[2025-10-25 15:30:45] INFO (UserService): User created successfully
    userId: 1
    email: "user@example.com"
```

**Production (JSON)**:
```json
{"level":30,"time":1729872645000,"msg":"Creating new user","email":"user@example.com","authid":"auth0|123456"}
{"level":30,"time":1729872645100,"msg":"User created successfully","userId":1,"email":"user@example.com"}
```

## Using the Logger in Code

### Inject the Logger

```typescript
import { PinoLogger, InjectPinoLogger } from 'nestjs-pino';

@Injectable()
export class MyService {
  constructor(
    @InjectPinoLogger(MyService.name)
    private readonly logger: PinoLogger,
  ) {}
}
```

### Log Levels

```typescript
// Debug - detailed diagnostic information
this.logger.debug({ userId: 123 }, 'Debug message');

// Info - general informational messages
this.logger.info({ userId: 123 }, 'User logged in');

// Warn - warning messages
this.logger.warn({ userId: 123 }, 'Failed login attempt');

// Error - error messages
this.logger.error({ error: err.message }, 'Database connection failed');
```

### Structured Data

Always include relevant context as an object in the first parameter:

```typescript
// Good - structured data
this.logger.info({ userId, email, action: 'login' }, 'User action');

// Avoid - unstructured string
this.logger.info(`User ${userId} with email ${email} performed login`);
```

## Current Logging Coverage

All major components have logging:

### Auth Guard (`src/auth/auth.guard.ts`)
- JWT validation success/failure
- Token errors with expected audience and issuer

### Auth Service (`src/auth/auth.service.ts`)
- Auth0 userinfo API calls
- Auth0 API errors

### User Service (`src/user/user.service.ts`)
- User lookups (by ID, authid, email)
- User creation
- User updates
- User deletion
- Not found warnings

### User Controller (`src/user/user.controller.ts`)
- User sync operations
- New user creation from Auth0
- Existing user checks

## Production Recommendations

1. **Set LOG_LEVEL to `info` or `warn`** in production to reduce log volume
2. **Use a log aggregation service** to collect and analyze logs
3. **Monitor error logs** for application issues
4. **Set up alerts** for error rate spikes
5. **Exclude sensitive data** from logs (passwords, tokens, etc.)

## Viewing Logs

### Development
Logs are printed to stdout with colors and timestamps.

### Production
Use log aggregation tools to:
- Search logs by context (userId, email, etc.)
- Create dashboards for error rates
- Set up alerts for specific patterns
- Analyze application performance

## Troubleshooting

### Too Many Logs
- Increase `LOG_LEVEL` to `warn` or `error`
- Check the `autoLogging.ignore` configuration in `app.module.ts`

### Missing Logs
- Verify `LOG_LEVEL` is set correctly
- Check that logger is injected properly
- Ensure logs are being written to the correct stream

### Log Format Issues
- Development: Install `pino-pretty` (already included)
- Production: Ensure `NODE_ENV=production` to get JSON logs
