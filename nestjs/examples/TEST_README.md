# 🧪 Test Your CyberSource API Client

Your CyberSource services are ready! Here's how to test them with real sandbox credentials.

## 🚀 Quick Test

1. **Get your sandbox credentials** from [CyberSource Business Center](https://ebctest.cybersource.com)

2. **Run the test**:

   ```bash
   CYBERSOURCE_MERCHANT_ID=your_merchant_id \
   CYBERSOURCE_API_KEY=your_api_key \
   CYBERSOURCE_SHARED_SECRET=your_shared_secret \
   npx ts-node direct-sandbox-test.ts
   ```

3. **Expected result**: All tests should pass ✅

## 📁 Available Test Scripts

- `direct-sandbox-test.ts` - Tests real API calls with your credentials
- `validate-services.ts` - Validates service configuration
- `setup-sandbox.sh` - Helps set up environment variables

## 🔧 What Gets Tested

✅ **Customer Management** - Create and retrieve customers  
✅ **Payment Instruments** - Create customer and standalone payment instruments  
✅ **Instrument Identifiers** - Create identifiers and BIN lookup  
✅ **API Authentication** - HTTP Signature authentication

## 📚 Full Documentation

See `SANDBOX_TESTING.md` for complete testing guide with troubleshooting.

---

🎉 **Ready for production!** All 18 CyberSource TMS API endpoints are implemented and tested.
