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

### 5. Inject and Use Services

#### Using Specialized Services (Recommended)

```typescript
import { Injectable } from "@nestjs/common";
import {
  PaymentService,
  TokenService,
  VerificationService,
} from "@infinitesolutions/cybersource-nestjs";

@Injectable()
export class PaymentProcessor {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly tokenService: TokenService,
    private readonly verificationService: VerificationService
  ) {}

  async processPayment(paymentData: any) {
    // Quick payment processing
    const result = await this.paymentService.quickPayment({
      amount: paymentData.amount,
      currency: "USD",
      cardNumber: paymentData.cardNumber,
      expirationMonth: paymentData.expMonth,
      expirationYear: paymentData.expYear,
      cvv: paymentData.cvv,
      firstName: paymentData.firstName,
      lastName: paymentData.lastName,
      email: paymentData.email,
      address: paymentData.address,
      city: paymentData.city,
      state: paymentData.state,
      zipCode: paymentData.zipCode,
      country: "US",
      capture: true,
    });

    return result;
  }
}
```

#### Customer Management Examples

```typescript
import { Injectable } from "@nestjs/common";
import {
  CustomerService,
  CustomerCreateDto,
  CustomerUpdateDto,
  ShippingAddressCreateDto,
} from "@infinitesolutions/cybersource-nestjs";

@Injectable()
export class CustomerManagementService {
  constructor(private readonly customerService: CustomerService) {}

  // Create a new customer with billing and shipping information
  async createNewCustomer(customerData: any) {
    const customerRequest: CustomerCreateDto = {
      buyerInformation: {
        merchantCustomerId: customerData.merchantCustomerId,
        email: customerData.email,
      },
      clientReferenceInformation: {
        code: customerData.referenceCode,
      },
      paymentInformation: {
        card: {
          expirationYear: customerData.expirationYear,
          expirationMonth: customerData.expirationMonth,
          number: customerData.cardNumber,
        },
      },
      billTo: {
        firstName: customerData.firstName,
        lastName: customerData.lastName,
        address1: customerData.address1,
        locality: customerData.city,
        administrativeArea: customerData.state,
        postalCode: customerData.zipCode,
        country: customerData.country,
        email: customerData.email,
        phoneNumber: customerData.phone,
      },
    };

    try {
      const customer = await this.customerService.createCustomer(
        customerRequest
      );
      console.log("Customer created:", customer.id);
      return customer;
    } catch (error) {
      console.error("Error creating customer:", error);
      throw error;
    }
  }

  // Get customer details
  async getCustomerDetails(customerId: string) {
    try {
      const customer = await this.customerService.getCustomer(customerId);
      return customer;
    } catch (error) {
      console.error("Error fetching customer:", error);
      throw error;
    }
  }

  // Update customer information
  async updateCustomerInfo(customerId: string, updates: any) {
    const updateRequest: CustomerUpdateDto = {
      buyerInformation: {
        email: updates.email,
      },
      billTo: {
        firstName: updates.firstName,
        lastName: updates.lastName,
        email: updates.email,
        phoneNumber: updates.phone,
      },
    };

    try {
      const updatedCustomer = await this.customerService.updateCustomer(
        customerId,
        updateRequest
      );
      return updatedCustomer;
    } catch (error) {
      console.error("Error updating customer:", error);
      throw error;
    }
  }

  // Add a shipping address to customer
  async addShippingAddress(customerId: string, shippingData: any) {
    const shippingRequest: ShippingAddressCreateDto = {
      default: shippingData.isDefault || false,
      shipTo: {
        firstName: shippingData.firstName,
        lastName: shippingData.lastName,
        company: shippingData.company,
        address1: shippingData.address1,
        address2: shippingData.address2,
        locality: shippingData.city,
        administrativeArea: shippingData.state,
        postalCode: shippingData.zipCode,
        country: shippingData.country,
        email: shippingData.email,
        phoneNumber: shippingData.phone,
      },
    };

    try {
      const shippingAddress = await this.customerService.createShippingAddress(
        customerId,
        shippingRequest
      );
      console.log("Shipping address created:", shippingAddress.id);
      return shippingAddress;
    } catch (error) {
      console.error("Error creating shipping address:", error);
      throw error;
    }
  }

  // Get all shipping addresses for a customer
  async getCustomerShippingAddresses(customerId: string, page = 0, limit = 20) {
    try {
      const addresses = await this.customerService.getShippingAddresses(
        customerId,
        { offset: page * limit, limit }
      );
      return addresses;
    } catch (error) {
      console.error("Error fetching shipping addresses:", error);
      throw error;
    }
  }

  // Update a shipping address
  async updateShippingAddress(
    customerId: string,
    addressId: string,
    updates: any
  ) {
    const updateRequest = {
      default: updates.isDefault,
      shipTo: {
        firstName: updates.firstName,
        lastName: updates.lastName,
        address1: updates.address1,
        locality: updates.city,
        administrativeArea: updates.state,
        postalCode: updates.zipCode,
        country: updates.country,
        email: updates.email,
        phoneNumber: updates.phone,
      },
    };

    try {
      const updatedAddress = await this.customerService.updateShippingAddress(
        customerId,
        addressId,
        updateRequest
      );
      return updatedAddress;
    } catch (error) {
      console.error("Error updating shipping address:", error);
      throw error;
    }
  }

  // Delete a customer and all associated data
  async removeCustomer(customerId: string) {
    try {
      await this.customerService.deleteCustomer(customerId);
      console.log("Customer deleted successfully");
    } catch (error) {
      console.error("Error deleting customer:", error);
      throw error;
    }
  }

  // Complete customer lifecycle example
  async customerLifecycleExample() {
    try {
      // 1. Create customer
      const customer = await this.createNewCustomer({
        merchantCustomerId: "CUST_001",
        email: "customer@example.com",
        firstName: "John",
        lastName: "Doe",
        address1: "123 Main St",
        city: "San Francisco",
        state: "CA",
        zipCode: "94102",
        country: "US",
        phone: "+1-555-123-4567",
        cardNumber: "4111111111111111",
        expirationMonth: "12",
        expirationYear: "2025",
        referenceCode: "ORDER_12345",
      });

      // 2. Add additional shipping address
      await this.addShippingAddress(customer.id!, {
        firstName: "John",
        lastName: "Doe",
        company: "Acme Corp",
        address1: "456 Business Ave",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "US",
        email: "john.doe@acme.com",
        phone: "+1-555-987-6543",
        isDefault: false,
      });

      // 3. Get all shipping addresses
      const addresses = await this.getCustomerShippingAddresses(customer.id!);
      console.log(`Customer has ${addresses.count} shipping addresses`);

      // 4. Update customer email
      await this.updateCustomerInfo(customer.id!, {
        email: "john.doe.updated@example.com",
        firstName: "John",
        lastName: "Doe",
        phone: "+1-555-123-4567",
      });

      return customer;
    } catch (error) {
      console.error("Customer lifecycle error:", error);
      throw error;
    }
  }
}
```

#### Using Base CyberSourceService

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

## Available Services

### PaymentService (Specialized Payment Processing)

- `createPayment(request)` - Create a new payment with full type safety
- `authorizePayment(request)` - Authorization-only transactions
- `salePayment(request)` - Sale (auth + capture) transactions
- `capturePayment(id, request)` - Capture an authorized payment
- `refundPayment(id, request)` - Process refunds
- `voidPayment(id, request)` - Void transactions
- `incrementAuth(id, request)` - Increase authorization amount
- `quickPayment(options)` - Simplified payment with minimal data

### CustomerService (Customer Management)

- `createCustomer(request)` - Create customer profiles
- `getCustomer(customerId)` - Retrieve customer information
- `updateCustomer(customerId, request)` - Update customer data
- `deleteCustomer(customerId)` - Remove customer profiles
- `createShippingAddress(customerId, request)` - Add shipping addresses
- `getShippingAddresses(customerId, pagination?)` - List customer shipping addresses
- `getShippingAddress(customerId, addressId)` - Get specific shipping address
- `updateShippingAddress(customerId, addressId, request)` - Update shipping address
- `deleteShippingAddress(customerId, addressId)` - Remove shipping address
- `createPaymentInstrument(customerId, request)` - Add customer payment instruments
- `getPaymentInstruments(customerId, pagination?)` - List customer payment instruments
- `getPaymentInstrument(customerId, instrumentId)` - Get specific payment instrument
- `updatePaymentInstrument(customerId, instrumentId, request)` - Update payment instrument
- `deletePaymentInstrument(customerId, instrumentId)` - Remove payment instrument

### PaymentInstrumentService (Standalone Payment Instruments)

- `createPaymentInstrument(request)` - Create standalone payment instruments
- `getPaymentInstrument(instrumentId, options?)` - Retrieve payment instrument details
- `updatePaymentInstrument(instrumentId, request, options?)` - Update payment instrument
- `deletePaymentInstrument(instrumentId)` - Remove payment instrument
- `createCustomerPaymentInstrument(customerId, request)` - Create customer payment instrument
- `listCustomerPaymentInstruments(customerId, options?)` - List customer payment instruments
- `getCustomerPaymentInstrument(customerId, instrumentId)` - Get customer payment instrument
- `updateCustomerPaymentInstrument(customerId, instrumentId, request)` - Update customer payment instrument
- `deleteCustomerPaymentInstrument(customerId, instrumentId)` - Remove customer payment instrument

### TokenService (Token Management)

- `createToken(request)` - Create payment tokens
- `createCustomer(request)` - Create customer profiles
- `getCustomer(customerId)` - Retrieve customer information
- `updateCustomer(customerId, request)` - Update customer data
- `deleteCustomer(customerId)` - Remove customer profiles
- `createPaymentInstrument(customerId, request)` - Add payment methods
- `getPaymentInstrument(customerId, instrumentId)` - Get token details
- `deletePaymentInstrument(customerId, instrumentId)` - Remove tokens

### VerificationService (Card Verification)

- `verifyCard(request)` - Verify card without payment
- `verifyAddress(request)` - Address Verification Service (AVS)
- `verifyCVV(request)` - CVV verification
- `quickCardVerification(options)` - Simple card validation
- `validateCardNumber(cardNumber)` - Luhn algorithm validation
- `identifyCardType(cardNumber)` - Detect card brand
- `validateExpirationDate(month, year)` - Expiry validation

### CyberSourceService (Base Service)

- `createPayment(request)` - Core payment processing
- `capturePayment(id, request)` - Core capture functionality
- `refundPayment(id, request)` - Core refund processing
- `voidPayment(id, request)` - Core void functionality
- `apiClient` - Direct access to underlying API
- Organized endpoint access: `payments`, `tms`, `risk`, `reporting`

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
