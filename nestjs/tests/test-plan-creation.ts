import { NestFactory } from "@nestjs/core";
import { Module, Logger } from "@nestjs/common";
import { CyberSourceModule, CyberSourceService } from "../index";
import * as path from "path";
import * as fs from "fs";

/**
 * Test script to verify plan creation with debug mode enabled
 * This will show the exact headers and body being sent to CyberSource
 */

// Simple .env file loader (to avoid adding dotenv as a dependency)
function loadEnv() {
  const envPath = path.join(__dirname, "..", ".env");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf-8");
    envContent.split("\n").forEach((line) => {
      const match = line.match(/^([^=:#]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim();
        process.env[key] = value;
      }
    });
    console.log("✅ Loaded credentials from .env file");
  } else {
    console.log(
      "⚠️  No .env file found. Using environment variables or defaults."
    );
  }
}

loadEnv();

@Module({
  imports: [
    CyberSourceModule.forRoot({
      merchantId: process.env.CYBERSOURCE_MERCHANT_ID || "your-merchant-id",
      apiKey: process.env.CYBERSOURCE_API_KEY || "your-api-key",
      sharedSecretKey:
        process.env.CYBERSOURCE_SHARED_SECRET || "your-shared-secret",
      sandbox: true,
      debug: true, // Enable debug mode to see detailed request/response
    }),
  ],
})
class TestModule {}

async function testPlanCreation() {
  const app = await NestFactory.createApplicationContext(TestModule, {
    logger: ["error", "warn", "log", "debug"], // Enable all log levels
  });

  const cyberSource = app.get(CyberSourceService);
  const logger = new Logger("PlanTest");

  try {
    logger.log("=".repeat(80));
    logger.log("Testing Plan Creation with Debug Mode");
    logger.log("=".repeat(80));

    // This is the exact request body from CyberSource dev tools
    const planRequest = {
      planInformation: {
        name: "Gold Plan",
        description: "New Gold Plan",
        billingPeriod: {
          length: "1",
          unit: "M",
        },
        billingCycles: {
          total: "12",
        },
      },
      orderInformation: {
        amountDetails: {
          currency: "USD",
          billingAmount: "10",
          setupFee: "2",
        },
      },
    };

    logger.log("\nRequest Body:");
    logger.log(JSON.stringify(planRequest, null, 2));

    logger.log("\nMinified Request Body (what actually gets sent):");
    logger.log(JSON.stringify(planRequest));
    logger.log(`\nBody length: ${JSON.stringify(planRequest).length} bytes`);

    logger.log("\n" + "=".repeat(80));
    logger.log("Making API Call...");
    logger.log("=".repeat(80) + "\n");

    // Access the RBS (Recurring Billing Services) API
    // The correct method is createPlan, not plansCreatePlan
    const result = await cyberSource.rbs.createPlan(planRequest);

    logger.log("\n" + "=".repeat(80));
    logger.log("SUCCESS! Plan Created");
    logger.log("=".repeat(80));
    logger.log("\nResponse:");
    logger.log(JSON.stringify(result.data, null, 2));
  } catch (error: any) {
    logger.error("\n" + "=".repeat(80));
    logger.error("FAILED! Error Creating Plan");
    logger.error("=".repeat(80));

    if (error.response) {
      logger.error(`\nStatus: ${error.response.status}`);
      logger.error(`Status Text: ${error.response.statusText}`);
      logger.error("\nResponse Body:");
      logger.error(JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      logger.error("\nNo response received from server");
      logger.error("Request was:", error.request);
    } else {
      logger.error("\nError:", error.message);
    }

    logger.error("\n" + "=".repeat(80));
    logger.error("COMPARISON WITH CYBERSOURCE DEV TOOLS:");
    logger.error("=".repeat(80));
    logger.error("\nExpected Headers (from CyberSource dev tools):");
    logger.error("  Content-Type: application/json");
    logger.error("  Host: apitest.cybersource.com");
    logger.error("  v-c-date: [RFC1123 format]");
    logger.error("  v-c-merchant-id: [your merchant ID]");
    logger.error("  digest: SHA-256=[base64 hash]");
    logger.error("  signature: keyid=..., algorithm=HmacSHA256, headers=...");
    logger.error("\nExpected Body (from CyberSource dev tools):");
    logger.error(
      JSON.stringify(
        {
          planInformation: {
            name: "Gold Plan",
            description: "New Gold Plan",
            billingPeriod: { length: "1", unit: "M" },
            billingCycles: { total: "12" },
          },
          orderInformation: {
            amountDetails: {
              currency: "USD",
              billingAmount: "10",
              setupFee: "2",
            },
          },
        },
        null,
        2
      )
    );
    logger.error("\nCheck the debug output above to compare!");
  }

  await app.close();
}

// Run the test
testPlanCreation().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
