/**
 * Simple CyberSource Sandbox API Testing Script
 * This script tests the actual API connectivity using sandbox credentials
 *
 * Requirements:
 * 1. Set environment variables:
 *    - CYBERSOURCE_MERCHANT_ID
 *    - CYBERSOURCE_API_KEY
 *    - CYBERSOURCE_SHARED_SECRET
 *
 * Usage:
 * CYBERSOURCE_MERCHANT_ID=your_merchant_id \
 * CYBERSOURCE_API_KEY=your_api_key \
 * CYBERSOURCE_SHARED_SECRET=your_shared_secret \
 * npx ts-node simple-sandbox-test.ts
 */

import { CyberSourceAuthUtil } from "./utils/cybersource-auth.util";

interface TestResults {
  testName: string;
  success: boolean;
  message: string;
  duration: number;
  data?: any;
}

class SimpleSandboxTester {
  private api: Api<unknown>;
  private merchantId: string;
  private apiKey: string;
  private sharedSecret: string;
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

    this.merchantId = process.env.CYBERSOURCE_MERCHANT_ID!;
    this.apiKey = process.env.CYBERSOURCE_API_KEY!;
    this.sharedSecret = process.env.CYBERSOURCE_SHARED_SECRET!;

    console.log("✅ Environment variables found:");
    console.log(`   Merchant ID: ${this.merchantId}`);
    console.log(`   API Key: ${this.apiKey}`);
    console.log(`   Environment: sandbox`);
    console.log("");

    // Initialize API with custom authentication
    this.api = new Api({
      baseUrl: "https://apitest.cybersource.com",
      customFetch: this.createAuthenticatedFetch(),
    });

    console.log("✅ API client initialized successfully\n");
  }

  private createAuthenticatedFetch() {
    return async (input: string | URL | Request, init?: RequestInit) => {
      const url = typeof input === "string" ? input : input.toString();
      const method = init?.method || "GET";
      const body = init?.body;

      // Generate authentication headers
      const authHeaders = generateHttpSignature({
        method,
        url,
        body: body?.toString(),
        merchantId: this.merchantId,
        apiKey: this.apiKey,
        sharedSecret: this.sharedSecret,
      });

      // Merge with existing headers
      const headers = {
        "Content-Type": "application/json",
        ...authHeaders,
        ...(init?.headers || {}),
      };

      return fetch(input, {
        ...init,
        headers,
      });
    };
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
          `   📊 Response: ${JSON.stringify(data).substring(0, 100)}...`
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

      this.results.push(result);
      return result;
    }
  }

  async testBasicConnectivity() {
    console.log("🌐 Testing Basic API Connectivity...\n");

    // Test 1: Create a test customer using raw API
    await this.runTest("Create Test Customer (Raw API)", async () => {
      const customerData = {
        buyerInformation: {
          email: `test-${Date.now()}@example.com`,
        },
        merchantDefinedInformation: [
          {
            name: "test_purpose",
            value: "sandbox_connectivity_test",
          },
        ],
      };

      const response = await this.api.tms.createCustomer(customerData);
      return response.data;
    });

    // Test 2: Test a simple GET request (this will likely fail but shows connectivity)
    await this.runTest("Test API Connectivity", async () => {
      try {
        // Try to get a non-existent customer to test connectivity
        const response = await this.api.tms.getCustomer("test-customer-id");
        return response.data;
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

  async testPaymentInstruments() {
    console.log("\n💳 Testing Payment Instrument APIs...\n");

    let testCustomerId: string | null = null;

    // Test 1: Create customer for payment instruments
    const customerResult = await this.runTest(
      "Create Customer for Payment Instruments",
      async () => {
        const customerData = {
          buyerInformation: {
            email: `payment-test-${Date.now()}@example.com`,
          },
          merchantDefinedInformation: [
            {
              name: "test_purpose",
              value: "payment_instrument_test",
            },
          ],
        };

        const response = await this.api.tms.createCustomer(customerData);
        testCustomerId = response.data?.id || null;
        return response.data;
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
      const paymentInstrumentData = {
        card: {
          number: "4111111111111111",
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
      };

      const response = await this.api.tms.createCustomerPaymentInstrument(
        testCustomerId!,
        paymentInstrumentData
      );
      return response.data;
    });

    // Test 3: List customer payment instruments
    await this.runTest("List Customer Payment Instruments", async () => {
      const response = await this.api.tms.listCustomerPaymentInstruments(
        testCustomerId!,
        {
          offset: 0,
          limit: 10,
        }
      );
      return response.data;
    });

    // Test 4: Create standalone payment instrument
    await this.runTest("Create Standalone Payment Instrument", async () => {
      const paymentInstrumentData = {
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
      };

      const response = await this.api.tms.createPaymentInstrument(
        paymentInstrumentData
      );
      return response.data;
    });
  }

  async testInstrumentIdentifiers() {
    console.log("\n🆔 Testing Instrument Identifier APIs...\n");

    // Test 1: Create instrument identifier
    await this.runTest("Create Instrument Identifier", async () => {
      const identifierData = {
        card: {
          number: "4111111111111111",
          expirationMonth: "12",
          expirationYear: "2025",
        },
      };

      const response = await this.api.tms.createInstrumentIdentifier(
        identifierData
      );
      return response.data;
    });
  }

  async runAllTests() {
    try {
      console.log("🚀 Starting CyberSource Sandbox API Tests...\n");
      console.log("=".repeat(60));

      await this.testBasicConnectivity();
      await this.testPaymentInstruments();
      await this.testInstrumentIdentifiers();

      this.printResults();
    } catch (error: any) {
      console.error("❌ Test execution failed:", error.message);
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
        `${status} ${result.testName.padEnd(50)} ${duration.padStart(8)}`
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
    const tester = new SimpleSandboxTester();
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
    console.log("npx ts-node simple-sandbox-test.ts");
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main().catch((error) => {
    console.error("Unexpected error:", error);
    process.exit(1);
  });
}

export { SimpleSandboxTester };
