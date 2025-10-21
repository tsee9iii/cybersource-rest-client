# CyberSource NestJS Package - Services and DTOs

## What's New

This package now includes comprehensive services, DTOs, and response types for better type safety and developer experience.

## Quick Usage

```typescript
import {
  PaymentService,
  TokenService,
  VerificationService,
  CreatePaymentDto,
  CreatePaymentResponse,
} from "@infinitesolutions/cybersource-nestjs";

@Injectable()
export class MyPaymentService {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly verificationService: VerificationService
  ) {}

  async processQuickPayment() {
    // Quick payment with type safety
    return await this.paymentService.quickPayment({
      amount: "100.00",
      currency: "USD",
      cardNumber: "4111111111111111",
      expirationMonth: "12",
      expirationYear: "2031",
      cvv: "123",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      address: "123 Main St",
      city: "San Francisco",
      state: "CA",
      zipCode: "94105",
      country: "US",
    });
  }
}
```

## Services Included

1. **PaymentService** - Full payment lifecycle management
2. **TokenService** - Customer and token management
3. **VerificationService** - Card verification and validation
4. **CyberSourceService** - Base service for direct API access

## DTOs Included

1. **Payment DTOs** - CreatePaymentDto, CapturePaymentDto, RefundPaymentDto, etc.
2. **Common DTOs** - AmountDetailsDto, BillToDto, CardDto, etc.
3. **Response DTOs** - Structured response types with proper typing

## Benefits

- ✅ **Full Type Safety** - No more `any` types
- ✅ **Structured Results** - Consistent success/error handling
- ✅ **Comprehensive Logging** - Built-in secure logging
- ✅ **Validation Ready** - DTOs ready for class-validator
- ✅ **Developer Friendly** - IntelliSense and auto-completion
