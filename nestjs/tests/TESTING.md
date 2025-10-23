# Testing Guide

## Overview

This project uses Jest with TypeScript for comprehensive unit testing. We maintain high code coverage standards, especially for utility functions.

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (auto-rerun on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Structure

Tests are located in the `__tests__/` directory and follow the naming convention `*.test.ts`.

```
nestjs/
├── __tests__/
│   ├── validation.util.test.ts       (84 tests - 100% coverage)
│   ├── error-handler.util.test.ts    (31 tests - 92.85% coverage)
│   └── ...
├── utils/
│   ├── validation.util.ts
│   ├── error-handler.util.ts
│   └── ...
└── jest.config.js
```

## Coverage Thresholds

We maintain strict coverage thresholds to ensure code quality:

### Utility Functions (90%+ required)

- **Validation Utils**: 100% coverage

  - Card number validation (Luhn algorithm)
  - Card type identification
  - Expiration date validation
  - CVV validation
  - Routing number validation
  - Email, ZIP, phone validation

- **Error Handler**: 92.85% coverage
  - Error parsing and mapping
  - Retry logic
  - User-friendly error messages
  - Exponential backoff strategy

### Global (50%+ required)

- Services and integration code

## Test Coverage

Current coverage metrics:

| Utility                 | Coverage | Tests    |
| ----------------------- | -------- | -------- |
| `validation.util.ts`    | 100%     | 54 tests |
| `error-handler.util.ts` | 92.85%   | 30 tests |

## Writing Tests

### Example: Validation Test

```typescript
import { describe, expect, test } from "@jest/globals";
import { validateCardNumber } from "../utils/validation.util";

describe("validateCardNumber", () => {
  test("should validate valid Visa card numbers", () => {
    expect(validateCardNumber("4111111111111111")).toBe(true);
  });

  test("should reject invalid card numbers", () => {
    expect(validateCardNumber("1234567890123456")).toBe(false);
  });
});
```

### Example: Error Handler Test

```typescript
import { describe, expect, test } from "@jest/globals";
import { parseCyberSourceError } from "../utils/error-handler.util";

describe("parseCyberSourceError", () => {
  test("should parse declined transaction error", () => {
    const error = {
      response: {
        status: 400,
        data: { status: "DECLINE", message: "Transaction declined" },
      },
    };

    const parsed = parseCyberSourceError(error);
    expect(parsed.code).toBe("DECLINE");
    expect(parsed.retryable).toBe(false);
  });
});
```

## Test Categories

### 1. Validation Tests

Tests for all validation utilities:

- ✅ Card number validation (Luhn algorithm)
- ✅ Card type identification (Visa, Mastercard, Amex, etc.)
- ✅ Expiration date validation
- ✅ CVV validation (3-digit and 4-digit)
- ✅ Card number formatting and masking
- ✅ Routing number validation (ACH)
- ✅ Email, ZIP code, phone validation

### 2. Error Handler Tests

Tests for error handling utilities:

- ✅ Error parsing and mapping
- ✅ Retryable error detection
- ✅ User-friendly error messages
- ✅ Exponential backoff calculation
- ✅ Field-level error extraction
- ✅ HTTP status code mapping

### 3. Service Tests (Future)

Tests for service helper methods:

- ⏳ Instrument identifier operations
- ⏳ Network tokenization
- ⏳ Customer management
- ⏳ Payment processing

## CI/CD Integration

Tests are automatically run on:

- Every commit (via pre-commit hooks - coming soon)
- Pull requests (via GitHub Actions - coming soon)
- Before publishing (via `prepublishOnly` hook)

## Best Practices

1. **Test Coverage**: Maintain 90%+ coverage for utility functions
2. **Test Naming**: Use descriptive names that explain the test case
3. **Arrange-Act-Assert**: Follow AAA pattern in tests
4. **Edge Cases**: Always test edge cases and error conditions
5. **Mocking**: Mock external dependencies (API calls, etc.)

## Viewing Coverage Reports

After running `npm run test:coverage`, open the HTML coverage report:

```bash
open coverage/lcov-report/index.html
```

This provides a detailed, interactive view of code coverage.

## Troubleshooting

### Tests Failing Locally

1. Clear Jest cache:

   ```bash
   npx jest --clearCache
   ```

2. Reinstall dependencies:

   ```bash
   rm -rf node_modules
   npm install
   ```

3. Check TypeScript compilation:
   ```bash
   npm run build
   ```

### Coverage Threshold Failures

If tests pass but coverage thresholds fail:

- Check which files are below threshold
- Add tests for uncovered code paths
- Review coverage report: `open coverage/lcov-report/index.html`

## Future Improvements

- [ ] Add integration tests with mocked CyberSource API
- [ ] Add service unit tests with mocked dependencies
- [ ] Set up GitHub Actions CI/CD
- [ ] Add pre-commit hooks with Husky
- [ ] Add mutation testing for critical paths
- [ ] Add performance benchmarks

## Resources

- [Jest Documentation](https://jestjs.io/)
- [ts-jest Documentation](https://kulshekhar.github.io/ts-jest/)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
