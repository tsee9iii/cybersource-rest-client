# Quick Start: Using Debug Mode to Troubleshoot 415 Errors

## Step 1: Enable Debug Mode

Update your module configuration:

```typescript
import { CyberSourceModule } from "@infinitesolutions/cybersource-nestjs";

@Module({
  imports: [
    CyberSourceModule.forRoot({
      merchantId: process.env.CYBERSOURCE_MERCHANT_ID,
      apiKey: process.env.CYBERSOURCE_API_KEY,
      sharedSecretKey: process.env.CYBERSOURCE_SHARED_SECRET,
      sandbox: true,
      debug: true, // 👈 ADD THIS
    }),
  ],
})
export class AppModule {}
```

## Step 2: Enable NestJS Debug Logging

In your `main.ts`:

```typescript
const app = await NestFactory.create(AppModule, {
  logger: ["error", "warn", "log", "debug"], // 👈 Include 'debug'
});
```

## Step 3: Run Your Code

Make your plan create/update API call as usual. The console will now show:

### Request Details

```
[CyberSourceService] DEBUG === CyberSource API Request ===
{
  timestamp: '2024-10-24T10:30:45.123Z',
  method: 'POST',
  url: 'https://apitest.cybersource.com/tms/v2/paymentinstruments',
  path: '/tms/v2/paymentinstruments',
  headers: {
    'host': 'apitest.cybersource.com',
    'v-c-date': 'Thu, 24 Oct 2024 10:30:45 GMT',
    'v-c-merchant-id': '[12345678...REDACTED]',
    'signature': '[keyid="12345678...REDACTED]',
    'digest': 'SHA-256=...',
    'content-type': 'application/json',
    'Content-Type': 'application/json'  // Check if there are duplicates!
  },
  body: { /* your full request payload */ },
  bodyLength: 256
}
```

### Response Details

```
[CyberSourceService] DEBUG === CyberSource API Response ===
{
  timestamp: '2024-10-24T10:30:45.456Z',
  status: 415,
  statusText: 'Unsupported Media Type',
  headers: {
    'content-type': 'application/json',
    'v-c-correlation-id': 'abc-123-def'
  },
  data: {
    status: 'INVALID_REQUEST',
    reason: 'INVALID_DATA',
    message: 'Detailed error message from CyberSource'
  }
}
```

## Step 4: Analyze the Output

### Things to Check:

1. **Headers**:

   - Is `v-c-date` present (not `date`)?
   - Is `Content-Type` exactly `application/json`?
   - Are there duplicate headers (both lowercase and capitalized)?
   - Is `digest` present for POST/PUT/PATCH?
   - Is `v-c-merchant-id` present?

2. **Body**:

   - Does the body structure match CyberSource API docs?
   - Is `bodyLength` reasonable (not double the expected size)?
   - Does the body show the actual data being sent?

3. **Response**:
   - What's the exact error message from CyberSource?
   - Does `v-c-correlation-id` appear (useful for support)?
   - Are there field-specific errors in the response data?

## Step 5: Common Issues & Fixes

### Issue: Duplicate Content-Type Headers

**Symptom**: Both `content-type` and `Content-Type` appear in headers
**Fix**: We've already addressed this - the latest version prioritizes the capitalized version

### Issue: Wrong Body Format

**Symptom**: `bodyLength` is double what you expect, or body looks like escaped JSON
**Fix**: Fixed in latest version - body is no longer double-stringified

### Issue: Missing Digest

**Symptom**: No `digest` header for POST/PUT/PATCH requests
**Fix**: Check that `bodyForDigest` is properly calculated - should appear in logs

### Issue: Wrong Date Format

**Symptom**: `date` header instead of `v-c-date`, or wrong date format
**Fix**: Already fixed - now uses `v-c-date` with RFC1123 format

## Step 6: Share Debug Output

If you still get 415 errors after checking above, share the debug output (headers and response) for further analysis. The sensitive data is already redacted, so it's safe to share.

## Disable Debug Mode in Production

⚠️ Remember to disable debug mode in production:

```typescript
CyberSourceModule.forRoot({
  merchantId: process.env.CYBERSOURCE_MERCHANT_ID,
  apiKey: process.env.CYBERSOURCE_API_KEY,
  sharedSecretKey: process.env.CYBERSOURCE_SHARED_SECRET,
  sandbox: false, // Production
  debug: false,   // Disable debug logging
}),
```

Or use environment variables:

```typescript
debug: process.env.NODE_ENV === 'development',
```
