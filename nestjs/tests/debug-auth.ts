/**
 * Debug CyberSource Authentication
 * This script helps debug HTTP signature generation issues
 */

import { CyberSourceAuthUtil } from "../utils/cybersource-auth.util";

function debugAuthentication() {
  const merchantId = process.env.CYBERSOURCE_MERCHANT_ID!;
  const apiKey = process.env.CYBERSOURCE_API_KEY!;
  const sharedSecretKey = process.env.CYBERSOURCE_SHARED_SECRET!;

  console.log("🔍 CyberSource Authentication Debug");
  console.log("=====================================");
  console.log(`Merchant ID: ${merchantId}`);
  console.log(`API Key: ${apiKey}`);
  console.log(`Shared Secret (length): ${sharedSecretKey.length} chars`);
  console.log(
    `Shared Secret (first 10): ${sharedSecretKey.substring(0, 10)}...`
  );
  console.log("");

  // Test simple GET request
  const testPath = "/tms/v2/customers/test-customer-id";
  const testHost = "apitest.cybersource.com";

  console.log("🧪 Testing GET Request Authentication");
  console.log("=====================================");
  console.log(`Method: GET`);
  console.log(`Host: ${testHost}`);
  console.log(`Path: ${testPath}`);
  console.log("");

  const authHeaders = CyberSourceAuthUtil.generateAuthHeaders({
    merchantId,
    apiKey,
    sharedSecretKey,
    method: "GET",
    path: testPath,
    host: testHost,
  });

  console.log("📋 Generated Headers:");
  console.log("====================");
  Object.entries(authHeaders).forEach(([key, value]) => {
    console.log(`${key}: ${value}`);
  });
  console.log("");

  // Test POST request with body
  console.log("🧪 Testing POST Request Authentication");
  console.log("======================================");

  const postPath = "/tms/v2/customers";
  const postBody = {
    buyerInformation: {
      email: "test@example.com",
    },
  };

  console.log(`Method: POST`);
  console.log(`Host: ${testHost}`);
  console.log(`Path: ${postPath}`);
  console.log(`Body: ${JSON.stringify(postBody)}`);
  console.log("");

  const postAuthHeaders = CyberSourceAuthUtil.generateAuthHeaders({
    merchantId,
    apiKey,
    sharedSecretKey,
    method: "POST",
    path: postPath,
    body: postBody,
    host: testHost,
  });

  console.log("📋 Generated Headers:");
  console.log("====================");
  Object.entries(postAuthHeaders).forEach(([key, value]) => {
    console.log(`${key}: ${value}`);
  });
  console.log("");

  // Test the signature string construction step by step
  console.log("🔍 Signature String Construction Debug");
  console.log("=====================================");

  const date = new Date().toUTCString();
  const requestTarget = "post /tms/v2/customers";
  const bodyString = JSON.stringify(postBody);
  const bodyHash = require("crypto")
    .createHash("sha256")
    .update(bodyString, "utf8")
    .digest("base64");
  const digest = `SHA-256=${bodyHash}`;

  console.log(`Date: ${date}`);
  console.log(`Request Target: ${requestTarget}`);
  console.log(`Body Hash: ${bodyHash}`);
  console.log(`Digest: ${digest}`);
  console.log("");

  const signatureStringParts = [
    `host: ${testHost}`,
    `date: ${date}`,
    `request-target: ${requestTarget}`,
    `digest: ${digest}`,
    `v-c-merchant-id: ${merchantId}`,
  ];

  const signatureString = signatureStringParts.join("\n");
  console.log("Signature String:");
  console.log("-----------------");
  console.log(signatureString);
  console.log("");

  // Generate signature
  const decodedSecret = Buffer.from(sharedSecretKey, "base64");
  const hmac = require("crypto").createHmac("sha256", decodedSecret);
  hmac.update(signatureString, "utf8");
  const signatureValue = hmac.digest("base64");

  console.log(
    `HMAC Key (base64 decoded, first 10 bytes): ${decodedSecret
      .toString("hex")
      .substring(0, 20)}...`
  );
  console.log(`Signature Value: ${signatureValue}`);
  console.log("");

  const headersList = "host date request-target digest v-c-merchant-id";
  const signatureHeader = `keyid="${apiKey}", algorithm="HmacSHA256", headers="${headersList}", signature="${signatureValue}"`;

  console.log(`Headers List: ${headersList}`);
  console.log(`Final Signature Header: ${signatureHeader}`);
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

debugAuthentication();
