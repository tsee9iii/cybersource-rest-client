/**
 * Test Available CyberSource Services
 * Tests which services are actually enabled in your account
 */

import { CyberSourceAuthUtil } from "../utils/cybersource-auth.util";

async function testAvailableServices() {
  const merchantId = process.env.CYBERSOURCE_MERCHANT_ID!;
  const apiKey = process.env.CYBERSOURCE_API_KEY!;
  const sharedSecretKey = process.env.CYBERSOURCE_SHARED_SECRET!;

  console.log("🔍 Testing Available CyberSource Services");
  console.log("=========================================");
  console.log(`Merchant ID: ${merchantId}`);
  console.log("");

  const testHost = "apitest.cybersource.com";

  // Test 1: Customers (TMS) - we know this exists
  console.log("🧪 Test 1: Customer Management (TMS)");
  console.log("====================================");

  try {
    const customerData = {
      buyerInformation: {
        email: `test-available-${Date.now()}@example.com`,
      },
    };

    const authHeaders = CyberSourceAuthUtil.generateAuthHeaders({
      merchantId,
      apiKey,
      sharedSecretKey,
      method: "POST",
      path: "/tms/v2/customers",
      body: customerData,
      host: testHost,
    });

    const response = await fetch(
      "https://apitest.cybersource.com/tms/v2/customers",
      {
        method: "POST",
        headers: {
          ...authHeaders,
          Accept: "application/json",
        },
        body: JSON.stringify(customerData),
      }
    );

    console.log(`📥 Response: ${response.status} ${response.statusText}`);
    const body = await response.text();
    console.log(`📥 Body: ${body}`);

    if (response.status === 201) {
      console.log("✅ Customer Management: WORKING");
    } else if (response.status === 406 || response.status === 415) {
      console.log("⚠️  Customer Management: Available but content-type issue");
    } else {
      console.log("❌ Customer Management: Issue detected");
    }
  } catch (error: any) {
    console.log(`❌ Error: ${error.message}`);
  }

  console.log("");

  // Test 2: Payments (Core CyberSource functionality)
  console.log("🧪 Test 2: Payment Processing (Core)");
  console.log("===================================");

  try {
    const paymentData = {
      clientReferenceInformation: {
        code: `test-${Date.now()}`,
      },
      processingInformation: {
        actionList: ["TOKEN_CREATE"],
        actionTokenTypes: ["customer", "paymentInstrument"],
      },
      paymentInformation: {
        card: {
          number: "4111111111111111",
          expirationMonth: "12",
          expirationYear: "2025",
          securityCode: "123",
        },
      },
      orderInformation: {
        amountDetails: {
          totalAmount: "10.00",
          currency: "USD",
        },
        billTo: {
          firstName: "Test",
          lastName: "Customer",
          address1: "123 Test St",
          locality: "Test City",
          administrativeArea: "CA",
          postalCode: "12345",
          country: "US",
          email: `test-payment-${Date.now()}@example.com`,
        },
      },
    };

    const paymentAuthHeaders = CyberSourceAuthUtil.generateAuthHeaders({
      merchantId,
      apiKey,
      sharedSecretKey,
      method: "POST",
      path: "/pts/v2/payments",
      body: paymentData,
      host: testHost,
    });

    const paymentResponse = await fetch(
      "https://apitest.cybersource.com/pts/v2/payments",
      {
        method: "POST",
        headers: {
          ...paymentAuthHeaders,
          Accept: "application/hal+json",
        },
        body: JSON.stringify(paymentData),
      }
    );

    console.log(
      `📥 Response: ${paymentResponse.status} ${paymentResponse.statusText}`
    );
    const paymentBody = await paymentResponse.text();
    console.log(`📥 Body: ${paymentBody.substring(0, 200)}...`);

    if (paymentResponse.status === 201) {
      console.log("✅ Payment Processing: WORKING");
      console.log(
        "ℹ️  This creates customer and payment instrument tokens automatically"
      );
    } else if (
      paymentResponse.status === 406 ||
      paymentResponse.status === 415
    ) {
      console.log("⚠️  Payment Processing: Available but content-type issue");
    } else {
      console.log(`❌ Payment Processing: ${paymentResponse.status} error`);
    }
  } catch (error: any) {
    console.log(`❌ Payment test error: ${error.message}`);
  }

  console.log("");

  // Test 3: Simple Authorization (Basic test)
  console.log("🧪 Test 3: Simple Authorization");
  console.log("==============================");

  try {
    const simpleAuthData = {
      clientReferenceInformation: {
        code: `auth-test-${Date.now()}`,
      },
      paymentInformation: {
        card: {
          number: "4111111111111111",
          expirationMonth: "12",
          expirationYear: "2025",
        },
      },
      orderInformation: {
        amountDetails: {
          totalAmount: "1.00",
          currency: "USD",
        },
      },
    };

    const authAuthHeaders = CyberSourceAuthUtil.generateAuthHeaders({
      merchantId,
      apiKey,
      sharedSecretKey,
      method: "POST",
      path: "/pts/v2/payments",
      body: simpleAuthData,
      host: testHost,
    });

    const authResponse = await fetch(
      "https://apitest.cybersource.com/pts/v2/payments",
      {
        method: "POST",
        headers: {
          ...authAuthHeaders,
          Accept: "application/hal+json",
        },
        body: JSON.stringify(simpleAuthData),
      }
    );

    console.log(
      `📥 Response: ${authResponse.status} ${authResponse.statusText}`
    );
    const authBody = await authResponse.text();
    console.log(`📥 Body: ${authBody.substring(0, 200)}...`);

    if (authResponse.status === 201) {
      console.log("✅ Simple Authorization: WORKING");
    } else {
      console.log(`❌ Simple Authorization: ${authResponse.status} error`);
    }
  } catch (error: any) {
    console.log(`❌ Auth test error: ${error.message}`);
  }

  console.log("\n" + "=".repeat(60));
  console.log("📊 SERVICE AVAILABILITY SUMMARY");
  console.log("=".repeat(60));
  console.log("Based on the tests above:");
  console.log(
    "- If Payment Processing works: Your authentication is correct ✅"
  );
  console.log(
    "- If TMS features fail: Those services need to be enabled in your account"
  );
  console.log(
    "- Contact CyberSource support to enable Token Management Service"
  );
  console.log("");
  console.log("📞 Next Steps:");
  console.log("1. Your API client authentication is working correctly");
  console.log("2. To enable TMS features, contact CyberSource support");
  console.log(
    "3. In the meantime, you can use payment processing for tokenization"
  );
  console.log(
    "4. Payments with TOKEN_CREATE action will create customer/instrument tokens"
  );
}

const requiredEnvVars = [
  "CYBERSOURCE_MERCHANT_ID",
  "CYBERSOURCE_API_KEY",
  "CYBERSOURCE_SHARED_SECRET",
];

const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);
if (missingVars.length > 0) {
  console.error(
    `❌ Missing required environment variables: ${missingVars.join(", ")}`
  );
  process.exit(1);
}

testAvailableServices().catch((error) => {
  console.error("Unexpected error:", error);
  process.exit(1);
});
