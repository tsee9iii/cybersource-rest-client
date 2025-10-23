# Quick Reference Guide

## Import Statements

```typescript
// Validation utilities
import {
  validateCardNumber,
  identifyCardType,
  validateExpirationDate,
  validateCVV,
  formatCardNumber,
  maskCardNumber,
  validateRoutingNumber,
  validateEmail,
  validateZipCode,
  validatePhoneNumber,
} from "@infinitesolutions/cybersource-nestjs";

// Error handling
import {
  parseCyberSourceError,
  isRetryableError,
  createRetryStrategy,
  logError,
} from "@infinitesolutions/cybersource-nestjs";

// Services with helper methods
import {
  InstrumentIdentifierService,
  TokenizedCardService,
  CustomerService,
} from "@infinitesolutions/cybersource-nestjs";
```

## Common Patterns

### Validate Card Input

```typescript
const isValid = validateCardNumber(cardNumber);
const cardType = identifyCardType(cardNumber);
const isNotExpired = validateExpirationDate(month, year);
const isCVVValid = validateCVV(cvv, cardType);
```

### Create Card Instrument (Simplified)

```typescript
const instrument = await instrumentService.createCardInstrument(
  customerId,
  {
    number: "4111111111111111",
    expirationMonth: "12",
    expirationYear: "2025",
    type: "001", // Visa
  },
  {
    billTo: {
      firstName: "John",
      lastName: "Doe",
      // ... address fields
    },
  }
);
```

### Create Network Token (Simplified)

```typescript
const token = await tokenizedCardService.createTokenFromCard(customerId, {
  number: "4111111111111111",
  expirationMonth: "12",
  expirationYear: "2025",
  securityCode: "123",
});
```

### Handle Errors

```typescript
try {
  await operation();
} catch (error) {
  const parsed = parseCyberSourceError(error);
  console.log(parsed.userMessage); // "Your payment was declined..."

  if (parsed.retryable) {
    // Retry logic
  }
}
```

### Retry with Backoff

```typescript
const retryConfig = createRetryStrategy(3, 1000);

for (let attempt = 0; attempt <= retryConfig.maxRetries; attempt++) {
  try {
    return await operation();
  } catch (error) {
    if (attempt === retryConfig.maxRetries || !isRetryableError(error)) {
      throw error;
    }
    await new Promise((resolve) =>
      setTimeout(resolve, retryConfig.getDelay(attempt))
    );
  }
}
```

## Helper Methods Available

### InstrumentIdentifierService

| Method                          | Purpose                                     |
| ------------------------------- | ------------------------------------------- |
| `createCardInstrument()`        | Create card with default payment instrument |
| `createBankAccountInstrument()` | Create ACH/eCheck bank account              |
| `enrollCardForNetworkToken()`   | Enroll for network tokenization             |

### TokenizedCardService

| Method                             | Purpose                          |
| ---------------------------------- | -------------------------------- |
| `createTokenFromCard()`            | Create network token from PAN    |
| `createTokenFromIssuerReference()` | Create token from issuer account |
| `createTokenFromExistingToken()`   | Token-on-token provisioning      |

## Validation Functions

| Function                   | Returns | Example                                                          |
| -------------------------- | ------- | ---------------------------------------------------------------- |
| `validateCardNumber()`     | boolean | `validateCardNumber("4111111111111111")` → `true`                |
| `identifyCardType()`       | string  | `identifyCardType("4111111111111111")` → `"visa"`                |
| `validateExpirationDate()` | boolean | `validateExpirationDate("12", "2025")` → `true`                  |
| `validateCVV()`            | boolean | `validateCVV("123", "visa")` → `true`                            |
| `formatCardNumber()`       | string  | `formatCardNumber("4111111111111111")` → `"4111 1111 1111 1111"` |
| `maskCardNumber()`         | string  | `maskCardNumber("4111111111111111")` → `"************1111"`      |
| `validateRoutingNumber()`  | boolean | `validateRoutingNumber("021000021")` → `true`                    |
| `validateEmail()`          | boolean | `validateEmail("user@example.com")` → `true`                     |
| `validateZipCode()`        | boolean | `validateZipCode("94102")` → `true`                              |
| `validatePhoneNumber()`    | boolean | `validatePhoneNumber("5551234567")` → `true`                     |

## Error Handling Functions

| Function                          | Purpose                                    |
| --------------------------------- | ------------------------------------------ |
| `parseCyberSourceError(error)`    | Convert API errors to user-friendly format |
| `isRetryableError(error)`         | Check if error should be retried           |
| `createRetryStrategy(max, delay)` | Configure exponential backoff              |
| `logError(error, context)`        | Structured error logging                   |

## Card Type Codes

```typescript
const cardTypeCodes = {
  visa: "001",
  mastercard: "002",
  americanexpress: "003",
  discover: "004",
  dinersclub: "005",
  carteblanche: "006",
  jcb: "007",
};
```

## Full Documentation

See [USAGE-EXAMPLES.md](./USAGE-EXAMPLES.md) for complete examples and integration patterns.
