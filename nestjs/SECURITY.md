# Security Best Practices

## Overview

This document outlines security measures implemented in the CyberSource NestJS client and best practices for secure usage.

## CodeQL Security Fixes

### ✅ Fixed: Polynomial Regular Expression (ReDoS)

**Issue:** Email validation regex was vulnerable to catastrophic backtracking attacks.

**Previous Code (Vulnerable):**

```typescript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
```

**Fixed Code:**

```typescript
// Safe implementation with bounded quantifiers and explicit validation
// Prevents ReDoS attacks by avoiding unbounded repetition
export function validateEmail(email: string): boolean {
  if (!email || email.length > 254) return false;
  // ... explicit validation without polynomial complexity
}
```

**Impact:** Prevents CPU exhaustion attacks from malicious email inputs.

### ✅ Fixed: Sensitive Data Logging

**Issue:** API keys and secrets were being logged in clear text in test files.

**Previous Code (Vulnerable):**

```typescript
console.log(`API Key: ${apiKey}`);
console.log(`Merchant ID: ${merchantId}`);
```

**Fixed Code:**

```typescript
console.log(`API Key: ${apiKey.substring(0, 4)}****${apiKey.slice(-4)}`);
console.log(`Merchant ID: ${merchantId.substring(0, 8)}********`);
```

**Impact:** Prevents credential leakage in logs, especially in CI/CD environments.

## Security Utilities

We provide dedicated security utilities for safe handling of sensitive data:

### Masking Utilities

```typescript
import {
  maskApiKey,
  maskMerchantId,
  maskSensitive,
} from "@infinitesolutions/cybersource-nestjs";

// Mask API keys
maskApiKey("a1b2c3d4-e5f6-g7h8-i9j0");
// Returns: 'a1b2************i9j0'

// Mask merchant IDs
maskMerchantId("merchant_12345678_test");
// Returns: 'merchant********'

// Mask any sensitive string
maskSensitive("secret-value-here", 3, 3);
// Returns: 'sec***********ere'
```

### Safe Logging

```typescript
import {
  safeLog,
  sanitizeForLogging,
} from "@infinitesolutions/cybersource-nestjs";

// Automatically masks sensitive fields
safeLog("Processing payment", {
  merchantId: "merchant_123",
  apiKey: "secret123",
  amount: 100,
});
// Logs: { merchantId: 'merchant********', apiKey: 'secr****23', amount: 100 }

// Manual sanitization
const sanitized = sanitizeForLogging({
  cardNumber: "4111111111111111",
  cvv: "123",
  amount: 50.0,
});
// Returns: { cardNumber: '4111********', cvv: '***', amount: 50.00 }
```

## Best Practices

### 1. Never Log Sensitive Data in Production

❌ **Bad:**

```typescript
console.log("Payment details:", {
  cardNumber: paymentInfo.cardNumber,
  cvv: paymentInfo.cvv,
  apiKey: config.apiKey,
});
```

✅ **Good:**

```typescript
import { safeLog } from "@infinitesolutions/cybersource-nestjs";

safeLog("Payment details:", {
  cardNumber: paymentInfo.cardNumber, // Auto-masked
  cvv: paymentInfo.cvv, // Auto-masked
  apiKey: config.apiKey, // Auto-masked
  amount: paymentInfo.amount, // Not masked
});
```

### 2. Use Environment Variables

❌ **Bad:**

```typescript
const config = {
  apiKey: "my-api-key-here", // Hardcoded!
  merchantId: "merchant123",
};
```

✅ **Good:**

```typescript
const config = {
  apiKey: process.env.CYBERSOURCE_API_KEY,
  merchantId: process.env.CYBERSOURCE_MERCHANT_ID,
  sharedSecret: process.env.CYBERSOURCE_SHARED_SECRET,
};
```

### 3. Validate All Input Data

Always use validation utilities before processing:

```typescript
import {
  validateCardNumber,
  validateExpirationDate,
  validateCVV,
} from "@infinitesolutions/cybersource-nestjs";

if (!validateCardNumber(cardNumber)) {
  throw new Error("Invalid card number");
}

if (!validateExpirationDate(month, year)) {
  throw new Error("Card has expired");
}

if (!validateCVV(cvv, cardType)) {
  throw new Error("Invalid CVV");
}
```

### 4. Handle Errors Securely

Don't expose sensitive information in error messages:

```typescript
import { parseCyberSourceError } from "@infinitesolutions/cybersource-nestjs";

try {
  await processPayment(data);
} catch (error) {
  const parsed = parseCyberSourceError(error);

  // Log technical details (sanitized)
  safeLog("Payment failed", {
    code: parsed.code,
    field: parsed.field,
  });

  // Show user-friendly message (no sensitive data)
  throw new Error(parsed.userMessage);
}
```

### 5. Secure Test Files

Test files should never log actual credentials:

```typescript
// ❌ Bad: Logs real API key
console.log(`API Key: ${process.env.CYBERSOURCE_API_KEY}`);

// ✅ Good: Logs masked API key
const apiKey = process.env.CYBERSOURCE_API_KEY;
console.log(`API Key: ${apiKey.substring(0, 4)}****${apiKey.slice(-4)}`);

// ✅ Better: Use security utilities
import { maskApiKey } from "../utils/security.util";
console.log(`API Key: ${maskApiKey(apiKey)}`);
```

### 6. PCI DSS Compliance

When handling card data:

- ✅ Never store CVV/CVC codes
- ✅ Use tokenization for card storage
- ✅ Mask card numbers (show last 4 digits only)
- ✅ Use HTTPS for all API calls
- ✅ Validate card data before transmission
- ✅ Log only masked/tokenized card references

```typescript
import { maskCardNumber } from "@infinitesolutions/cybersource-nestjs";

// For display or logging
const maskedCard = maskCardNumber("4111111111111111");
console.log(`Processing card: ${maskedCard}`);
// Output: "Processing card: ************1111"
```

### 7. Network Token Security

Use network tokenization for enhanced security:

```typescript
// Enroll card for network tokenization
const enrollment = await instrumentService.enrollCardForNetworkToken(
  instrumentId,
  options
);

// Benefits:
// ✅ Tokens replace actual card numbers
// ✅ Improved authorization rates
// ✅ Better security than PAN storage
// ✅ Card number changes don't affect tokens
```

## Security Checklist

Before deploying to production:

- [ ] All API credentials stored in environment variables
- [ ] No hardcoded secrets in code
- [ ] All logging uses `safeLog()` or manual masking
- [ ] Input validation enabled for all user data
- [ ] Error messages don't expose sensitive data
- [ ] HTTPS enforced for all API calls
- [ ] Card data properly masked in logs
- [ ] Test files don't log real credentials
- [ ] Security utilities imported and used
- [ ] PCI DSS requirements followed

## Environment Variables

Required environment variables (never commit these):

```bash
# .env (add to .gitignore!)
CYBERSOURCE_MERCHANT_ID=your_merchant_id
CYBERSOURCE_API_KEY=your_api_key
CYBERSOURCE_SHARED_SECRET=your_shared_secret
```

Production `.env.example`:

```bash
# CyberSource Configuration
CYBERSOURCE_MERCHANT_ID=
CYBERSOURCE_API_KEY=
CYBERSOURCE_SHARED_SECRET=
CYBERSOURCE_RUN_ENVIRONMENT=api.cybersource.com
```

## Reporting Security Issues

If you discover a security vulnerability:

1. **Do NOT** open a public GitHub issue
2. Email security concerns to: [your-security-email]
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

## Additional Resources

- [CyberSource Security Best Practices](https://developer.cybersource.com/api/developer-guides/dita-gettingstarted/authentication/createSharedKey.html)
- [PCI DSS Requirements](https://www.pcisecuritystandards.org/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

## Version History

- **v1.1.3** - Fixed ReDoS vulnerability in email validation
- **v1.1.3** - Added security utilities for safe logging
- **v1.1.3** - Fixed sensitive data logging in test files
