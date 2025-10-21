# Payment Instrument Services Implementation

This document provides an overview of the comprehensive payment instrument services that have been implemented for the CyberSource REST API client.

## Overview

The implementation provides complete support for CyberSource's Token Management System (TMS) v2.0 payment instrument APIs, covering four major service categories:

1. **Customer Payment Instruments** - Payment instruments associated with customers
2. **Standalone Payment Instruments** - Independent payment instruments
3. **Instrument Identifiers** - Card/bank account number tokenization with network token support
4. **Tokenized Cards** - Network token management

## Services Implemented

### 1. CustomerPaymentInstrumentService

**File**: `services/customer-payment-instrument.service.ts`

**Methods**:

- `createCustomerPaymentInstrument(customerId, paymentInstrumentData)` - Create payment instrument for customer
- `listCustomerPaymentInstruments(customerId, options?)` - List customer's payment instruments with pagination
- `getCustomerPaymentInstrument(customerId, paymentInstrumentId)` - Retrieve specific payment instrument
- `updateCustomerPaymentInstrument(customerId, paymentInstrumentId, updateData)` - Update payment instrument
- `deleteCustomerPaymentInstrument(customerId, paymentInstrumentId)` - Delete payment instrument

**API Endpoints**:

- `POST /tms/v2/customers/{customerId}/payment-instruments`
- `GET /tms/v2/customers/{customerId}/payment-instruments`
- `GET /tms/v2/customers/{customerId}/payment-instruments/{paymentInstrumentId}`
- `PATCH /tms/v2/customers/{customerId}/payment-instruments/{paymentInstrumentId}`
- `DELETE /tms/v2/customers/{customerId}/payment-instruments/{paymentInstrumentId}`

### 2. PaymentInstrumentService

**File**: `services/payment-instrument.service.ts`

**Methods**:

- `createPaymentInstrument(paymentInstrumentData)` - Create standalone payment instrument
- `getPaymentInstrument(paymentInstrumentId)` - Retrieve payment instrument
- `updatePaymentInstrument(paymentInstrumentId, updateData)` - Update payment instrument
- `deletePaymentInstrument(paymentInstrumentId)` - Delete payment instrument

**API Endpoints**:

- `POST /tms/v1/paymentinstruments`
- `GET /tms/v1/paymentinstruments/{paymentInstrumentId}`
- `PATCH /tms/v1/paymentinstruments/{paymentInstrumentId}`
- `DELETE /tms/v1/paymentinstruments/{paymentInstrumentId}`

### 3. InstrumentIdentifierService

**File**: `services/instrument-identifier.service.ts`

**Methods**:

- `createInstrumentIdentifier(identifierData)` - Create instrument identifier (tokenize card/bank account)
- `getInstrumentIdentifier(instrumentIdentifierId)` - Retrieve instrument identifier
- `updateInstrumentIdentifier(instrumentIdentifierId, updateData)` - Update instrument identifier
- `deleteInstrumentIdentifier(instrumentIdentifierId)` - Delete instrument identifier
- `listPaymentInstruments(instrumentIdentifierId, options?)` - List payment instruments for identifier
- `enrollForNetworkToken(instrumentIdentifierId, enrollmentData)` - Enroll for network token provisioning

**API Endpoints**:

- `POST /tms/v1/instrumentidentifiers`
- `GET /tms/v1/instrumentidentifiers/{instrumentIdentifierId}`
- `PATCH /tms/v1/instrumentidentifiers/{instrumentIdentifierId}`
- `DELETE /tms/v1/instrumentidentifiers/{instrumentIdentifierId}`
- `GET /tms/v1/instrumentidentifiers/{instrumentIdentifierId}/paymentinstruments`
- `POST /tms/v1/instrumentidentifiers/{instrumentIdentifierId}/enrollment`

### 4. TokenizedCardService

**File**: `services/tokenized-card.service.ts`

**Methods**:

- `createTokenizedCard(tokenizedCardData)` - Create network token
- `getTokenizedCard(tokenizedCardId)` - Retrieve tokenized card
- `deleteTokenizedCard(tokenizedCardId)` - Delete tokenized card

**API Endpoints**:

- `POST /tms/v1/tokenizedcards`
- `GET /tms/v1/tokenizedcards/{tokenizedCardId}`
- `DELETE /tms/v1/tokenizedcards/{tokenizedCardId}`

## TypeScript Interfaces

**File**: `interfaces/payment-instrument.interfaces.ts`

The implementation includes comprehensive TypeScript interfaces covering:

### Core Data Types

- `CardInformation` - Credit/debit card data
- `BankAccountInformation` - ACH bank account data
- `BillToInformation` - Billing address information
- `ProcessingInformation` - Payment processing configuration
- `TokenProvisioningInformation` - Network token provisioning settings
- `BinLookup` - Bank Identification Number lookup data
- `Metadata` - Custom metadata and scopes

### Request/Response Types

- `CustomerPaymentInstrumentRequest/Response` - Customer payment instrument operations
- `PaymentInstrumentRequest/Response` - Standalone payment instrument operations
- `InstrumentIdentifierRequest/Response` - Instrument identifier operations
- `TokenizedCardRequest/Response` - Network token operations
- `*UpdateRequest` - Update operation payloads
- `*ListResponse` - List operation responses with pagination

### Pagination Support

- `CustomerPaymentInstrumentListOptions`
- `PaymentInstrumentListOptions`
- `InstrumentIdentifierListOptions`
- `PaginationLinks` - HAL-style pagination links

### Advanced Features

- **BIN Lookup Integration**: Card metadata including issuer, network, product type, and regional information
- **Network Token Support**: Apple Pay, Google Pay, Samsung Pay tokenization with card art assets
- **Embedded Resources**: HAL-style embedded related resources in list responses
- **Comprehensive Metadata**: Support for custom business logic and authorization options

## Module Integration

The services are integrated into the main `CyberSourceModule`:

```typescript
import { CyberSourceModule } from "@your-org/cybersource-rest-client/nestjs";

@Module({
  imports: [
    CyberSourceModule.forRoot({
      merchantId: "your-merchant-id",
      apiKey: "your-api-key",
      sharedSecretKey: "your-shared-secret",
      sandbox: true,
    }),
  ],
})
export class AppModule {}
```

## Usage Examples

### Customer Payment Instruments

```typescript
import { CustomerPaymentInstrumentService } from "@your-org/cybersource-rest-client/nestjs";

@Injectable()
export class PaymentService {
  constructor(
    private customerPaymentInstrumentService: CustomerPaymentInstrumentService
  ) {}

  async createCustomerCard(customerId: string) {
    return this.customerPaymentInstrumentService.createCustomerPaymentInstrument(
      customerId,
      {
        card: {
          number: "4111111111111111",
          expirationMonth: "12",
          expirationYear: "2025",
        },
        billTo: {
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
        },
        default: true,
      }
    );
  }
}
```

### Network Token Enrollment

```typescript
import { InstrumentIdentifierService } from "@your-org/cybersource-rest-client/nestjs";

@Injectable()
export class TokenService {
  constructor(
    private instrumentIdentifierService: InstrumentIdentifierService
  ) {}

  async enrollForApplePay(instrumentIdentifierId: string) {
    return this.instrumentIdentifierService.enrollForNetworkToken(
      instrumentIdentifierId,
      {
        tokenProvisioningInformation: {
          walletType: "ApplePay",
          enrollmentId: "your-enrollment-id",
        },
      }
    );
  }
}
```

## Error Handling

All services include comprehensive error handling with:

- Structured logging using NestJS Logger
- Detailed error context including operation parameters
- Proper error propagation for client handling
- Request/response tracing for debugging

## Features Supported

✅ **Complete CRUD Operations**: Create, Read, Update, Delete for all entity types  
✅ **Pagination Support**: Offset/limit pagination with configurable page sizes  
✅ **Network Tokenization**: Apple Pay, Google Pay, Samsung Pay integration  
✅ **BIN Lookup Integration**: Comprehensive card metadata retrieval  
✅ **Embedded Resources**: HAL-style linked and embedded resource support  
✅ **Type Safety**: Full TypeScript interface coverage for all operations  
✅ **Authentication**: HTTP Signature authentication with CyberSource  
✅ **Logging**: Structured request/response logging for audit trails  
✅ **Error Handling**: Comprehensive error handling with detailed context

This implementation provides a complete, production-ready solution for CyberSource payment instrument management with full TypeScript support and NestJS integration.
