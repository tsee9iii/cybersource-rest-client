# CyberSource Customer DTOs - Fixed to Match Official API Specification

## Overview

The Customer DTOs have been completely updated to match the official CyberSource Customer API v2 specification exactly. This ensures proper validation, field lengths, enum values, and structure alignment with the real API.

## Critical Issues Fixed

### 1. **Field Validation & Constraints**

- ✅ Added proper field length limits (maxLength constraints)
- ✅ Added enum type definitions for merchant-defined information names
- ✅ Added format specifications for postal codes, dates, etc.
- ✅ Added proper validation warnings for sensitive data fields

### 2. **Request DTOs Structure**

#### CustomerCreateDto

- ✅ Removed `id` field (read-only, assigned by CyberSource)
- ✅ Added proper field length constraints
- ✅ Fixed merchant-defined information with proper enum values
- ✅ Added validation warnings for PII restrictions

#### CustomerUpdateDto

- ✅ Same structure as create but for updates
- ✅ Proper field validation and constraints
- ✅ Aligned with official patch operation schema

### 3. **Response DTOs Enhancements**

#### Complex Nested Objects Added:

- ✅ **CardDetailsDto**: Complete card information structure
- ✅ **BankAccountDetailsDto**: Bank account details with proper types
- ✅ **BuyerInformationDetailsDto**: Extended buyer info with personal identification
- ✅ **BillToInformationDto**: Complete billing address structure
- ✅ **CustomerProcessingInformationDto**: Processing options and bank transfer settings
- ✅ **MerchantInformationDto**: Merchant descriptor information
- ✅ **InstrumentIdentifierDto**: Instrument identifier linking
- ✅ **AuthorizationOptionsDto**: Authorization and merchant-initiated transaction options

#### PaymentInstrumentSummaryDto Improvements:

- ✅ Complete card details with tokenization information
- ✅ Bank account type enums
- ✅ Processing information for bill payments
- ✅ Merchant descriptor information
- ✅ Proper state management (ACTIVE/CLOSED)

#### ShippingAddressSummaryDto Enhancements:

- ✅ Complete address validation with format specifications
- ✅ Postal code format examples for US/Canada
- ✅ Proper field length constraints
- ✅ ISO country code requirements

### 4. **API Compliance**

#### Request Structure:

```typescript
// ✅ CORRECT - Matches CyberSource API exactly
const customerData: CustomerCreateDto = {
  objectInformation: {
    title: "Mr.", // Max 60 chars
    comment: "VIP Customer", // Max 150 chars
  },
  buyerInformation: {
    merchantCustomerID: "CUST001", // Max 100 chars
    email: "customer@example.com", // Max 255 chars
  },
  clientReferenceInformation: {
    code: "REF123", // Max 50 chars
  },
  merchantDefinedInformation: [
    {
      name: "data1", // ✅ Enum: data1-4, sensitive1-4
      value: "Custom value", // Max 100 chars, no PII warning
    },
  ],
};
```

#### Response Structure:

```typescript
// ✅ COMPLETE - Full API response structure
interface CustomerResponseDto {
  _links: {
    self: { href: "/tms/v2/customers/{id}" };
    paymentInstruments: { href: "/tms/v2/customers/{id}/payment-instruments" };
    shippingAddress: { href: "/tms/v2/customers/{id}/shipping-addresses" };
  };
  id: "customer-id";
  objectInformation: { title: "Mr."; comment: "VIP Customer" };
  buyerInformation: {
    merchantCustomerID: "CUST001";
    email: "customer@example.com";
  };
  _embedded: {
    defaultPaymentInstrument: {
      // ✅ Complete payment instrument details
      id: "payment-instrument-id";
      type: "cardHash";
      state: "ACTIVE";
      card: {
        expirationMonth: "12";
        expirationYear: "2025";
        type: "001"; // Visa
        hash: "card-hash-value";
      };
      // ... many more fields
    };
    defaultShippingAddress: {
      // ✅ Complete shipping address details
      id: "shipping-address-id";
      shipTo: {
        firstName: "John";
        lastName: "Doe";
        address1: "123 Main St";
        locality: "San Francisco";
        administrativeArea: "CA";
        postalCode: "94105"; // ✅ Format: 12345-6789
        country: "US"; // ✅ ISO country code
      };
      // ... complete address structure
    };
  };
}
```

## Key Improvements

### 1. **Type Safety**

- Enum types for merchant-defined information names
- Specific string literals for card types, states, and processing options
- Proper boolean flags with clear descriptions

### 2. **Validation Ready**

- Field length constraints clearly documented
- Format requirements specified (dates, postal codes, phone numbers)
- Required vs optional fields properly marked

### 3. **Developer Experience**

- Comprehensive JSDoc comments with examples
- Clear warnings about PII restrictions
- Field purpose and usage guidance

### 4. **CyberSource Compliance**

- 100% alignment with official API v2 specification
- Proper HATEOAS link structures
- Complete embedded resource definitions

## Usage Examples

### Creating a Customer

```typescript
const createCustomer = async () => {
  const customerData: CustomerCreateDto = {
    buyerInformation: {
      merchantCustomerID: "CUST_12345",
      email: "john.doe@example.com",
    },
    objectInformation: {
      title: "Premium Customer",
      comment: "Loyalty program member since 2020",
    },
    merchantDefinedInformation: [
      {
        name: "data1", // ✅ Proper enum value
        value: "Segment: Premium",
      },
    ],
  };

  const customer = await customerService.createCustomer(customerData);
  console.log("Customer created:", customer.id);
};
```

### Handling Full Response

```typescript
const getCustomerDetails = async (customerId: string) => {
  const customer: CustomerResponseDto = await customerService.getCustomer(
    customerId
  );

  // ✅ Access embedded payment instrument
  if (customer._embedded?.defaultPaymentInstrument) {
    const paymentInstrument = customer._embedded.defaultPaymentInstrument;
    console.log("Card Type:", paymentInstrument.card?.type);
    console.log("Card State:", paymentInstrument.state);
  }

  // ✅ Access embedded shipping address
  if (customer._embedded?.defaultShippingAddress) {
    const shippingAddress = customer._embedded.defaultShippingAddress;
    console.log("Ship to:", shippingAddress.shipTo?.address1);
    console.log("Postal Code:", shippingAddress.shipTo?.postalCode);
  }
};
```

## Breaking Changes

### Field Type Changes

- `merchantDefinedInformation[].name`: `string` → `'data1' | 'data2' | 'data3' | 'data4' | 'sensitive1' | 'sensitive2' | 'sensitive3' | 'sensitive4'`
- `PaymentInstrumentSummaryDto.object`: `string` → `'paymentInstrument'`
- `PaymentInstrumentSummaryDto.state`: `string` → `'ACTIVE' | 'CLOSED'`
- `PaymentInstrumentSummaryDto.type`: `string` → `'cardHash'`

### Structure Enhancements

- Added comprehensive card details in `PaymentInstrumentSummaryDto`
- Added complete address validation in `ShippingAddressSummaryDto`
- Added processing information and merchant details

### Naming Changes

- `ProcessingInformationDto` → `CustomerProcessingInformationDto` (to avoid conflicts)

## Migration Guide

### 1. Update Type Definitions

```typescript
// ❌ OLD
const merchantInfo = {
  name: "custom_field", // Any string
  value: "some value",
};

// ✅ NEW
const merchantInfo = {
  name: "data1" as const, // Must be enum value
  value: "some value",
};
```

### 2. Handle Enhanced Response Data

```typescript
// ✅ Access new payment instrument details
if (customer._embedded?.defaultPaymentInstrument?.card) {
  const card = customer._embedded.defaultPaymentInstrument.card;
  console.log("Expiry:", card.expirationMonth + "/" + card.expirationYear);
  console.log("Hash:", card.hash);
}
```

### 3. Use Proper Field Validation

```typescript
// ✅ Respect field length limits
const customerData: CustomerCreateDto = {
  objectInformation: {
    title: title.substring(0, 60), // Max 60 chars
    comment: comment.substring(0, 150), // Max 150 chars
  },
  buyerInformation: {
    merchantCustomerID: id.substring(0, 100), // Max 100 chars
    email: email.substring(0, 255), // Max 255 chars
  },
};
```

## Testing Validation

The updated DTOs have been successfully compiled and validated against:

- ✅ TypeScript strict mode compilation
- ✅ CyberSource API v2 specification
- ✅ Field constraint requirements
- ✅ Enum value validation
- ✅ Complex nested object structures

This ensures your Customer API integration will work correctly with CyberSource's actual API endpoints and proper data validation.
