# Enhanced Error Handling for CyberSource NestJS Package

## Problem Solved

Previously, when API calls failed (especially with 415 "Unsupported Media Type" errors), the error handling was returning raw fetch `Response` objects that provided no useful debugging information. Users would see cryptic objects like:

```javascript
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
```

## Solution Implemented

### 1. Enhanced Error Parsing

- **Fetch Response Objects**: Automatically detects and parses fetch `Response` objects
- **Response Body Extraction**: Attempts to read and parse response body (JSON or text)
- **Header Extraction**: Extracts all response headers for debugging
- **Multiple Error Types**: Handles Axios errors, generic errors, and unknown error types

### 2. Meaningful Error Messages

Instead of raw objects, you now get descriptive error messages:

```javascript
// Before
[Object object] // Useless

// After
"Unsupported Media Type (415): The server cannot process the request format. Check Content-Type headers and request body formatting. Server message: Invalid content type"
```

### 3. Enhanced Error Objects

The thrown error now includes additional debugging properties:

```javascript
try {
  await planService.createPlan(planData);
} catch (error) {
  console.log(error.message); // Human-readable message
  console.log(error.status); // HTTP status code (415)
  console.log(error.statusText); // Status text ("Unsupported Media Type")
  console.log(error.headers); // Response headers object
  console.log(error.responseBody); // Parsed response body
  console.log(error.errorType); // Error type ("fetch_response")
  console.log(error.originalError); // Original error for deep debugging
}
```

### 4. Detailed Logging

Enhanced logging provides better debugging information:

```
[PlanService] Creating plan - ❌ Failed {
  status: 415,
  statusText: "Unsupported Media Type",
  type: "fetch_response",
  url: "https://apitest.cybersource.com/rbs/v1/plans",
  headers: { "content-type": "application/json", ... },
  responseBody: { message: "Invalid content type", details: [...] }
}
```

### 5. 415-Specific Troubleshooting

For 415 errors specifically, additional troubleshooting guidance is logged:

```
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
```

## Files Modified

### `/nestjs/services/base.service.ts`

- **`executeApiCall()`**: Enhanced with better error handling
- **`executeVoidApiCall()`**: Updated to use same error handling
- **`parseErrorForLogging()`**: New method to parse different error types
- **`log415ErrorDetails()`**: New method for 415-specific debugging
- **`enhanceError()`**: New method to create meaningful error objects

## Benefits

1. **Better Debugging**: Meaningful error messages instead of cryptic objects
2. **Faster Problem Resolution**: Clear indication of what went wrong
3. **Comprehensive Information**: Access to status codes, headers, and response bodies
4. **Specific Guidance**: Targeted troubleshooting tips for common errors like 415
5. **Backward Compatibility**: Existing code continues to work, just with better error information

## Usage Example

```typescript
import { PlanService } from "@infinitesolutions/cybersource-nestjs";

try {
  const result = await planService.createPlan({
    planInformation: {
      name: "Monthly Plan",
      description: "Monthly subscription plan",
      billingCycles: {
        frequency: "MONTHLY",
        totalCycles: 12,
      },
    },
  });
  console.log("Plan created:", result);
} catch (error) {
  // Now you get meaningful error information:
  console.error("Error:", error.message);
  console.error("Status:", error.status);
  console.error("Response:", error.responseBody);

  // Handle specific error types
  if (error.status === 415) {
    console.error(
      "Content-Type issue detected. Check request headers and body format."
    );
  }
}
```

## Testing

The enhanced error handling has been implemented and tested:

- ✅ TypeScript compilation successful
- ✅ All existing functionality preserved
- ✅ New error parsing methods working
- ✅ Enhanced logging active
- ✅ 415 error troubleshooting enabled

Your 415 "Unsupported Media Type" errors will now provide actionable debugging information instead of useless Response objects!
