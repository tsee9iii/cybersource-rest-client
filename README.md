# @tsee9ii/cybersource-rest-client

A modern TypeScript/JavaScript client library for the CyberSource REST API, generated using swagger-typescript-api. This package provides type-safe access to all CyberSource payment processing and merchant services APIs with native fetch support and zero external dependencies.

## 📋 Overview

This client library is auto-generated from the [CyberSource API specification](https://developer.cybersource.com/api/reference/api-reference.html) using swagger-typescript-api. It includes comprehensive TypeScript definitions, uses native fetch API, and supports all CyberSource REST API endpoints.

## ✨ Features

- 🎯 **Modern Architecture**: Built with swagger-typescript-api using native fetch
- 🛡️ **Type Safety**: Full TypeScript support with comprehensive type definitions  
- 📦 **Zero Dependencies**: No external runtime dependencies required
- 🔌 **Single API Class**: Simplified interface with organized endpoint groupings
- 🚀 **NestJS Integration**: Dedicated NestJS module available
- 🌐 **Cross-Platform**: Works in Node.js and modern browsers

## 🚀 Installation

### As a Package Dependency

To use this package in another project, you can install it directly from the repository:

```bash
# Install from GitHub repository
npm install git+https://github.com/tsee9ii/nestjs-cybersource-rest-client.git

# Or if you publish to npm
npm install @tsee9ii/cybersource-rest-client
```

### Manual Installation

```bash
git clone https://github.com/tsee9iii/nestjs-cybersource-rest-client.git
cd nestjs-cybersource-rest-client
npm install
```

## 🛠️ Setup

Before using the client, you'll need to configure your CyberSource credentials and merchant information.

### Authentication

The library supports CyberSource's HTTP Signature authentication. You'll need:

- Merchant ID
- API Key
- Shared Secret Key

## 📖 Usage

### Basic Import

````typescript
import { Api } from '@tsee9ii/cybersource-rest-client';
````

### Initialize API Client

```typescript
import { Api } from "@tsee9ii/cybersource-rest-client";

// Configure the API client
const cyberSourceApi = new Api({
  baseUrl: "https://apitest.cybersource.com", // Sandbox
  // baseUrl: "https://api.cybersource.com", // Production
  securityWorker: (securityData: any) => {
    // Add your authentication configuration here
    // Return headers for HTTP Signature authentication
    return {
      // Your authentication headers
    };
  },
});
```

### Example: Process a Payment

```typescript
import { Api } from "@tsee9ii/cybersource-rest-client";

const cyberSourceApi = new Api({
  baseUrl: "https://apitest.cybersource.com"
});

const paymentRequest = {
  clientReferenceInformation: {
    code: "TC50171_3",
  },
  processingInformation: {
    capture: false,
  },
  paymentInformation: {
    card: {
      number: "4111111111111111",
      expirationMonth: "12",
      expirationYear: "2031",
      securityCode: "123",
    },
  },
  orderInformation: {
    amountDetails: {
      totalAmount: "102.21",
      currency: "USD",
    },
    billTo: {
      firstName: "John",
      lastName: "Doe",
      address1: "1 Market St",
      locality: "san francisco",
      administrativeArea: "CA",
      postalCode: "94105",
      country: "US",
      email: "test@cybs.com",
      phoneNumber: "4158880000",
    },
  },
};

try {
  const response = await cyberSourceApi.pts.createPayment(paymentRequest);
  console.log("Payment processed successfully:", response.data);
} catch (error) {
  console.error("Payment failed:", error);
}
```

## 🎯 Available API Endpoints

This client provides access to all CyberSource REST API endpoints through organized namespaces:

### Core Payment Processing (pts)

```typescript
// Payment operations
cyberSourceApi.pts.createPayment(request)
cyberSourceApi.pts.capturePayment(id, request)
cyberSourceApi.pts.refundPayment(id, request) 
cyberSourceApi.pts.voidPayment(id, request)
cyberSourceApi.pts.incrementAuth(id, request)
```

### Token Management Service (tms)

```typescript  
// Customer and token management
cyberSourceApi.tms.createCustomer(request)
cyberSourceApi.tms.getCustomer(customerId)
cyberSourceApi.tms.updateCustomer(customerId, request)
cyberSourceApi.tms.deleteCustomer(customerId)
```

### Risk Management (risk)

```typescript
// Decision manager and fraud screening  
cyberSourceApi.risk.createDecision(request)
cyberSourceApi.risk.addNegative(request)
```

### Reporting

```typescript
// Reports and transaction details
cyberSourceApi.reporting.searchTransactions(request)
cyberSourceApi.reporting.getTransactionDetails(id)
```

### Subscription & Recurring Billing

- **SubscriptionsApi** - Subscription management
- **SubscriptionsFollowOnsApi** - Follow-on subscription operations
- **PlansApi** - Subscription plan management
- **InvoicesApi** - Invoice management
- **InvoiceSettingsApi** - Invoice configuration

### Risk & Authentication

- **PayerAuthenticationApi** - 3D Secure authentication
- **DecisionManagerApi** - Fraud management
- **VerificationApi** - Card verification

### Reporting & Analytics

- **ReportsApi** - Generate and retrieve reports
- **ReportDefinitionsApi** - Report configuration
- **ReportDownloadsApi** - Download reports
- **ReportSubscriptionsApi** - Report subscriptions
- **TransactionDetailsApi** - Transaction information
- **SearchTransactionsApi** - Transaction search

### Merchant Services

- **MerchantBoardingApi** - Merchant onboarding
- **BatchesApi** - Batch processing
- **SecureFileShareApi** - File management
- **WebhooksApi** - Webhook management

### Additional Services

- **BinLookupApi** - Bank identification number lookup
- **TaxesApi** - Tax calculation
- **MicroformIntegrationApi** - Secure acceptance
- **UnifiedCheckoutCaptureContextApi** - Unified checkout

And many more specialized APIs for comprehensive payment processing needs.

## 🔧 Configuration

### Environment Setup

```typescript
// Sandbox environment (for testing)
const basePath = "https://apitest.cybersource.com";

// Production environment
const basePath = "https://api.cybersource.com";
```

### TypeScript Configuration

This package includes full TypeScript definitions. Make sure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "target": "es2017",
    "module": "commonjs",
    "lib": ["es2017"],
    "declaration": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

## 📚 Documentation

- [CyberSource API Documentation](https://developer.cybersource.com/api/reference/api-reference.html)
- [CyberSource Developer Center](https://developer.cybersource.com/)
- [Authentication Guide](https://developer.cybersource.com/api/developer-guides/dita-gettingstarted/authentication.html)

## 🔒 Security Notes

- Never commit your API credentials to version control
- Use environment variables for sensitive configuration
- Always validate and sanitize input data
- Use HTTPS endpoints only
- Implement proper error handling for production use

## 🐛 Error Handling

```typescript
import { PaymentsApi } from "@tsee9ii/cybersource-rest-client";

try {
  const response = await paymentsApi.createPayment(paymentRequest);
  // Handle successful response
} catch (error) {
  if (error.response) {
    // API responded with error status
    console.error("API Error:", error.response.statusCode);
    console.error("Error details:", error.body);
  } else {
    // Network or other error
    console.error("Request failed:", error.message);
  }
}
```

## 🤝 Contributing

This is an auto-generated client library. For issues or feature requests related to the CyberSource API itself, please contact CyberSource support.

For issues specific to this TypeScript client:

1. Check the [CyberSource API documentation](https://developer.cybersource.com/api/reference/api-reference.html)
2. Verify your authentication configuration
3. Ensure you're using the correct API endpoint (sandbox vs production)

## 📄 License

This project follows CyberSource's API terms of service. Please refer to the [CyberSource Developer Agreement](https://developer.cybersource.com/api/developer-guides/dita-gettingstarted/registration.html) for usage terms.

## ⚡ Generated Information

- **Generator**: Swagger Codegen v2.4.49
- **API Version**: 0.0.1 (CyberSource Merged Spec)
- **Generated**: Auto-generated from CyberSource OpenAPI specifications
- **Base URL**: `https://apitest.cybersource.com` (sandbox) / `https://api.cybersource.com` (production)

## 🔗 Related Resources

- [CyberSource Developer Guides](https://developer.cybersource.com/api/developer-guides/)
- [CyberSource SDK Samples](https://github.com/CyberSource)
- [Payment Processing Best Practices](https://developer.cybersource.com/api/developer-guides/dita-payments/)

---

**Note**: This is an unofficial client library generated from CyberSource's public API specifications. For official SDKs and support, please visit the [CyberSource Developer Center](https://developer.cybersource.com/).
