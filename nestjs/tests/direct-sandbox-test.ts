/**
 * Direct CyberSource Sandbox API Testing Script
 * This script tests the actual API connectivity using direct HTTP requests
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
 * npx ts-node direct-sandbox-test.ts
 */

import { CyberSourceAuthUtil } from "./utils/cybersource-auth.util";

interface TestResults {
  testName: string;
  success: boolean;
  message: string;
  duration: number;
  statusCode?: number;
  data?: any;
}

class DirectSandboxTester {
  private merchantId: string;
  private apiKey: string;
  private sharedSecretKey: string;
  private baseUrl = "https://apitest.cybersource.com";
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
    this.sharedSecretKey = process.env.CYBERSOURCE_SHARED_SECRET!;

    console.log("✅ Environment variables found:");
    console.log(`   Merchant ID: ${this.merchantId}`);
    console.log(`   API Key: ${this.apiKey}`);
    console.log(`   Base URL: ${this.baseUrl}`);
    console.log("");
  }

  private async makeAuthenticatedRequest(
    method: string,
    path: string,
    body?: any
  ): Promise<Response> {
    const url = `${this.baseUrl}${path}`;
    const host = CyberSourceAuthUtil.extractHost(this.baseUrl);

    // Generate authentication headers
    const authHeaders = CyberSourceAuthUtil.generateAuthHeaders({
      merchantId: this.merchantId,
      apiKey: this.apiKey,
      sharedSecretKey: this.sharedSecretKey,
      method,
      path,
      body,
      host,
    });

    const requestOptions: RequestInit = {
      method,
      headers: {
        ...authHeaders,
        Accept: "application/hal+json",
      } as Record<string, string>,
    };

    if (body && (method === "POST" || method === "PUT" || method === "PATCH")) {
      requestOptions.body = JSON.stringify(body);
    }

    return fetch(url, requestOptions);
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
        if (data.status) {
          console.log(`   📊 Status: ${data.status}`);
        }
        if (data.id) {
          console.log(`   📊 ID: ${data.id}`);
        }
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
        statusCode: error.statusCode,
      };

      console.log(`   ❌ ${testName} - ${duration}ms`);
      console.log(`   📋 Error: ${error.message}`);
      if (error.statusCode) {
        console.log(`   📋 Status Code: ${error.statusCode}`);
      }

      this.results.push(result);
      return result;
    }
  }

  async testBasicConnectivity() {
    console.log("🌐 Testing Basic API Connectivity...\n");

    // Test 1: Create a test customer
    await this.runTest("Create Test Customer", async () => {
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

      const response = await this.makeAuthenticatedRequest(
        "POST",
        "/tms/v2/customers",
        customerData
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      return result;
    });

    // Test 2: Test API connectivity with a simple GET request
    await this.runTest("Test API Connectivity (GET)", async () => {
      try {
        const response = await this.makeAuthenticatedRequest(
          "GET",
          "/tms/v2/customers/test-non-existent-id"
        );

        if (response.status === 404) {
          return {
            status: response.status,
            message:
              "API connectivity confirmed (404 expected for non-existent customer)",
          };
        } else if (response.ok) {
          return await response.json();
        } else {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
      } catch (error: any) {
        if (error.message?.includes("404")) {
          return { message: "API connectivity confirmed (404 expected)" };
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

        const response = await this.makeAuthenticatedRequest(
          "POST",
          "/tms/v2/customers",
          customerData
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        testCustomerId = (result as any)?.id;
        return result;
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

      const response = await this.makeAuthenticatedRequest(
        "POST",
        `/tms/v2/customers/${testCustomerId}/payment-instruments`,
        paymentInstrumentData
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      return await response.json();
    });

    // Test 3: List customer payment instruments
    await this.runTest("List Customer Payment Instruments", async () => {
      const response = await this.makeAuthenticatedRequest(
        "GET",
        `/tms/v2/customers/${testCustomerId}/payment-instruments?offset=0&limit=10`
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      return await response.json();
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

      const response = await this.makeAuthenticatedRequest(
        "POST",
        "/tms/v2/payment-instruments",
        paymentInstrumentData
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      return await response.json();
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

      const response = await this.makeAuthenticatedRequest(
        "POST",
        "/tms/v2/instrument-identifiers",
        identifierData
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      return await response.json();
    });

    // Test 2: BIN lookup test
    await this.runTest("BIN Lookup Test", async () => {
      const response = await this.makeAuthenticatedRequest(
        "GET",
        "/tms/v2/instrument-identifiers/payment-instruments?bin=411111"
      );

      if (response.status === 404) {
        return {
          status: response.status,
          message: "BIN lookup API reachable (404 expected for demo BIN)",
        };
      } else if (response.ok) {
        return await response.json();
      } else {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
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
      console.log("📋 Common issues:");
      console.log(
        "   - Invalid credentials (check merchant ID, API key, shared secret)"
      );
      console.log("   - Sandbox environment not enabled");
      console.log("   - API features not enabled in your CyberSource account");
    } else {
      console.log(
        "💥 ALL TESTS FAILED: Check your credentials and configuration."
      );
      console.log("📋 Troubleshooting:");
      console.log("   1. Verify credentials in CyberSource Business Center");
      console.log("   2. Ensure sandbox environment is active");
      console.log("   3. Check API permissions in your account");
    }

    console.log("=".repeat(60));
  }
}

// Main execution
async function main() {
  try {
    const tester = new DirectSandboxTester();
    await tester.runAllTests();
  } catch (error: any) {
    console.error("❌ Failed to initialize tester:", error.message);
    console.log("\n📋 Setup Instructions:");
    console.log("1. Get your CyberSource sandbox credentials from:");
    console.log("   https://ebctest.cybersource.com");
    console.log("2. Navigate to: Account Management > Key Management");
    console.log("3. Create or use existing REST API Key");
    console.log("4. Set environment variables:");
    console.log("   - CYBERSOURCE_MERCHANT_ID (your merchant ID)");
    console.log("   - CYBERSOURCE_API_KEY (REST API key ID)");
    console.log("   - CYBERSOURCE_SHARED_SECRET (REST shared secret key)");
    console.log("\n📝 Example usage:");
    console.log("CYBERSOURCE_MERCHANT_ID=your_merchant_id \\");
    console.log("CYBERSOURCE_API_KEY=your_api_key \\");
    console.log("CYBERSOURCE_SHARED_SECRET=your_shared_secret \\");
    console.log("npx ts-node direct-sandbox-test.ts");
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

export { DirectSandboxTester };
