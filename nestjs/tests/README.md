# Test Files

This directory contains essential test scripts for the CyberSource NestJS package.

## Available Tests

### Core Tests

- **`direct-sandbox-test.ts`** - Direct API testing with sandbox environment
- **`minimal-test.ts`** - Minimal test setup for basic functionality
- **`test-available-services.ts`** - Validates all available services
- **`debug-auth.ts`** - Debug authentication header generation
- **`test-rbs-services.ts`** - Test RBS (Recurring Billing Subscriptions) services

## Running Tests

You can run specific tests using the npm scripts:

```bash
# Run sandbox test
npm run test:sandbox

# Run minimal test
npm run test:minimal

# Run authentication debug test
npm run test:debug

# Run RBS services test
npm run test:rbs

# Run service validation test
npm run test:services
```

## Environment Setup

For tests that require real API calls, set up your environment variables:

```bash
export CYBERSOURCE_MERCHANT_ID="your_merchant_id"
export CYBERSOURCE_API_KEY="your_api_key"
export CYBERSOURCE_SHARED_SECRET="your_shared_secret"
export CYBERSOURCE_ENVIRONMENT="sandbox"  # or "production"
```

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
