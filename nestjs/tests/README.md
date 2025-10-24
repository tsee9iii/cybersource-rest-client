# Test Files

This directory contains test scripts for the CyberSource NestJS package.

## Available Tests

### Integration Tests

- **`test-plan-creation.ts`** - Test RBS plan creation with debug logging (requires .env file with credentials)

## Running Tests

```bash
# Create .env file first (see .env.example in parent directory)
cp ../.env.example ../.env
# Edit .env with your credentials

# Run plan creation test with debug output
npm run test:plan
```

## Debug Mode

All tests support debug mode by setting `debug: true` in the module configuration. This will show:

- Request headers (sensitive data redacted)
- Request body and digest calculation
- Response headers and data
- Timing information

See `examples/debug-mode-example.ts` for more details on using debug mode.

# Run service validation test

npm run test:services

````

## Environment Setup

For tests that require real API calls, set up your environment variables:

```bash
export CYBERSOURCE_MERCHANT_ID="your_merchant_id"
export CYBERSOURCE_API_KEY="your_api_key"
export CYBERSOURCE_SHARED_SECRET="your_shared_secret"
export CYBERSOURCE_ENVIRONMENT="sandbox"  # or "production"
````

## Test Files Purpose

### For Development

- Use these tests during development to validate functionality
- Debug authentication and API call issues
- Verify service integrations

### For End Users

- These tests serve as examples for package users
- Show how to properly configure and use the CyberSource services
- Demonstrate basic usage patterns

### For Package Publishing

- Tests are included in the published package (via `package.json` files array)
- Users can run these tests to validate their setup
- Provides working examples of service usage

## Notes

- Tests with real API calls require valid CyberSource credentials
- Sandbox environment is safe for testing and development
- Some tests may fail with test credentials - this is expected behavior
- Use debug-level logging to see detailed request/response information
