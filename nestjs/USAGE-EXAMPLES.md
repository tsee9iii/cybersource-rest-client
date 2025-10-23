# CyberSource NestJS Usage Examples

This document provides practical examples for using the CyberSource NestJS module with the latest V2 API implementations.

## Table of Contents

1. [Installation & Setup](#installation--setup)
2. [Validation Utilities](#validation-utilities)
3. [Error Handling](#error-handling)
4. [Instrument Identifiers](#instrument-identifiers)
5. [Network Tokenization](#network-tokenization)
6. [Customer Management](#customer-management)
7. [Payment Processing](#payment-processing)

## Installation & Setup

```typescript
import { Module } from "@nestjs/common";
import { CyberSourceModule } from "@infinitesolutions/cybersource-nestjs";

@Module({
  imports: [
    CyberSourceModule.forRoot({
      merchantId: process.env.CYBERSOURCE_MERCHANT_ID,
      apiKeyId: process.env.CYBERSOURCE_API_KEY_ID,
      sharedSecret: process.env.CYBERSOURCE_SHARED_SECRET,
      runEnvironment: "apitest.cybersource.com", // Use 'api.cybersource.com' for production
    }),
  ],
})
export class AppModule {}
```

## Validation Utilities

Validate payment data before sending to CyberSource:

```typescript
import {
  validateCardNumber,
  identifyCardType,
  validateExpirationDate,
  validateCVV,
  formatCardNumber,
  maskCardNumber,
  validateRoutingNumber,
  validateEmail,
} from "@infinitesolutions/cybersource-nestjs";

// Validate card number
const isValid = validateCardNumber("4111111111111111"); // true

// Identify card type
const cardType = identifyCardType("4111111111111111"); // 'visa'

// Validate expiration
const isNotExpired = validateExpirationDate("12", "2025"); // true/false

// Validate CVV
const isCVVValid = validateCVV("123", "visa"); // true

// Format for display
const formatted = formatCardNumber("4111111111111111"); // '4111 1111 1111 1111'

// Mask for security
const masked = maskCardNumber("4111111111111111"); // '************1111'

// Validate routing number (for ACH)
const isRoutingValid = validateRoutingNumber("021000021"); // true

// Validate email
const isEmailValid = validateEmail("user@example.com"); // true
```

## Error Handling

Use the error handling utilities for better error management:

```typescript
import {
  parseCyberSourceError,
  isRetryableError,
  createRetryStrategy,
  logError,
} from "@infinitesolutions/cybersource-nestjs";

// Parse errors for user-friendly messages
try {
  await cybersourceService.createPayment(paymentData);
} catch (error) {
  const parsedError = parseCyberSourceError(error);
  console.log(parsedError.userMessage); // User-friendly message
  console.log(parsedError.code); // Error code
  console.log(parsedError.retryable); // Whether to retry
}

// Check if error is retryable
try {
  await someOperation();
} catch (error) {
  if (isRetryableError(error)) {
    // Implement retry logic
  }
}

// Implement retry with exponential backoff
async function executeWithRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  const retryConfig = createRetryStrategy(maxRetries, 1000);

  for (let attempt = 0; attempt <= retryConfig.maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      logError(error, { attempt, operation: "executeWithRetry" });

      if (attempt === retryConfig.maxRetries || !isRetryableError(error)) {
        throw error;
      }

      const delay = retryConfig.getDelay(attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error("Max retries exceeded");
}
```

## Instrument Identifiers

### Create Card Instrument with Default Payment Instrument

```typescript
import { InstrumentIdentifierService } from "@infinitesolutions/cybersource-nestjs";

@Injectable()
export class PaymentService {
  constructor(
    private readonly instrumentService: InstrumentIdentifierService
  ) {}

  async createCardInstrument(customerId: string, cardData: any) {
    // Using the helper method (recommended)
    const result = await this.instrumentService.createCardInstrument(
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
          address1: "1 Market St",
          locality: "San Francisco",
          administrativeArea: "CA",
          postalCode: "94105",
          country: "US",
          email: "john@example.com",
        },
      }
    );

    console.log("Instrument ID:", result.id);
    console.log("Card last 4:", result.card.suffix);
    return result;
  }
}
```

### Create Bank Account Instrument

```typescript
async createBankAccountInstrument(customerId: string) {
  const result = await this.instrumentService.createBankAccountInstrument(
    customerId,
    {
      type: 'C', // Checking account
      routingNumber: '021000021',
      accountNumber: '4100',
    },
    {
      billTo: {
        firstName: 'John',
        lastName: 'Doe',
        address1: '1 Market St',
        locality: 'San Francisco',
        administrativeArea: 'CA',
        postalCode: '94105',
        country: 'US',
      },
    }
  );

  console.log('Instrument ID:', result.id);
  return result;
}
```

### Enroll Card for Network Tokenization

```typescript
async enrollCardForNetworkToken(instrumentIdentifierId: string) {
  const result = await this.instrumentService.enrollCardForNetworkToken(
    instrumentIdentifierId,
    {
      processingInformation: {
        billPayment: false,
      },
      orderInformation: {
        amountDetails: {
          currency: 'USD',
        },
      },
      buyerInformation: {
        mobilePhone: 5551234567,
      },
    }
  );

  console.log('Network token enrolled:', result.id);
  console.log('Status:', result.state);
  return result;
}
```

### Update Instrument Identifier

```typescript
async updateInstrument(instrumentIdentifierId: string) {
  const result = await this.instrumentService.updateInstrumentIdentifierV2({
    instrumentIdentifierId,
    card: {
      expirationMonth: '01',
      expirationYear: '2026',
    },
    billTo: {
      firstName: 'Jane',
      lastName: 'Smith',
    },
  });

  console.log('Updated instrument:', result.id);
  return result;
}
```

### Retrieve Instrument with Details

```typescript
async getInstrumentDetails(instrumentIdentifierId: string) {
  const result = await this.instrumentService.getInstrumentIdentifierV2({
    instrumentIdentifierId,
    profileId: 'merchant-profile-id', // Optional
  });

  console.log('Card info:', result.card);
  console.log('State:', result.state);
  return result;
}
```

### Delete Instrument

```typescript
async deleteInstrument(instrumentIdentifierId: string) {
  await this.instrumentService.deleteInstrumentIdentifierV2({
    instrumentIdentifierId,
    profileId: 'merchant-profile-id', // Optional
  });

  console.log('Instrument deleted');
}
```

## Network Tokenization

### Create Network Token from Card (PAN)

```typescript
import { TokenizedCardService } from "@infinitesolutions/cybersource-nestjs";

@Injectable()
export class TokenizationService {
  constructor(private readonly tokenizedCardService: TokenizedCardService) {}

  async createTokenFromPAN(customerId: string) {
    // Using helper method (recommended)
    const result = await this.tokenizedCardService.createTokenFromCard(
      customerId,
      {
        number: "4111111111111111",
        expirationMonth: "12",
        expirationYear: "2025",
        securityCode: "123",
      }
    );

    console.log("Network token created:", result.id);
    console.log("Card suffix:", result.card.suffix);
    console.log("Network token ID:", result.metadata?.networkToken?.id);
    return result;
  }
}
```

### Create Token from Issuer Reference

```typescript
async createTokenFromIssuer(customerId: string, issuerAccountId: string) {
  const result = await this.tokenizedCardService.createTokenFromIssuerReference(
    customerId,
    issuerAccountId
  );

  console.log('Token created from issuer:', result.id);
  return result;
}
```

### Create Token from Existing Token (Token-on-Token)

```typescript
async createTokenFromExistingToken(customerId: string, existingTokenId: string) {
  const result = await this.tokenizedCardService.createTokenFromExistingToken(
    customerId,
    existingTokenId
  );

  console.log('New token provisioned:', result.id);
  console.log('Source token:', existingTokenId);
  return result;
}
```

### Create Token with Visual Assets

```typescript
async createTokenWithArt(customerId: string) {
  const result = await this.tokenizedCardService.createNetworkTokenV2({
    customerId,
    tokenSource: 'ONFILE',
    card: {
      number: '4111111111111111',
      expirationMonth: '12',
      expirationYear: '2025',
    },
    metadata: {
      art: {
        cardArtFile: 'https://example.com/card-art.png',
        cardBackgroundCombinedAssetId: 'asset-123',
        iconAssetId: 'icon-456',
      },
    },
  });

  console.log('Token with art:', result.id);
  return result;
}
```

### Update Network Token

```typescript
async updateNetworkToken(tokenId: string) {
  const result = await this.tokenizedCardService.updateNetworkTokenV2({
    tokenId,
    card: {
      expirationMonth: '01',
      expirationYear: '2027',
    },
  });

  console.log('Token updated:', result.id);
  return result;
}
```

### Retrieve Network Token

```typescript
async getNetworkToken(tokenId: string) {
  const result = await this.tokenizedCardService.getNetworkTokenV2({
    tokenId,
  });

  console.log('Token details:', result);
  console.log('Network token ID:', result.metadata?.networkToken?.id);
  return result;
}
```

## Customer Management

### Create Customer

```typescript
import { CustomerService } from "@infinitesolutions/cybersource-nestjs";

@Injectable()
export class CustomerManagementService {
  constructor(private readonly customerService: CustomerService) {}

  async createCustomer() {
    const result = await this.customerService.createCustomerV2({
      buyerInformation: {
        merchantCustomerId: "customer-123",
      },
      clientReferenceInformation: {
        code: "TC50171_3",
      },
      metadata: {
        note: "Premium customer",
      },
    });

    console.log("Customer created:", result.id);
    return result;
  }
}
```

### Update Customer

```typescript
async updateCustomer(customerId: string) {
  const result = await this.customerService.updateCustomerV2({
    customerId,
    buyerInformation: {
      merchantCustomerId: 'customer-123-updated',
    },
    metadata: {
      note: 'VIP customer',
    },
  });

  console.log('Customer updated:', result.id);
  return result;
}
```

### Delete Customer

```typescript
async deleteCustomer(customerId: string) {
  await this.customerService.deleteCustomerV2({
    customerId,
  });

  console.log('Customer deleted');
}
```

## Payment Processing

### Complete Payment Flow with Validation

```typescript
import { Injectable, BadRequestException } from "@nestjs/common";
import {
  validateCardNumber,
  validateExpirationDate,
  validateCVV,
  identifyCardType,
  InstrumentIdentifierService,
  parseCyberSourceError,
  logError,
} from "@infinitesolutions/cybersource-nestjs";

@Injectable()
export class PaymentFlowService {
  constructor(
    private readonly instrumentService: InstrumentIdentifierService
  ) {}

  async processPayment(customerId: string, cardData: any, amount: number) {
    // Validate card data
    if (!validateCardNumber(cardData.number)) {
      throw new BadRequestException("Invalid card number");
    }

    const cardType = identifyCardType(cardData.number);
    if (cardType === "unknown") {
      throw new BadRequestException("Unsupported card type");
    }

    if (
      !validateExpirationDate(cardData.expirationMonth, cardData.expirationYear)
    ) {
      throw new BadRequestException("Card has expired");
    }

    if (!validateCVV(cardData.securityCode, cardType)) {
      throw new BadRequestException("Invalid CVV");
    }

    // Create instrument and process payment
    try {
      const instrument = await this.instrumentService.createCardInstrument(
        customerId,
        {
          number: cardData.number,
          expirationMonth: cardData.expirationMonth,
          expirationYear: cardData.expirationYear,
          type: this.getCardTypeCode(cardType),
        },
        {
          billTo: cardData.billingAddress,
        }
      );

      // Process payment with instrument
      // ... payment processing logic ...

      return {
        success: true,
        instrumentId: instrument.id,
        message: "Payment processed successfully",
      };
    } catch (error) {
      const parsedError = parseCyberSourceError(error);
      logError(error, {
        operation: "processPayment",
        customerId,
        amount,
      });

      throw new BadRequestException(parsedError.userMessage);
    }
  }

  private getCardTypeCode(cardType: string): string {
    const typeMap: Record<string, string> = {
      visa: "001",
      mastercard: "002",
      americanexpress: "003",
      discover: "004",
    };
    return typeMap[cardType] || "001";
  }
}
```

### Digital Wallet Integration

```typescript
async enrollForDigitalWallet(instrumentIdentifierId: string, walletType: 'apple' | 'google') {
  // Enroll card for network tokenization (required for digital wallets)
  const enrollment = await this.instrumentService.enrollCardForNetworkToken(
    instrumentIdentifierId,
    {
      processingInformation: {
        billPayment: false,
      },
      orderInformation: {
        amountDetails: {
          currency: 'USD',
        },
      },
      buyerInformation: {
        mobilePhone: 5551234567,
      },
    }
  );

  console.log(`Card enrolled for ${walletType} Pay:`, enrollment.id);

  return {
    enrollmentId: enrollment.id,
    status: enrollment.state,
    walletType,
  };
}
```

### Subscription Payment Setup

```typescript
async setupSubscription(customerId: string, cardData: any) {
  // Create reusable instrument for recurring payments
  const instrument = await this.instrumentService.createCardInstrument(
    customerId,
    {
      number: cardData.number,
      expirationMonth: cardData.expirationMonth,
      expirationYear: cardData.expirationYear,
      type: cardData.type,
    },
    {
      billTo: cardData.billingAddress,
    }
  );

  // Optionally enroll for network tokenization for better auth rates
  const enrollment = await this.instrumentService.enrollCardForNetworkToken(
    instrument.id,
    {
      processingInformation: {
        billPayment: false,
      },
      orderInformation: {
        amountDetails: {
          currency: 'USD',
        },
      },
    }
  );

  return {
    instrumentId: instrument.id,
    enrollmentId: enrollment.id,
    message: 'Subscription payment method configured',
  };
}
```

## Best Practices

### 1. Always Validate Before API Calls

```typescript
// Validate user input before sending to CyberSource
if (!validateCardNumber(cardNumber) || !validateExpirationDate(month, year)) {
  throw new BadRequestException("Invalid card data");
}
```

### 2. Use Helper Methods for Common Operations

```typescript
// Prefer helper methods over manual V2 methods
const instrument = await this.instrumentService.createCardInstrument(
  customerId,
  cardData,
  options
);
// Instead of manually constructing InstrumentIdentifierCreateDto
```

### 3. Implement Proper Error Handling

```typescript
try {
  await operation();
} catch (error) {
  const parsed = parseCyberSourceError(error);
  logError(error, { context: "operation-name" });

  if (parsed.retryable) {
    // Implement retry logic
  } else {
    // Show user-friendly error
    throw new BadRequestException(parsed.userMessage);
  }
}
```

### 4. Mask Sensitive Data in Logs

```typescript
const maskedCard = maskCardNumber(cardNumber);
console.log(`Processing payment for card: ${maskedCard}`);
```

### 5. Use Network Tokenization for Enhanced Security

```typescript
// For recurring payments or stored cards, use network tokenization
await this.instrumentService.enrollCardForNetworkToken(instrumentId, options);
```

## Additional Resources

- [CyberSource API Documentation](https://developer.cybersource.com/)
- [PROJECT-HEALTH-REPORT.md](./PROJECT-HEALTH-REPORT.md) - Comprehensive project analysis
- [SERVICE-DUPLICATION-ANALYSIS.md](./SERVICE-DUPLICATION-ANALYSIS.md) - Service method migration guide
- [MIGRATION.md](../MIGRATION.md) - Migration guide for legacy code
