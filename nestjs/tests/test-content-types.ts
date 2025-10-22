/**
 * Content-Type Testing for CyberSource
 * Tests different content-type headers to find the correct one
 */

import { CyberSourceAuthUtil } from "./utils/cybersource-auth.util";

async function testContentTypes() {
  const merchantId = process.env.CYBERSOURCE_MERCHANT_ID!;
  const apiKey = process.env.CYBERSOURCE_API_KEY!;
  const sharedSecretKey = process.env.CYBERSOURCE_SHARED_SECRET!;

  console.log("🔍 Testing Content-Type Headers for CyberSource");
  console.log("===============================================");

  const postPath = "/tms/v2/customers";
  const testHost = "apitest.cybersource.com";
  const postUrl = `https://${testHost}${postPath}`;
  const testCustomer = {
    buyerInformation: {
      email: `test-content-type-${Date.now()}@example.com`,
    },
  };

  const contentTypes = [
    "application/json",
    "application/json;charset=utf-8",
    "application/hal+json",
    "application/hal+json;charset=utf-8",
  ];

  for (const contentType of contentTypes) {
    console.log(`\n🧪 Testing Content-Type: ${contentType}`);
    console.log("=".repeat(50));

    try {
      // Generate auth headers with this content type
      const authHeaders = CyberSourceAuthUtil.generateAuthHeaders({
        merchantId,
        apiKey,
        sharedSecretKey,
        method: "POST",
        path: postPath,
        body: testCustomer,
        host: testHost,
      });

      // Override the content-type
      const requestHeaders = {
        ...authHeaders,
        "content-type": contentType,
        Accept: "application/hal+json;charset=utf-8",
        "User-Agent": "CyberSource-NodeJS-Test/1.0",
      };

      console.log("📤 Request Headers:");
      Object.entries(requestHeaders).forEach(([key, value]) => {
        console.log(`  ${key}: ${value}`);
      });

      const response = await fetch(postUrl, {
        method: "POST",
        headers: requestHeaders,
        body: JSON.stringify(testCustomer),
      });

      console.log(`\n📥 Response: ${response.status} ${response.statusText}`);
      const responseBody = await response.text();
      console.log(`📥 Body: ${responseBody}`);

      if (response.status === 201) {
        console.log("✅ SUCCESS: Customer created!");
        break; // Found the right content type
      } else if (response.status === 406) {
        console.log("❌ 406: MediaType not supported");
      } else if (response.status === 401) {
        console.log("❌ 401: Authentication failed");
      } else {
        console.log(
          `ℹ️  Got ${response.status}: ${responseBody.substring(0, 100)}`
        );
      }
    } catch (error: any) {
      console.error(`❌ Error: ${error.message}`);
    }
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

testContentTypes().catch((error) => {
  console.error("Unexpected error:", error);
  process.exit(1);
});
