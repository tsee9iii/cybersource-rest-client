/**
 * CyberSource API Documentation Test
 * Tests the exact format from CyberSource documentation
 */

import { CyberSourceAuthUtil } from "./utils/cybersource-auth.util";

async function testExactFormat() {
  const merchantId = process.env.CYBERSOURCE_MERCHANT_ID!;
  const apiKey = process.env.CYBERSOURCE_API_KEY!;
  const sharedSecretKey = process.env.CYBERSOURCE_SHARED_SECRET!;

  console.log("🔍 Testing Exact CyberSource API Format");
  console.log("======================================");

  // Test the exact format from CyberSource docs
  const postPath = "/tms/v2/customers";
  const testHost = "apitest.cybersource.com";
  const postUrl = `https://${testHost}${postPath}`;

  // Minimal customer object
  const customerData = {
    buyerInformation: {
      email: `test-exact-${Date.now()}@example.com`,
    },
  };

  console.log(`URL: ${postUrl}`);
  console.log(`Request Body: ${JSON.stringify(customerData, null, 2)}`);

  try {
    const authHeaders = CyberSourceAuthUtil.generateAuthHeaders({
      merchantId,
      apiKey,
      sharedSecretKey,
      method: "POST",
      path: postPath,
      body: customerData,
      host: testHost,
    });

    // Try with standard JSON content type but different approach
    const requestHeaders = {
      "v-c-merchant-id": merchantId,
      date: authHeaders.date,
      signature: authHeaders.signature,
      host: testHost,
      digest: authHeaders.digest!,
      "content-type": "application/json",
      accept: "application/hal+json",
    };

    console.log("\n📤 Exact Request Headers:");
    Object.entries(requestHeaders).forEach(([key, value]) => {
      console.log(`  ${key}: ${value}`);
    });

    const response = await fetch(postUrl, {
      method: "POST",
      headers: requestHeaders,
      body: JSON.stringify(customerData),
    });

    console.log(`\n📥 Response: ${response.status} ${response.statusText}`);

    // Log response headers
    console.log("📥 Response Headers:");
    response.headers.forEach((value, key) => {
      console.log(`  ${key}: ${value}`);
    });

    const responseBody = await response.text();
    console.log(`\n📥 Response Body: ${responseBody}`);

    // Check if there are any hints in the response
    if (response.status === 406 || response.status === 415) {
      console.log("\n🔍 Content-Type Analysis:");
      console.log("- 406/415 suggests wrong Content-Type");
      console.log("- Check if TMS service is enabled in your account");
      console.log("- Verify sandbox environment settings");
    }
  } catch (error: any) {
    console.error(`❌ Error: ${error.message}`);
  }

  // Test if the service itself is available
  console.log("\n🔍 Testing Service Availability");
  console.log("===============================");

  try {
    // Test a simple GET to see if the service responds
    const healthPath = "/tms/v2/customers";
    const healthUrl = `https://${testHost}${healthPath}`;

    const healthAuthHeaders = CyberSourceAuthUtil.generateAuthHeaders({
      merchantId,
      apiKey,
      sharedSecretKey,
      method: "GET",
      path: healthPath,
      host: testHost,
    });

    console.log(`Testing GET to: ${healthUrl}`);

    const healthResponse = await fetch(healthUrl, {
      method: "GET",
      headers: {
        "v-c-merchant-id": merchantId,
        date: healthAuthHeaders.date,
        signature: healthAuthHeaders.signature,
        host: testHost,
        accept: "application/hal+json",
      },
    });

    console.log(
      `📥 GET Response: ${healthResponse.status} ${healthResponse.statusText}`
    );
    const healthBody = await healthResponse.text();
    console.log(`📥 GET Body: ${healthBody}`);

    if (healthResponse.status === 200) {
      console.log("✅ TMS service is available and responding");
    } else if (healthResponse.status === 404) {
      console.log("ℹ️  TMS service available (404 expected for empty list)");
    } else {
      console.log(`⚠️  Unexpected response: ${healthResponse.status}`);
    }
  } catch (error: any) {
    console.error(`❌ Health check error: ${error.message}`);
  }
}

// Check environment variables
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

testExactFormat().catch((error) => {
  console.error("Unexpected error:", error);
  process.exit(1);
});
