# 🧪 CyberSource Sandbox Testing Guide

This guide will help you test your CyberSource API client with real sandbox credentials to verify everything is working correctly.

## 📋 Prerequisites

1. **CyberSource Sandbox Account**

   - Sign up at: https://developer.cybersource.com/
   - Access sandbox Business Center: https://ebctest.cybersource.com

2. **API Credentials**
   - Navigate to: Account Management > Key Management
   - Create or use existing REST API Key
   - You'll need:
     - Merchant ID
     - REST API Key ID
     - REST Shared Secret Key

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

```bash
# Run the setup script
./setup-sandbox.sh

# Edit the .env file with your credentials
nano .env

# Run the test
source .env && npx ts-node direct-sandbox-test.ts
```

### Option 2: Manual Setup

```bash
# Set environment variables
export CYBERSOURCE_MERCHANT_ID=your_merchant_id
export CYBERSOURCE_API_KEY=your_api_key_id
export CYBERSOURCE_SHARED_SECRET=your_shared_secret

# Run the test
npx ts-node direct-sandbox-test.ts
```

## 🧪 Available Test Scripts

### 1. Direct Sandbox Test (Recommended)

**File:** `direct-sandbox-test.ts`

This script makes direct HTTP requests to test API connectivity:

```bash
CYBERSOURCE_MERCHANT_ID=your_merchant_id \
CYBERSOURCE_API_KEY=your_api_key \
CYBERSOURCE_SHARED_SECRET=your_shared_secret \
npx ts-node direct-sandbox-test.ts
```

**Tests performed:**

- ✅ Basic API connectivity
- ✅ Customer creation
- ✅ Customer payment instrument creation
- ✅ Standalone payment instrument creation
- ✅ Instrument identifier creation
- ✅ BIN lookup functionality

### 2. Service Validation Test

**File:** `validate-services.ts`

Tests that all services are properly configured:

```bash
npx ts-node validate-services.ts
```

### 3. Module Integration Test

**File:** `test-module.ts`

Tests NestJS module configuration:

```bash
npx ts-node test-module.ts
```

## 📊 Understanding Test Results

### ✅ Success Indicators

- **All tests pass**: Your API client is working correctly
- **Partial success**: Some features work, check failed tests for issues
- **HTTP 404 errors**: Expected for non-existent resources (shows connectivity)

### ❌ Common Issues & Solutions

| Issue                | Likely Cause        | Solution                                        |
| -------------------- | ------------------- | ----------------------------------------------- |
| **401 Unauthorized** | Invalid credentials | Verify merchant ID, API key, and shared secret  |
| **403 Forbidden**    | API not enabled     | Enable REST APIs in CyberSource Business Center |
| **500 Server Error** | Malformed request   | Check request format and authentication headers |
| **Network timeout**  | Connectivity issue  | Check internet connection and firewall settings |

## 🔧 Troubleshooting

### 1. Credential Issues

```bash
# Verify your credentials format:
echo "Merchant ID: $CYBERSOURCE_MERCHANT_ID"
echo "API Key: $CYBERSOURCE_API_KEY"
echo "Shared Secret length: ${#CYBERSOURCE_SHARED_SECRET}"

# Shared secret should be base64 encoded and ~44 characters
```

### 2. API Permissions

In CyberSource Business Center:

- Go to **Account Management > Transaction Security Policies**
- Ensure **REST API** is enabled
- Check **Token Management Service** permissions

### 3. Environment Issues

```bash
# Test with sandbox explicitly
export CYBERSOURCE_ENVIRONMENT=sandbox
npx ts-node direct-sandbox-test.ts
```

### 4. Debug Mode

Enable verbose logging by modifying the test script:

```typescript
// Add this to see full HTTP requests/responses
console.log("Request:", requestOptions);
console.log("Response:", await response.text());
```

## 📚 What Each Test Validates

### Basic Connectivity

- HTTP Signature authentication working
- Network connectivity to CyberSource sandbox
- Valid credentials and permissions

### Customer Management

- Customer creation with email and metadata
- Customer retrieval (tests GET endpoints)
- Proper JSON request/response handling

### Payment Instruments

- Customer payment instrument creation (card tokenization)
- Standalone payment instrument creation
- Payment instrument listing and retrieval
- Billing address validation

### Instrument Identifiers

- Card tokenization without customer association
- BIN lookup functionality
- Network token preparation

## 🎯 Expected Results

A successful test run should show:

```
🚀 Starting CyberSource Sandbox API Tests...

🌐 Testing Basic API Connectivity...
🧪 Running: Create Test Customer
   ✅ Create Test Customer - 1250ms
   📊 ID: 7545AE01085B0A7CE053AF598E0A5D3A

💳 Testing Payment Instrument APIs...
🧪 Running: Create Customer for Payment Instruments
   ✅ Create Customer for Payment Instruments - 890ms
   📊 ID: 7545AE01085B0A7CE053AF598E0A5D3B

📊 TEST RESULTS SUMMARY
==========================================================
📈 Overall Results: 8/8 tests passed

✅ Create Test Customer                                    1250ms
✅ Test API Connectivity (GET)                             345ms
✅ Create Customer for Payment Instruments                 890ms
✅ Create Customer Payment Instrument                     1100ms
✅ List Customer Payment Instruments                       234ms
✅ Create Standalone Payment Instrument                   1200ms
✅ Create Instrument Identifier                            567ms
✅ BIN Lookup Test                                         123ms

🎉 ALL TESTS PASSED! Your CyberSource API client is working correctly!
```

## 🔄 Next Steps

Once your tests pass:

1. **Integrate into your app**:

   ```typescript
   import { CybersourceModule } from "@your-org/cybersource-nestjs";

   @Module({
     imports: [
       CybersourceModule.forRoot({
         merchantId: "your_merchant_id",
         apiKey: "your_api_key",
         sharedSecretKey: "your_shared_secret",
         sandbox: true,
       }),
     ],
   })
   export class AppModule {}
   ```

2. **Use the services**:

   ```typescript
   constructor(
     private customerService: CustomerService,
     private paymentService: CustomerPaymentInstrumentService
   ) {}

   async createCustomerWithCard() {
     const customer = await this.customerService.createCustomer({...});
     const card = await this.paymentService.createCustomerPaymentInstrument(customer.id, {...});
     return { customer, card };
   }
   ```

3. **Production deployment**:
   - Change `sandbox: false`
   - Use production credentials
   - Update base URL to `https://api.cybersource.com`

## 📞 Support

- **CyberSource Developer Portal**: https://developer.cybersource.com/
- **API Documentation**: https://developer.cybersource.com/api-reference-assets/
- **Business Center**: https://ebc.cybersource.com (production) / https://ebctest.cybersource.com (sandbox)

---

🎉 **Happy Testing!** Your CyberSource integration is ready for production use.
