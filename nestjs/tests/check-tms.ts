/**
 * CyberSource TMS Feature Check
 * Tests if Token Management Service is enabled
 */

async function checkTMSAvailability() {
  const merchantId = process.env.CYBERSOURCE_MERCHANT_ID!;

  console.log("🔍 Checking CyberSource TMS Service Availability");
  console.log("===============================================");
  console.log(`Merchant ID: ${merchantId}`);
  console.log("");

  // Just try to access the TMS endpoints without authentication to see what we get
  const endpoints = [
    "/tms/v2/customers",
    "/tms/v2/payment-instruments",
    "/tms/v2/instrument-identifiers",
  ];

  for (const endpoint of endpoints) {
    const url = `https://apitest.cybersource.com${endpoint}`;
    console.log(`🧪 Testing: ${url}`);

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "User-Agent": "CyberSource-Test/1.0",
        },
      });

      console.log(`   📥 Status: ${response.status} ${response.statusText}`);

      if (response.status === 401) {
        console.log("   ✅ Service available (401 = needs authentication)");
      } else if (response.status === 404) {
        console.log("   ❌ Service not found (404 = endpoint doesn't exist)");
      } else if (response.status === 405) {
        console.log(
          "   ✅ Service available (405 = method not allowed, but endpoint exists)"
        );
      } else {
        const body = await response.text();
        console.log(`   📋 Body: ${body.substring(0, 100)}...`);
      }
    } catch (error: any) {
      console.log(`   ❌ Error: ${error.message}`);
    }
    console.log("");
  }

  // Check if there's a specific issue with your merchant account
  console.log("📋 Troubleshooting Information:");
  console.log("================================");
  console.log("If you're getting 406/415 errors consistently:");
  console.log(
    "1. Check if Token Management Service is enabled in your CyberSource account"
  );
  console.log(
    "2. Go to: Business Center > Account Management > Business Center Setup"
  );
  console.log("3. Verify 'Token Management Service' is activated");
  console.log("4. Some features require specific entitlements");
  console.log("");
  console.log("Alternative test: Try creating a simple payment instead:");
  console.log("- Payment processing might be enabled even if TMS isn't");
  console.log("- Use /pts/v2/payments endpoint for basic payment testing");
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

checkTMSAvailability().catch((error) => {
  console.error("Unexpected error:", error);
  process.exit(1);
});
