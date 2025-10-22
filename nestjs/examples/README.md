# 🧪 CyberSource NestJS Examples & Testing

Welcome to the CyberSource NestJS module examples and testing suite!

## 📂 Directory Structure

```
examples/
├── setup-sandbox.sh           # Environment setup script
├── TEST_README.md             # Quick start testing guide  
├── SANDBOX_TESTING.md         # Comprehensive testing documentation
└── TEST_RESULTS_SUMMARY.md    # Expected results and troubleshooting

tests/
├── direct-sandbox-test.ts     # 🌟 Main API testing script
├── debug-auth.ts              # Authentication debugging
├── minimal-test.ts            # Minimal connectivity test
├── test-content-types.ts      # Content-type testing
├── test-exact-format.ts       # Request format testing
├── check-tms.ts              # TMS service availability check
└── test-available-services.ts # Service enablement testing
```

## 🚀 Quick Start

### 1. Set up your environment:
```bash
# Run the setup script
./examples/setup-sandbox.sh

# Or set environment variables manually:
export CYBERSOURCE_MERCHANT_ID=your_merchant_id
export CYBERSOURCE_API_KEY=your_api_key  
export CYBERSOURCE_SHARED_SECRET=your_shared_secret
```

### 2. Test your API connection:
```bash
# Run the main test suite
npm run test:sandbox

# Or run directly:
npx ts-node tests/direct-sandbox-test.ts
```

### 3. Debug if needed:
```bash
# Validate service configuration
npm run test:validate

# Debug authentication
npm run test:debug
```

## 📚 Documentation

- **[TEST_README.md](./TEST_README.md)** - Quick start guide
- **[SANDBOX_TESTING.md](./SANDBOX_TESTING.md)** - Comprehensive testing guide
- **[TEST_RESULTS_SUMMARY.md](./TEST_RESULTS_SUMMARY.md)** - Expected results and troubleshooting

## 🧪 Available Test Scripts

| Script | Purpose | Command |
|--------|---------|---------|
| **Main Test Suite** | Tests all API endpoints | `npm run test:sandbox` |
| **Service Validation** | Validates service configuration | `npm run test:validate` |
| **Debug Authentication** | Debug HTTP signature generation | `npm run test:debug` |
| **Setup Environment** | Creates .env file template | `npm run setup:sandbox` |

## 🎯 What Gets Tested

✅ **Authentication** - HTTP Signature validation  
✅ **Customer Management** - Create/retrieve customers  
✅ **Payment Instruments** - Customer and standalone instruments  
✅ **Instrument Identifiers** - Card identifiers and BIN lookup  
✅ **API Connectivity** - Network and service availability  

## 🔧 Requirements

- Node.js 16+
- TypeScript 
- CyberSource sandbox credentials:
  - Merchant ID
  - API Key  
  - Shared Secret

## 📞 Support

If tests fail:
1. Check [TEST_RESULTS_SUMMARY.md](./TEST_RESULTS_SUMMARY.md) for troubleshooting
2. Verify credentials in CyberSource Business Center
3. Contact CyberSource support to enable TMS features

---

🎉 **Ready to test your CyberSource integration!**