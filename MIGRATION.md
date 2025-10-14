# Migration Guide: v1.x to v2.0.0

This guide helps you migrate from CyberSource REST Client v1.x to v2.0.0.

## What's Changed

### API Architecture

- **v1.x**: Multiple individual API classes (PaymentsApi, CaptureApi, etc.)
- **v2.0.0**: Single `Api` class with organized namespaces (pts, tms, risk, etc.)

### HTTP Client

- **v1.x**: Uses `request` library with `http.ClientResponse`
- **v2.0.0**: Uses native `fetch` API with proper TypeScript types

### Dependencies

- **v1.x**: Required `request`, `bluebird`, `@types/request`
- **v2.0.0**: Zero external dependencies

## Migration Steps

### 1. Update Dependencies

```json
{
  "dependencies": {
    "@tsee9ii/cybersource-rest-client": "^2.0.0",
    "@tsee9ii/cybersource-nestjs": "^2.0.0"
  }
}
```

### 2. Update Imports

**v1.x:**

```typescript
import {
  PaymentsApi,
  CaptureApi,
  CreatePaymentRequest,
} from "@tsee9ii/cybersource-rest-client";
```

**v2.0.0:**

```typescript
import { Api } from "@tsee9ii/cybersource-rest-client";
```

### 3. Update API Initialization

**v1.x:**

```typescript
const paymentsApi = new PaymentsApi();
const captureApi = new CaptureApi();
paymentsApi.basePath = "https://apitest.cybersource.com";
```

**v2.0.0:**

```typescript
const api = new Api({
  baseUrl: "https://apitest.cybersource.com",
});
```

### 4. Update Method Calls

**v1.x:**

```typescript
const response = await paymentsApi.createPayment(request);
const result = response.body;
```

**v2.0.0:**

```typescript
const response = await api.pts.createPayment(request);
const result = response.data;
```

### 5. Update Type Definitions

**v1.x:**

```typescript
import { CreatePaymentRequest } from "@tsee9ii/cybersource-rest-client";
```

**v2.0.0:**

```typescript
// Types are now inline - use direct object types or any for flexibility
const request = {
  clientReferenceInformation: {
    code: "test123",
  },
  // ... other properties
};
```

## API Method Mapping

| v1.x                                 | v2.0.0                                  |
| ------------------------------------ | --------------------------------------- |
| `paymentsApi.createPayment()`        | `api.pts.createPayment()`               |
| `captureApi.capturePayment()`        | `api.pts.capturePayment()`              |
| `refundApi.refundPayment()`          | `api.pts.refundPayment()`               |
| `voidApi.voidPayment()`              | `api.pts.voidPayment()`                 |
| `customerApi.createCustomer()`       | `api.tms.createCustomer()`              |
| `reportsApi.getTransactionDetails()` | `api.reporting.getTransactionDetails()` |

## NestJS Service Changes

### v1.x Service Usage:

```typescript
@Injectable()
export class PaymentService {
  constructor(private cyberSource: CyberSourceService) {}

  async processPayment(request: CreatePaymentRequest) {
    return await this.cyberSource.createPayment(request);
  }

  // Access individual APIs
  get paymentsApi() {
    return this.cyberSource.payments;
  }
}
```

### v2.0.0 Service Usage:

```typescript
@Injectable()
export class PaymentService {
  constructor(private cyberSource: CyberSourceService) {}

  async processPayment(request: any) {
    return await this.cyberSource.createPayment(request);
  }

  // Access the unified API
  get api() {
    return this.cyberSource.apiClient;
  }

  // Access organized namespaces
  get payments() {
    return this.cyberSource.payments; // returns api.pts
  }
}
```

## Benefits of v2.0.0

✅ **Modern**: Uses native fetch instead of deprecated request library  
✅ **Lightweight**: Zero external dependencies  
✅ **Type Safe**: Better TypeScript integration  
✅ **Organized**: Logical API groupings (pts, tms, risk, etc.)  
✅ **Future-proof**: Built with swagger-typescript-api for ongoing updates

## Breaking Changes

⚠️ **Response Structure**: `response.body` → `response.data`  
⚠️ **API Classes**: Individual classes → Single Api class with namespaces  
⚠️ **Type Imports**: Named request types → Inline types  
⚠️ **Method Parameters**: Some parameter orders may have changed

## Need Help?

If you encounter issues during migration, please check the [README.md](./README.md) for updated examples or open an issue on GitHub.
