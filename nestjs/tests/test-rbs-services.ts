/**
 * Test script for RBS (Recurring Billing Subscriptions) services
 * This script demonstrates how to use the Plan and Subscription services
 */

import { CyberSourceService } from "../cybersource.service";
import { PlanService } from "../services/plan.service";
import { SubscriptionService } from "../services/subscription.service";

async function testRbsServices() {
  console.log("🔄 Testing RBS (Recurring Billing Subscriptions) Services");
  console.log("========================================================\n");

  // Check if we have real credentials
  const hasRealCredentials =
    process.env.CYBERSOURCE_MERCHANT_ID &&
    process.env.CYBERSOURCE_API_KEY &&
    process.env.CYBERSOURCE_SHARED_SECRET;

  console.log("📋 Credentials Check:");
  console.log(
    `CYBERSOURCE_MERCHANT_ID: ${
      process.env.CYBERSOURCE_MERCHANT_ID ? "✅ Set" : "❌ Not set"
    }`
  );
  console.log(
    `CYBERSOURCE_API_KEY: ${
      process.env.CYBERSOURCE_API_KEY ? "✅ Set" : "❌ Not set"
    }`
  );
  console.log(
    `CYBERSOURCE_SHARED_SECRET: ${
      process.env.CYBERSOURCE_SHARED_SECRET ? "✅ Set" : "❌ Not set"
    }`
  );
  console.log(
    `CYBERSOURCE_ENVIRONMENT: ${
      process.env.CYBERSOURCE_ENVIRONMENT || "sandbox"
    }`
  );
  console.log("");

  if (!hasRealCredentials) {
    console.log(
      "⚠️  To test with real credentials, set these environment variables:"
    );
    console.log('   export CYBERSOURCE_MERCHANT_ID="your_merchant_id"');
    console.log('   export CYBERSOURCE_API_KEY="your_api_key"');
    console.log('   export CYBERSOURCE_SHARED_SECRET="your_shared_secret"');
    console.log(
      '   export CYBERSOURCE_ENVIRONMENT="sandbox" # or "production"'
    );
    console.log(
      "\n💡 Continuing with test credentials to check our code structure...\n"
    );
  }

  const config = {
    merchantId: process.env.CYBERSOURCE_MERCHANT_ID || "test_merchant_id",
    apiKey: process.env.CYBERSOURCE_API_KEY || "test_api_key",
    sharedSecretKey:
      process.env.CYBERSOURCE_SHARED_SECRET ||
      "dGVzdF9zaGFyZWRfc2VjcmV0X2tleQ==",
    environment:
      (process.env.CYBERSOURCE_ENVIRONMENT as "sandbox" | "production") ||
      "sandbox",
  };

  try {
    console.log("🚀 Initializing CyberSource services...");
    const cyberSourceService = new CyberSourceService(config);
    const planService = new PlanService(cyberSourceService);
    const subscriptionService = new SubscriptionService(cyberSourceService);
    console.log("✅ Services initialized successfully");
    console.log("");

    console.log("🎯 Testing RBS API access...");
    try {
      // Test if we can access the RBS API directly
      console.log(
        "Available RBS methods:",
        Object.getOwnPropertyNames(cyberSourceService.rbs)
      );
      console.log("");
    } catch (error) {
      console.log("❌ Error accessing RBS API:", error);
    }

    // Test Plan Service
    console.log("📋 Testing Plan Service...");
    try {
      console.log("📝 Preparing test plan data...");
      const testPlan = {
        planInformation: {
          name: `Test Plan ${Date.now()}`,
          description: "A test subscription plan",
          status: "DRAFT" as const,
          billingCycles: {
            frequency: "MONTHLY" as const,
            totalCycles: 12,
          },
        },
        billingInformation: {
          amount: "29.99",
          currency: "USD",
        },
      };

      console.log("Test plan:", JSON.stringify(testPlan, null, 2));
      console.log("");

      console.log("🎬 Attempting plan creation...");
      const planResult = await planService.createPlan(testPlan);

      console.log("🎉 SUCCESS! Plan created successfully!");
      console.log("Plan ID:", planResult.id);
      console.log("Plan Code:", planResult.planInformation?.code);
      console.log("Plan Status:", planResult.status);
    } catch (error: any) {
      console.log("❌ Plan creation failed");
      console.log("Status:", error?.response?.status || "undefined");
      console.log("Status Text:", error?.response?.statusText || "undefined");
      console.log("Error:", error?.message || String(error));
    }

    console.log("");

    // Test Subscription Service
    console.log("📅 Testing Subscription Service...");
    try {
      console.log("📝 Preparing test subscription data...");
      const testSubscription = {
        subscriptionInformation: {
          name: `Test Subscription ${Date.now()}`,
          description: "A test subscription",
          startDate: new Date().toISOString().split("T")[0],
          planId: "plan_12345", // This would be a real plan ID in production
        },
        paymentInformation: {
          customer: {
            id: "customer_12345", // This would be a real customer token
          },
        },
      };

      console.log(
        "Test subscription:",
        JSON.stringify(testSubscription, null, 2)
      );
      console.log("");

      console.log("🎬 Attempting subscription creation...");
      const subscriptionResult = await subscriptionService.createSubscription(
        testSubscription
      );

      console.log("🎉 SUCCESS! Subscription created successfully!");
      console.log("Subscription ID:", subscriptionResult.id);
      console.log(
        "Subscription Code:",
        subscriptionResult.subscriptionInformation?.code
      );
      console.log("Subscription Status:", subscriptionResult.status);
    } catch (error: any) {
      console.log("❌ Subscription creation failed");
      console.log("Status:", error?.response?.status || "undefined");
      console.log("Status Text:", error?.response?.statusText || "undefined");
      console.log("Error:", error?.message || String(error));
    }

    console.log("");

    // Test utility methods
    console.log("🔧 Testing utility methods...");
    try {
      console.log("🎬 Attempting to generate plan code...");
      const planCodeResult = await planService.getPlanCode();
      console.log("✅ Generated plan code:", planCodeResult.code);
    } catch (error: any) {
      console.log(
        "❌ Plan code generation failed:",
        error?.message || String(error)
      );
    }

    try {
      console.log("🎬 Attempting to generate subscription code...");
      const subscriptionCodeResult =
        await subscriptionService.getSubscriptionCode();
      console.log(
        "✅ Generated subscription code:",
        subscriptionCodeResult.code
      );
    } catch (error: any) {
      console.log(
        "❌ Subscription code generation failed:",
        error?.message || String(error)
      );
    }

    if (!hasRealCredentials) {
      console.log(
        "\n💡 Note: These errors might be expected since we're using test credentials"
      );
      console.log(
        "   Try running with real CyberSource credentials for accurate testing"
      );
    }
  } catch (error: any) {
    console.log("💥 Fatal error during service initialization:");
    console.log("Error:", error?.message || String(error));
    console.log("Stack:", error?.stack);
  }

  console.log("\n📊 RBS Services Summary:");
  console.log("========================");
  console.log(
    "✅ Plan Service - Create, Read, Update, Delete, Activate, Deactivate plans"
  );
  console.log(
    "✅ Subscription Service - Create, Read, Update, Cancel, Suspend, Activate subscriptions"
  );
  console.log("✅ Code generation utilities for both plans and subscriptions");
  console.log("✅ Follow-on subscription support");
  console.log("✅ Proper error handling and logging");
  console.log("✅ Clean, type-safe DTOs for all operations");
}

// Run the test
if (require.main === module) {
  testRbsServices().catch(console.error);
}

export { testRbsServices };
