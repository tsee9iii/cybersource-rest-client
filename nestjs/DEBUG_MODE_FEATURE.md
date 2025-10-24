# Debug Mode Feature

## Overview

Added comprehensive debug logging capability to the CyberSource NestJS module to help troubleshoot API integration issues.

## Changes Made

### 1. Configuration Interface (`cybersource.config.ts`)

- Added `debug?: boolean` option to `CyberSourceConfig` interface
- Default: `false` (disabled)

### 2. Debug Info Interface (`cybersource.interfaces.ts`)

- Added `CyberSourceDebugInfo` interface for structured debug logging
- Includes: timestamp, method, URL, headers, body, response status, response headers, response data

### 3. Service Implementation (`cybersource.service.ts`)

- Enhanced `customFetch` to log detailed request/response information when debug is enabled
- **Request Logging**:
  - Timestamp (ISO format)
  - HTTP method and full URL
  - Request headers (with sensitive data redacted)
  - Request body (full payload)
  - Body length for digest validation
- **Response Logging**:
  - Timestamp (ISO format)
  - HTTP status code and status text
  - Response headers (full)
  - Response body (parsed JSON or text)
- **Error Logging**:
  - Timestamp
  - Request details
  - Error message

### 4. Security Features

Sensitive data is automatically redacted:

- **Signature**: Only first 20 characters shown + `...REDACTED`
- **Merchant ID**: Only first 8 characters shown + `...REDACTED`
- **API Key & Secret**: Never logged at all

### 5. Documentation (`README.md`)

- Added "Debug Mode" section with configuration example
- Included sample debug output
- Added security note about data redaction

### 6. Example Code (`examples/debug-mode-example.ts`)

- Created runnable example demonstrating debug mode usage
- Shows how to enable debug logging in NestJS logger
- Includes example payment creation with error handling

## Usage

### Enable Debug Mode

```typescript
CyberSourceModule.forRoot({
  merchantId: "your-merchant-id",
  apiKey: "your-api-key",
  sharedSecretKey: "your-shared-secret",
  sandbox: true,
  debug: true, // Enable debug logging
});
```

### Enable NestJS Debug Logs

```typescript
const app = await NestFactory.create(AppModule, {
  logger: ["error", "warn", "log", "debug"], // Include 'debug' level
});
```

## Debug Output Example

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
    'digest': 'SHA-256=abc123def456...',
    'content-type': 'application/json'
  },
  body: {
    card: {
      number: '411111XXXXXX1111',
      expirationMonth: '12',
      expirationYear: '2025'
    }
  },
  bodyLength: 256
}

[CyberSourceService] DEBUG === CyberSource API Response ===
{
  timestamp: '2024-10-24T10:30:45.456Z',
  status: 415,
  statusText: 'Unsupported Media Type',
  headers: {
    'content-type': 'application/json',
    'v-c-correlation-id': 'abc-123-def-456'
  },
  data: {
    status: 'INVALID_REQUEST',
    reason: 'INVALID_DATA',
    message: 'Invalid field in request'
  }
}
```

## Benefits

1. **Troubleshooting 415 Errors**: See exact headers and body being sent
2. **Authentication Issues**: Verify signature, digest, and date headers
3. **Request Format**: Confirm body structure and content type
4. **Response Analysis**: See server response details including error messages
5. **Integration Testing**: Validate API calls during development

## Testing

All existing tests pass (163 tests):

- ✅ Validation utilities (54 tests)
- ✅ Error handler utilities (30 tests)
- ✅ Security utilities (36 tests)
- ✅ Authentication utilities (38 tests)
- ✅ CyberSource service integration (5 tests)

## Next Steps

To troubleshoot the current 415 error:

1. Enable debug mode in your configuration
2. Make a plan create/update API call
3. Compare the debug output headers with CyberSource documentation
4. Check if digest matches the body being sent
5. Verify content-type header format
