/**
 * Minimal CyberSource API Test
 * Tests authentication with minimal request to isolate issues
 */

import { CyberSourceAuthUtil } from "./utils/cybersource-auth.util";

async function testMinimalRequest() {
  const merchantId = process.env.CYBERSOURCE_MERCHANT_ID!;
  const apiKey = process.env.CYBERSOURCE_API_KEY!;
  const sharedSecretKey = process.env.CYBERSOURCE_SHARED_SECRET!;

  console.log("🔍 Minimal CyberSource API Test");
  console.log("===============================");
  console.log(`Testing with credentials for: ${merchantId}`);
  console.log("");

  // Test 1: Simple GET request
  const testPath = "/tms/v2/customers/test-non-existent-id";
  const testHost = "apitest.cybersource.com";
  const testUrl = `https://${testHost}${testPath}`;

  console.log("🧪 Test 1: Simple GET Request");
  console.log("=============================");
  console.log(`URL: ${testUrl}`);

  try {
    const authHeaders = CyberSourceAuthUtil.generateAuthHeaders({
      merchantId,
      apiKey,
      sharedSecretKey,
      method: "GET",
      path: testPath,
      host: testHost,
    });

    console.log("\n📤 Request Headers:");
    console.log("==================");
    Object.entries(authHeaders).forEach(([key, value]) => {
      console.log(`${key}: ${value}`);
    });

    const response = await fetch(testUrl, {
      method: "GET",
      headers: {
        ...authHeaders,
        "User-Agent": "CyberSource-NodeJS-Test/1.0",
        Accept: "application/hal+json;charset=utf-8",
      },
    });

    console.log(
      `\n📥 Response Status: ${response.status} ${response.statusText}`
    );
    console.log("📥 Response Headers:");
    response.headers.forEach((value, key) => {
      console.log(`  ${key}: ${value}`);
    });

    const responseText = await response.text();
    console.log(`\n📥 Response Body: ${responseText}`);

    if (response.status === 404) {
      console.log(
        "✅ SUCCESS: Got 404 (expected for non-existent resource) - Authentication working!"
      );
    } else if (response.status === 401) {
      console.log("❌ FAILED: Got 401 - Authentication failed");
      console.log("🔧 Debug info:");
      console.log(`   Merchant ID: ${merchantId}`);
      console.log(`   API Key: ${apiKey}`);
      console.log(`   Secret length: ${sharedSecretKey.length}`);
    } else {
      console.log(`ℹ️  Got ${response.status}: ${responseText}`);
    }
  } catch (error: any) {
    console.error("❌ Request failed:", error.message);
  }

  console.log("\n" + "=".repeat(50));

  // Test 2: POST request with minimal body
  console.log("\n🧪 Test 2: POST Request (Customer Creation)");
  console.log("==========================================");

  const postPath = "/tms/v2/customers";
  const postUrl = `https://${testHost}${postPath}`;
  const minimalCustomer = {
    buyerInformation: {
      email: `test-minimal-${Date.now()}@example.com`,
    },
  };

  console.log(`URL: ${postUrl}`);
  console.log(`Body: ${JSON.stringify(minimalCustomer, null, 2)}`);

  try {
    const postAuthHeaders = CyberSourceAuthUtil.generateAuthHeaders({
      merchantId,
      apiKey,
      sharedSecretKey,
      method: "POST",
      path: postPath,
      body: minimalCustomer,
      host: testHost,
    });

    console.log("\n📤 Request Headers:");
    console.log("==================");
    Object.entries(postAuthHeaders).forEach(([key, value]) => {
      console.log(`${key}: ${value}`);
    });

    const postResponse = await fetch(postUrl, {
      method: "POST",
      headers: {
        ...postAuthHeaders,
        "User-Agent": "CyberSource-NodeJS-Test/1.0",
        Accept: "application/hal+json;charset=utf-8",
      },
      body: JSON.stringify(minimalCustomer),
    });

    console.log(
      `\n📥 Response Status: ${postResponse.status} ${postResponse.statusText}`
    );
    console.log("📥 Response Headers:");
    postResponse.headers.forEach((value, key) => {
      console.log(`  ${key}: ${value}`);
    });

    const postResponseText = await postResponse.text();
    console.log(`\n📥 Response Body: ${postResponseText}`);

    if (postResponse.status === 201) {
      console.log("✅ SUCCESS: Customer created successfully!");
    } else if (postResponse.status === 401) {
      console.log("❌ FAILED: Got 401 - Authentication failed");
    } else {
      console.log(`ℹ️  Got ${postResponse.status}: Analysis needed`);
    }
  } catch (error: any) {
    console.error("❌ POST request failed:", error.message);
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

testMinimalRequest().catch((error) => {
  console.error("Unexpected error:", error);
  process.exit(1);
});
