/**
 * Example showing how the enhanced error handling works
 * This file demonstrates the improved error messages you'll get
 * instead of the raw fetch Response objects
 */

import { PlanService } from "./services/plan.service";
import { CyberSourceService } from "./cybersource.service";

// Example of what you would get before vs after the improvements

// BEFORE (what you were seeing):
// Raw Response object with no useful information:
/*
{
  [Symbol(Response internals)]: {
    body: ReadableStream { locked: false, state: 'readable', ... },
    disturbed: false,
    error: null
  },
  [Symbol(Headers)]: HeadersList {
    cookies: null,
    [Symbol(headers map)]: Map(0) {},
    [Symbol(headers map sorted)]: null
  }
}
*/

// AFTER (what you'll get now):
// Enhanced error with meaningful information:
/*
Error: Unsupported Media Type (415): The server cannot process the request format. Check Content-Type headers and request body formatting. Server message: Invalid content type
    at BaseCyberSourceService.enhanceError (base.service.ts:xxx)
    at BaseCyberSourceService.executeApiCall (base.service.ts:xxx)
    
Additional properties available on error object:
- error.status: 415
- error.statusText: "Unsupported Media Type"
- error.headers: { "content-type": "application/json", ... }
- error.responseBody: { message: "Invalid content type", details: [...] }
- error.errorType: "fetch_response"
- error.originalError: [original Response object]
*/

// Example usage that will now provide better error messages:
async function exampleUsage() {
  try {
    // This might fail with a 415 error
    const cyberSourceService = new CyberSourceService({
      merchantId: "your-merchant-id",
      apiKey: "your-api-key",
      sharedSecretKey: "your-secret-key",
    });

    const planService = new PlanService(cyberSourceService);

    await planService.createPlan({
      planInformation: {
        name: "Test Plan",
        description: "A test subscription plan",
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
          billingAmount: "10.00",
          setupFee: "2.00",
        },
      },
    });
  } catch (error: any) {
    // Instead of getting a useless Response object, you'll now get:
    console.error("Plan creation failed:", error.message);
    // Example: "Unsupported Media Type (415): The server cannot process the request format..."

    // You can also access additional debugging information:
    console.error("HTTP Status:", error.status);
    console.error("Response Headers:", error.headers);
    console.error("Server Response:", error.responseBody);

    // For 415 errors specifically, check the logs for additional troubleshooting tips
  }
}

// The enhanced error handling will also provide detailed logs:
/*
[PlanService] Creating plan...
[PlanService] Creating plan - ❌ Failed {
  status: 415,
  statusText: "Unsupported Media Type",
  type: "fetch_response",
  url: "https://apitest.cybersource.com/rbs/v1/plans",
  headers: { ... },
  responseBody: { message: "Invalid content type", ... }
}

[PlanService] 415 Unsupported Media Type Error - Creating plan {
  message: "The server cannot process the request format. This usually indicates a Content-Type issue.",
  troubleshooting: [
    "Check if Content-Type header is correctly set to 'application/json'",
    "Verify the request body is properly formatted JSON",
    "Ensure the API endpoint accepts the request format",
    "Check for any required headers that might be missing"
  ],
  errorDetails: { ... }
}
*/

export { exampleUsage };
