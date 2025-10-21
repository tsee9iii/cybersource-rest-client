# @infinitesolutions/cybersource-nestjs

A NestJS module for integrating with the CyberSource REST API with built-in HTTP Signature authentication.

## Features

- 🔐 **Built-in Security**: Automatic HTTP Signature authentication as per CyberSource requirements
- 🏗️ **NestJS Integration**: Seamless integration with NestJS dependency injection
- 🛡️ **Type Safety**: Full TypeScript support
- 📝 **Easy Configuration**: Simple configuration through NestJS module system
- 🔄 **Automatic Headers**: Handles all required security headers automatically

## Installation

````bash
npm install @tsee9ii/cybersource-nestjs @tsee9ii/cybersource-rest-client
import { CyberSourceModule } from '@infinitesolutions/cybersource-nestjs'; # cybersource-rest-client NestJS Module

A NestJS module wrapper for the CyberSource REST API client, providing seamless integration with NestJS applications.

## Installation

```bash
npm install @infinitesolutions/cybersource-nestjs @infinitesolutions/cybersource-rest-client
````

## Usage

### 1. Import the Module

```typescript
import { Module } from "@nestjs/common";
import { CyberSourceModule } from "@infinitesolutions/cybersource-nestjs";

@Module({
  imports: [
    CyberSourceModule.forRoot({
      merchantId: "your-merchant-id",
      apiKey: "your-api-key",
      sharedSecretKey: "your-shared-secret",
      sandbox: true, // Use false for production
    }),
  ],
})
export class AppModule {}
```

### 2. Async Configuration

```typescript
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CyberSourceModule } from "@infinitesolutions/cybersource-nestjs";

@Module({
  imports: [
    ConfigModule.forRoot(),
    CyberSourceModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        merchantId: configService.get("CYBERSOURCE_MERCHANT_ID"),
        apiKey: configService.get("CYBERSOURCE_API_KEY"),
        sharedSecretKey: configService.get("CYBERSOURCE_SHARED_SECRET"),
        sandbox: configService.get("NODE_ENV") !== "production",
      }),
    }),
  ],
})
export class AppModule {}
```

### 3. Global Module Configuration (Recommended)

Register the module globally to make `CyberSourceService` available in all modules without importing:

```typescript
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CyberSourceModule } from "@infinitesolutions/cybersource-nestjs";

@Module({
  imports: [
    ConfigModule.forRoot(),
    // Option 1: Using forRootGlobal helper method
    CyberSourceModule.forRootGlobal({
      merchantId: "your-merchant-id",
      apiKey: "your-api-key",
      sharedSecretKey: "your-shared-secret",
      sandbox: true,
    }),

    // Option 2: Using forRoot with isGlobal parameter
    CyberSourceModule.forRoot(
      {
        merchantId: "your-merchant-id",
        apiKey: "your-api-key",
        sharedSecretKey: "your-shared-secret",
        sandbox: true,
      },
      true
    ), // isGlobal = true

    // Option 3: Using forRootAsyncGlobal for async configuration
    CyberSourceModule.forRootAsyncGlobal({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        merchantId: configService.get("CYBERSOURCE_MERCHANT_ID"),
        apiKey: configService.get("CYBERSOURCE_API_KEY"),
        sharedSecretKey: configService.get("CYBERSOURCE_SHARED_SECRET"),
        sandbox: configService.get("NODE_ENV") !== "production",
      }),
    }),

    // Option 4: Using forRootAsync with isGlobal option
    CyberSourceModule.forRootAsync({
      inject: [ConfigService],
      isGlobal: true, // Makes module global
      useFactory: (configService: ConfigService) => ({
        merchantId: configService.get("CYBERSOURCE_MERCHANT_ID"),
        apiKey: configService.get("CYBERSOURCE_API_KEY"),
        sharedSecretKey: configService.get("CYBERSOURCE_SHARED_SECRET"),
        sandbox: configService.get("NODE_ENV") !== "production",
      }),
    }),
  ],
})
export class AppModule {}
```

**Benefits of Global Registration:**

- ✅ No need to import `CyberSourceModule` in feature modules
- ✅ `CyberSourceService` available everywhere by injection
- ✅ Cleaner module imports
- ✅ Single configuration point

### 4. Using in Feature Modules (Global Registration)

When registered globally, you can directly inject the service without importing the module:

```typescript
// feature.module.ts
import { Module } from "@nestjs/common";
import { PaymentService } from "./payment.service";

@Module({
  // No need to import CyberSourceModule when it's global
  providers: [PaymentService],
})
export class FeatureModule {}

// payment.service.ts
import { Injectable } from "@nestjs/common";
import { CyberSourceService } from "@infinitesolutions/cybersource-nestjs";

@Injectable()
export class PaymentService {
  constructor(private readonly cyberSource: CyberSourceService) {}

  async processPayment() {
    // Use cyberSource service directly
  }
}
```

### 5. Inject and Use the Service

```typescript
import { Injectable } from "@nestjs/common";
import { CyberSourceService } from "@infinitesolutions/cybersource-nestjs";

@Injectable()
export class PaymentService {
  constructor(private readonly cyberSource: CyberSourceService) {}

  async processPayment(paymentData: any) {
    const paymentRequest = {
      clientReferenceInformation: {
        code: `order-${Date.now()}`,
      },
      processingInformation: {
        capture: false,
      },
      paymentInformation: {
        card: {
          number: paymentData.cardNumber,
          expirationMonth: paymentData.expirationMonth,
          expirationYear: paymentData.expirationYear,
          securityCode: paymentData.cvv,
        },
      },
      orderInformation: {
        amountDetails: {
          totalAmount: paymentData.amount,
          currency: "USD",
        },
        billTo: {
          firstName: paymentData.firstName,
          lastName: paymentData.lastName,
          address1: paymentData.address,
          locality: paymentData.city,
          administrativeArea: paymentData.state,
          postalCode: paymentData.zipCode,
          country: paymentData.country,
          email: paymentData.email,
        },
      },
    };

    try {
      const result = await this.cyberSource.createPayment(paymentRequest);
      return {
        success: true,
        transactionId: result.id,
        status: result.status,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        details: error,
      };
    }
  }

  async capturePayment(paymentId: string, amount?: string) {
    const captureRequest = {
      orderInformation: {
        amountDetails: {
          totalAmount: amount,
        },
      },
    };

    return await this.cyberSource.capturePayment(paymentId, captureRequest);
  }

  async refundPayment(paymentId: string, amount?: string) {
    const refundRequest = {
      orderInformation: {
        amountDetails: {
          totalAmount: amount,
        },
      },
    };

    return await this.cyberSource.refundPayment(paymentId, refundRequest);
  }
}
```

### 4. Direct API Access

```typescript
import { Injectable } from "@nestjs/common";
import { CyberSourceService } from "@infinitesolutions/cybersource-nestjs";

@Injectable()
export class AdvancedPaymentService {
  constructor(private readonly cyberSource: CyberSourceService) {}

  async createCustomer(customerData: any) {
    // Direct access to Customer API
    return await this.cyberSource.customer.postCustomer(customerData);
  }

  async generateReport(reportRequest: any) {
    // Direct access to Reports API
    return await this.cyberSource.reports.createReport(reportRequest);
  }

  async performBinLookup(cardNumber: string) {
    // Direct access to BIN Lookup API
    const request = {
      paymentInformation: {
        card: {
          number: cardNumber.substring(0, 6), // First 6 digits for BIN lookup
        },
      },
    };
    return await this.cyberSource.binLookup.getAccountInfo(request);
  }
}
```

## Available APIs

The service provides access to all CyberSource APIs through both high-level methods and direct API access:

### High-Level Methods

- `createPayment(request)` - Process payments
- `capturePayment(id, request)` - Capture authorized payments
- `refundPayment(id, request)` - Process refunds
- `voidPayment(id, request)` - Void transactions

### Direct API Access

- `cyberSource.payments` - PaymentsApi
- `cyberSource.capture` - CaptureApi
- `cyberSource.refund` - RefundApi
- `cyberSource.void` - VoidApi
- `cyberSource.customer` - CustomerApi
- `cyberSource.paymentTokens` - PaymentTokensApi
- `cyberSource.verification` - VerificationApi
- `cyberSource.payerAuth` - PayerAuthenticationApi
- `cyberSource.decisionManager` - DecisionManagerApi
- `cyberSource.reports` - ReportsApi
- `cyberSource.binLookup` - BinLookupApi
- `cyberSource.taxes` - TaxesApi
- `cyberSource.subscriptions` - SubscriptionsApi
- `cyberSource.plans` - PlansApi

## Configuration Options

```typescript
interface CyberSourceConfig {
  merchantId: string; // Your CyberSource Merchant ID
  apiKey: string; // Your CyberSource API Key
  sharedSecretKey: string; // Your CyberSource Shared Secret
  basePath?: string; // Custom API endpoint (optional)
  timeout?: number; // Request timeout in milliseconds (default: 30000)
  sandbox?: boolean; // Use sandbox environment (default: true)
}
```

## Error Handling

The module includes comprehensive error handling and logging:

```typescript
try {
  const result = await this.cyberSource.createPayment(paymentRequest);
  console.log("Payment successful:", result.id);
} catch (error) {
  if (error.response) {
    console.error("API Error:", error.response.statusCode);
    console.error("Error details:", error.body);
  } else {
    console.error("Request failed:", error.message);
  }
}
```

## License

MIT
