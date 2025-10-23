import { Injectable, Logger } from "@nestjs/common";
import { CyberSourceService } from "../cybersource.service";

/**
 * Base service class that provides common functionality for all CyberSource services
 */
@Injectable()
export abstract class BaseCyberSourceService {
  protected readonly logger: Logger;

  constructor(
    protected readonly cyberSourceService: CyberSourceService,
    serviceName: string
  ) {
    this.logger = new Logger(serviceName);
  }

  /**
   * Execute an API call with standardized error handling and logging
   * @param operation - Description of the operation being performed
   * @param apiCall - The API call function to execute
   * @param logData - Optional data to include in logs
   * @returns Promise with the API response data
   */
  protected async executeApiCall<T>(
    operation: string,
    apiCall: () => Promise<{ data: T }>,
    logData?: Record<string, any>
  ): Promise<T> {
    try {
      this.logger.log(`${operation}...`);
      const response = await apiCall();

      // Create a concise success log
      const successInfo: any = {};
      const responseData = response.data as any;

      if (responseData?.id) {
        successInfo.id = responseData.id;
      }
      if (responseData?.status) {
        successInfo.status = responseData.status;
      }
      if (logData && Object.keys(logData).length > 0) {
        // Only include essential log data keys
        const essentialKeys = [
          "customerId",
          "paymentInstrumentId",
          "shippingAddressId",
          "planId",
          "subscriptionId",
        ];
        for (const key of essentialKeys) {
          if (logData[key]) {
            successInfo[key] = logData[key];
          }
        }
      }

      this.logger.log(`${operation} - ✅ Success`, successInfo);
      return response.data;
    } catch (error) {
      // Enhanced error handling for better debugging
      const errorInfo = await this.parseErrorForLogging(error);

      // Include essential context from logData
      if (logData) {
        const essentialKeys = [
          "customerId",
          "paymentInstrumentId",
          "shippingAddressId",
          "planId",
          "subscriptionId",
        ];
        for (const key of essentialKeys) {
          if (logData[key]) {
            errorInfo[key] = logData[key];
          }
        }
      }

      this.logger.error(`${operation} - ❌ Failed`, errorInfo);

      // Special handling for 415 Unsupported Media Type errors
      if (errorInfo.status === 415) {
        await this.log415ErrorDetails(error, operation);
      }

      // Convert the error to a more useful format before throwing
      const enhancedError = await this.enhanceError(error);
      throw enhancedError;
    }
  }

  /**
   * Execute an API call that doesn't return data (like delete operations)
   * @param operation - Description of the operation being performed
   * @param apiCall - The API call function to execute
   * @param logData - Optional data to include in logs
   * @returns Promise<void>
   */
  protected async executeVoidApiCall(
    operation: string,
    apiCall: () => Promise<any>,
    logData?: Record<string, any>
  ): Promise<void> {
    try {
      this.logger.log(`${operation}...`);
      await apiCall();

      // Create a concise success log for void operations
      const successInfo: any = {};
      if (logData) {
        const essentialKeys = [
          "customerId",
          "paymentInstrumentId",
          "shippingAddressId",
          "planId",
          "subscriptionId",
        ];
        for (const key of essentialKeys) {
          if (logData[key]) {
            successInfo[key] = logData[key];
          }
        }
      }

      this.logger.log(`${operation} - ✅ Success`, successInfo);
    } catch (error) {
      // Enhanced error handling for better debugging
      const errorInfo = await this.parseErrorForLogging(error);

      // Include essential context from logData
      if (logData) {
        const essentialKeys = [
          "customerId",
          "paymentInstrumentId",
          "shippingAddressId",
          "planId",
          "subscriptionId",
        ];
        for (const key of essentialKeys) {
          if (logData[key]) {
            errorInfo[key] = logData[key];
          }
        }
      }

      this.logger.error(`${operation} - ❌ Failed`, errorInfo);

      // Special handling for 415 Unsupported Media Type errors
      if (errorInfo.status === 415) {
        await this.log415ErrorDetails(error, operation);
      }

      // Convert the error to a more useful format before throwing
      const enhancedError = await this.enhanceError(error);
      throw enhancedError;
    }
  }

  /**
   * Parse error object to get error message
   * @param error - Error object
   * @returns string representation of the error
   */
  protected getErrorMessage(error: any): string {
    if (error?.response?.data?.message) {
      return error.response.data.message;
    }
    if (error?.message) {
      return error.message;
    }
    return "Unknown error occurred";
  }

  /**
   * Parse error for consistent error response format
   * @param error - Error object
   * @returns Standardized error response
   */
  protected parseError(error: any): any {
    if (error.response?.data) {
      return error.response.data;
    }

    return {
      submitTimeUtc: new Date().toISOString(),
      status: "ERROR",
      reason: "SYSTEM_ERROR",
      message: error.message || "An unexpected error occurred",
    };
  }

  /**
   * Sanitize request data for logging (remove sensitive information)
   * @param data - Request data
   * @returns Sanitized data safe for logging
   */
  protected sanitizeRequestForLogging(data: any): any {
    if (!data || typeof data !== "object") {
      return data;
    }

    const sanitized = { ...data };
    const sensitiveFields = [
      "number",
      "securityCode",
      "cvv",
      "cvn",
      "password",
      "pin",
      "token",
      "key",
    ];

    const sanitizeObject = (obj: any): any => {
      if (!obj || typeof obj !== "object") {
        return obj;
      }

      const result = Array.isArray(obj) ? [] : {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const lowerKey = key.toLowerCase();
          if (sensitiveFields.some((field) => lowerKey.includes(field))) {
            (result as any)[key] = "***REDACTED***";
          } else if (typeof obj[key] === "object") {
            (result as any)[key] = sanitizeObject(obj[key]);
          } else {
            (result as any)[key] = obj[key];
          }
        }
      }
      return result;
    };

    return sanitizeObject(sanitized);
  }

  /**
   * Parse error information for logging purposes
   * @param error - The error object to parse
   * @returns Object with parsed error information
   */
  private async parseErrorForLogging(error: any): Promise<Record<string, any>> {
    const errorInfo: Record<string, any> = {};

    // Handle different types of errors
    if (error instanceof Response) {
      // Fetch Response object
      errorInfo.status = error.status;
      errorInfo.statusText = error.statusText;
      errorInfo.url = error.url;
      errorInfo.type = "fetch_response";

      // Try to get response body
      try {
        const responseText = await error.clone().text();
        if (responseText) {
          try {
            const responseJson = JSON.parse(responseText);
            errorInfo.responseBody = responseJson;
          } catch {
            errorInfo.responseBody = responseText;
          }
        }
      } catch {
        errorInfo.responseBody = "Unable to read response body";
      }

      // Get headers
      const headers: Record<string, string> = {};
      error.headers.forEach((value, key) => {
        headers[key] = value;
      });
      errorInfo.headers = headers;
    } else if (error?.response) {
      // Axios-style error
      errorInfo.status = error.response.status;
      errorInfo.statusText = error.response.statusText;
      errorInfo.type = "axios_response";

      if (error.response.data) {
        errorInfo.responseBody = error.response.data;
      }

      if (error.response.headers) {
        errorInfo.headers = error.response.headers;
      }
    } else if (error?.status) {
      // Generic error with status
      errorInfo.status = error.status;
      errorInfo.statusText = error.statusText || error.message;
      errorInfo.type = "generic_error";
    } else {
      // Unknown error type
      errorInfo.type = "unknown_error";
      errorInfo.message = error?.message || "Unknown error occurred";

      if (error?.name) {
        errorInfo.errorName = error.name;
      }
    }

    return errorInfo;
  }

  /**
   * Log detailed information for 415 Unsupported Media Type errors
   * @param error - The error object
   * @param operation - The operation that failed
   */
  private async log415ErrorDetails(
    error: any,
    operation: string
  ): Promise<void> {
    this.logger.error(`415 Unsupported Media Type Error - ${operation}`, {
      message:
        "The server cannot process the request format. This usually indicates a Content-Type issue.",
      troubleshooting: [
        "Check if Content-Type header is correctly set to 'application/json'",
        "Verify the request body is properly formatted JSON",
        "Ensure the API endpoint accepts the request format",
        "Check for any required headers that might be missing",
      ],
      errorDetails: await this.parseErrorForLogging(error),
    });
  }

  /**
   * Enhance an error to provide more useful information
   * @param error - The original error
   * @returns Enhanced error with better debugging information
   */
  private async enhanceError(error: any): Promise<Error> {
    const errorInfo = await this.parseErrorForLogging(error);

    // Create a more descriptive error message
    let message = `API Error (${errorInfo.status || "Unknown"})`;

    if (errorInfo.status === 415) {
      message = `Unsupported Media Type (415): The server cannot process the request format. Check Content-Type headers and request body formatting.`;
    } else if (errorInfo.status === 400) {
      message = `Bad Request (400): Invalid request data or format.`;
    } else if (errorInfo.status === 401) {
      message = `Unauthorized (401): Authentication failed or invalid credentials.`;
    } else if (errorInfo.status === 403) {
      message = `Forbidden (403): Access denied or insufficient permissions.`;
    } else if (errorInfo.status === 404) {
      message = `Not Found (404): The requested resource was not found.`;
    } else if (errorInfo.status === 500) {
      message = `Internal Server Error (500): Server-side error occurred.`;
    }

    // Add response body information if available
    if (errorInfo.responseBody) {
      if (typeof errorInfo.responseBody === "object") {
        // Try to extract meaningful error details from response
        const responseBody = errorInfo.responseBody;
        if (responseBody.message) {
          message += ` Server message: ${responseBody.message}`;
        } else if (responseBody.error) {
          message += ` Server error: ${responseBody.error}`;
        } else if (responseBody.details) {
          message += ` Details: ${JSON.stringify(responseBody.details)}`;
        }
      } else if (typeof errorInfo.responseBody === "string") {
        // Include string response if it's not too long
        const responseText = errorInfo.responseBody.substring(0, 200);
        message += ` Server response: ${responseText}${
          errorInfo.responseBody.length > 200 ? "..." : ""
        }`;
      }
    }

    // Create enhanced error
    const enhancedError = new Error(message);

    // Add additional properties for debugging
    (enhancedError as any).originalError = error;
    (enhancedError as any).status = errorInfo.status;
    (enhancedError as any).statusText = errorInfo.statusText;
    (enhancedError as any).headers = errorInfo.headers;
    (enhancedError as any).responseBody = errorInfo.responseBody;
    (enhancedError as any).errorType = errorInfo.type;

    return enhancedError;
  }
}
