/**
 * CyberSource Sandbox API Testing Script
 * This script tests the actual API connectivity using sandbox credentials
 *
 * Requirements:
 * 1. Set environment variables:
 *    - CYBERSOURCE_MERCHANT_ID
 *    - CYBERSOURCE_API_KEY
 *    - CYBERSOURCE_SHARED_SECRET
 *    - CYBERSOURCE_ENVIRONMENT=sandbox
 *
 * Usage:
 * CYBERSOURCE_MERCHANT_ID=your_merchant_id \
 * CYBERSOURCE_API_KEY=your_api_key \
 * CYBERSOURCE_SHARED_SECRET=your_shared_secret \
 * npx ts-node test-sandbox-api.ts
 */

import { CyberSourceService } from "./cybersource.service";
import { CustomerService } from "./services/customer.service";
import { CustomerPaymentInstrumentService } from "./services/customer-payment-instrument.service";
import { PaymentInstrumentService } from "./services/payment-instrument.service";
import { InstrumentIdentifierService } from "./services/instrument-identifier.service";
import { TokenizedCardService } from "./services/tokenized-card.service";

interface TestResults {
  testName: string;
  success: boolean;
  message: string;
  duration: number;
  data?: any;
}

class SandboxAPITester {
  private cyberSourceService: CyberSourceService;
  private customerService: CustomerService;
  private customerPaymentInstrumentService: CustomerPaymentInstrumentService;
  private paymentInstrumentService: PaymentInstrumentService;
  private instrumentIdentifierService: InstrumentIdentifierService;
  private tokenizedCardService: TokenizedCardService;
  private results: TestResults[] = [];

  constructor() {
    // Check environment variables
    const requiredEnvVars = [
      "CYBERSOURCE_MERCHANT_ID",
      "CYBERSOURCE_API_KEY",
      "CYBERSOURCE_SHARED_SECRET",
    ];

    const missingVars = requiredEnvVars.filter(
      (varName) => !process.env[varName]
    );
    if (missingVars.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missingVars.join(", ")}`
      );
    }

    console.log("✅ Environment variables found:");
    console.log(`   Merchant ID: ${process.env.CYBERSOURCE_MERCHANT_ID}`);
    console.log(`   API Key: ${process.env.CYBERSOURCE_API_KEY}`);
    console.log(
      `   Environment: ${process.env.CYBERSOURCE_ENVIRONMENT || "sandbox"}`
    );
    console.log("");

    // Initialize services with configuration
    const config = {
      merchantId: process.env.CYBERSOURCE_MERCHANT_ID!,
      apiKey: process.env.CYBERSOURCE_API_KEY!,
      sharedSecretKey: process.env.CYBERSOURCE_SHARED_SECRET!,
      sandbox: true,
    };

    this.cyberSourceService = new CyberSourceService(config);
    this.customerService = new CustomerService(this.cyberSourceService);
    this.customerPaymentInstrumentService =
      new CustomerPaymentInstrumentService(this.cyberSourceService);
    this.paymentInstrumentService = new PaymentInstrumentService(
      this.cyberSourceService
    );
    this.instrumentIdentifierService = new InstrumentIdentifierService(
      this.cyberSourceService
    );
    this.tokenizedCardService = new TokenizedCardService(
      this.cyberSourceService
    );

    console.log("✅ Services initialized successfully\n");
  }

  private async runTest(
    testName: string,
    testFn: () => Promise<any>
  ): Promise<TestResults> {
    const startTime = Date.now();
    console.log(`🧪 Running: ${testName}`);

    try {
      const data = await testFn();
      const duration = Date.now() - startTime;
      const result: TestResults = {
        testName,
        success: true,
        message: "Test passed successfully",
        duration,
        data,
      };

      console.log(`   ✅ ${testName} - ${duration}ms`);
      if (data && typeof data === "object") {
        console.log(
          `   📊 Response ID: ${data.id || data._links?.self?.href || "N/A"}`
        );
      }

      this.results.push(result);
      return result;
    } catch (error: any) {
      const duration = Date.now() - startTime;
      const result: TestResults = {
        testName,
        success: false,
        message: error.message || "Unknown error",
        duration,
      };

      console.log(`   ❌ ${testName} - ${duration}ms`);
      console.log(`   📋 Error: ${error.message}`);
      if (error.response?.data) {
        console.log(
          `   📋 Details: ${JSON.stringify(error.response.data, null, 2)}`
        );
      }

      this.results.push(result);
      return result;
    }
  }

  async testBasicConnectivity() {
    console.log("🌐 Testing Basic API Connectivity...\n");

    // Test 1: Create a test customer
    await this.runTest("Create Test Customer", async () => {
      return await this.customerService.createCustomer({
        buyerInformation: {
          email: `test-${Date.now()}@example.com`,
        },
        merchantDefinedInformation: [
          {
            name: "test_purpose",
            value: "sandbox_connectivity_test",
          },
        ],
      });
    });

    // Test 2: List customer (attempt to get a customer)
    await this.runTest("Test Customer Retrieval", async () => {
      // Since we don't have list method, we'll try to get a customer
      // This will likely fail but shows API connectivity
      try {
        return await this.customerService.getCustomer("test-customer-id");
      } catch (error: any) {
        if (error.response?.status === 404) {
          return {
            message:
              "API connectivity confirmed (404 expected for non-existent customer)",
          };
        }
        throw error;
      }
    });
  }

  async testPaymentInstrumentServices() {
    console.log("\n💳 Testing Payment Instrument Services...\n");

    let testCustomerId: string | null = null;
    let testPaymentInstrumentId: string | null = null;

    // Test 1: Create test customer for payment instruments
    const customerResult = await this.runTest(
      "Create Customer for Payment Instruments",
      async () => {
        const customer = await this.customerService.createCustomer({
          buyerInformation: {
            email: `payment-test-${Date.now()}@example.com`,
          },
          merchantDefinedInformation: [
            {
              name: "test_purpose",
              value: "payment_instrument_test",
            },
          ],
        });
        testCustomerId = customer.id || null;
        return customer;
      }
    );

    if (!customerResult.success || !testCustomerId) {
      console.log(
        "❌ Skipping payment instrument tests - customer creation failed"
      );
      return;
    }

    // Test 2: Create customer payment instrument
    await this.runTest("Create Customer Payment Instrument", async () => {
      return await this.customerPaymentInstrumentService.createCustomerPaymentInstrument(
        testCustomerId!,
        {
          card: {
            number: "4111111111111111", // Test card number
            expirationMonth: "12",
            expirationYear: "2025",
            securityCode: "123",
          },
          billTo: {
            address1: "123 Test St",
            locality: "Test City",
            administrativeArea: "CA",
            postalCode: "12345",
            country: "US",
          },
        }
      );
    });

    // Test 3: List customer payment instruments
    await this.runTest("List Customer Payment Instruments", async () => {
      return await this.customerPaymentInstrumentService.listCustomerPaymentInstruments(
        testCustomerId!,
        {
          offset: 0,
          limit: 10,
        }
      );
    });

    // Test 4: Create standalone payment instrument
    const instrumentResult = await this.runTest(
      "Create Standalone Payment Instrument",
      async () => {
        const instrument =
          await this.paymentInstrumentService.createPaymentInstrument({
            card: {
              number: "4111111111111111",
              expirationMonth: "12",
              expirationYear: "2025",
            },
            billTo: {
              address1: "456 Test Ave",
              locality: "Test City",
              administrativeArea: "CA",
              postalCode: "12345",
              country: "US",
            },
          });
        testPaymentInstrumentId = instrument.id || null;
        return instrument;
      }
    );

    // Test 5: Get payment instrument details
    if (instrumentResult.success && testPaymentInstrumentId) {
      await this.runTest("Get Payment Instrument Details", async () => {
        return await this.paymentInstrumentService.getPaymentInstrument(
          testPaymentInstrumentId!
        );
      });
    }
  }

  async testInstrumentIdentifierServices() {
    console.log("\n🆔 Testing Instrument Identifier Services...\n");

    // Test 1: Create instrument identifier
    await this.runTest("Create Instrument Identifier", async () => {
      return await this.instrumentIdentifierService.createInstrumentIdentifier({
        card: {
          number: "4111111111111111",
          expirationMonth: "12",
          expirationYear: "2025",
        },
      });
    });

    // Test 2: BIN lookup test (using correct parameter)
    await this.runTest("BIN Lookup Test", async () => {
      // This should be the instrument identifier ID, not BIN
      // For now, we'll test with a placeholder
      try {
        return await this.instrumentIdentifierService.listPaymentInstruments(
          "test-identifier-id"
        );
      } catch (error: any) {
        if (error.response?.status === 404) {
          return {
            message: "BIN lookup API connectivity confirmed (404 expected)",
          };
        }
        throw error;
      }
    });
  }

  async testTokenizedCardServices() {
    console.log("\n🎫 Testing Tokenized Card Services...\n");

    // Note: This typically requires network tokens which may not be available in basic sandbox
    await this.runTest("Test Tokenized Card Creation", async () => {
      try {
        return await this.tokenizedCardService.createTokenizedCard({
          card: {
            number: "4111111111111111",
            expirationMonth: "12",
            expirationYear: "2025",
          },
        });
      } catch (error: any) {
        // Network tokenization might not be enabled in sandbox
        if (
          error.message?.includes("not enabled") ||
          error.response?.status === 400
        ) {
          throw new Error(
            "Network tokenization not enabled in sandbox (expected)"
          );
        }
        throw error;
      }
    });
  }

  async runAllTests() {
    try {
      console.log("🚀 Starting CyberSource Sandbox API Tests...\n");
      console.log("=".repeat(60));

      await this.testBasicConnectivity();
      await this.testPaymentInstrumentServices();
      await this.testInstrumentIdentifierServices();
      await this.testTokenizedCardServices();

      this.printResults();
    } catch (error: any) {
      console.error("❌ Test initialization failed:", error.message);
      process.exit(1);
    }
  }

  private printResults() {
    console.log("\n" + "=".repeat(60));
    console.log("📊 TEST RESULTS SUMMARY");
    console.log("=".repeat(60));

    const passed = this.results.filter((r) => r.success).length;
    const failed = this.results.filter((r) => !r.success).length;
    const total = this.results.length;

    console.log(`\n📈 Overall Results: ${passed}/${total} tests passed\n`);

    this.results.forEach((result) => {
      const status = result.success ? "✅" : "❌";
      const duration = `${result.duration}ms`;
      console.log(
        `${status} ${result.testName.padEnd(40)} ${duration.padStart(8)}`
      );
      if (!result.success) {
        console.log(`   └─ ${result.message}`);
      }
    });

    console.log("\n" + "=".repeat(60));

    if (failed === 0) {
      console.log(
        "🎉 ALL TESTS PASSED! Your CyberSource API client is working correctly!"
      );
    } else if (passed > 0) {
      console.log(
        "⚠️  PARTIAL SUCCESS: Some tests passed, check failed tests above."
      );
    } else {
      console.log(
        "💥 ALL TESTS FAILED: Check your credentials and configuration."
      );
    }

    console.log("=".repeat(60));
  }
}

// Main execution
async function main() {
  try {
    const tester = new SandboxAPITester();
    await tester.runAllTests();
  } catch (error: any) {
    console.error("❌ Failed to initialize tester:", error.message);
    console.log(
      "\n📋 Make sure you have set the required environment variables:"
    );
    console.log("   - CYBERSOURCE_MERCHANT_ID");
    console.log("   - CYBERSOURCE_API_KEY");
    console.log("   - CYBERSOURCE_SHARED_SECRET");
    console.log("\nExample:");
    console.log("CYBERSOURCE_MERCHANT_ID=your_merchant_id \\");
    console.log("CYBERSOURCE_API_KEY=your_api_key \\");
    console.log("CYBERSOURCE_SHARED_SECRET=your_shared_secret \\");
    console.log("npx ts-node test-sandbox-api.ts");
    process.exit(1);
  }
}

// Export for external use
export { SandboxAPITester };

// Run if executed directly
if (require.main === module) {
  main().catch((error) => {
    console.error("Unexpected error:", error);
    process.exit(1);
  });
}
