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
      // Create a concise error log
      const errorInfo: any = {};
      const errorResponse = (error as any)?.response;

      if (errorResponse?.status) {
        errorInfo.status = errorResponse.status;
      }
      if (errorResponse?.statusText) {
        errorInfo.statusText = errorResponse.statusText;
      }

      // Include relevant error message
      const errorMessage = this.getErrorMessage(error);
      if (errorMessage && errorMessage !== "Unknown error occurred") {
        errorInfo.message = errorMessage;
      }

      // Include essential context from logData
      if (logData) {
        const essentialKeys = [
          "customerId",
          "paymentInstrumentId",
          "shippingAddressId",
        ];
        for (const key of essentialKeys) {
          if (logData[key]) {
            errorInfo[key] = logData[key];
          }
        }
      }

      this.logger.error(`${operation} - ❌ Failed`, errorInfo);

      // Special handling for 415 Unsupported Media Type errors with detailed debug info
      if (errorResponse?.status === 415) {
        this.logger.debug("415 Unsupported Media Type - Debug Details:", {
          contentType: (error as any)?.config?.headers?.["content-type"],
          requestMethod: (error as any)?.config?.method,
          requestUrl: (error as any)?.config?.url,
          hasRequestBody: !!(error as any)?.config?.data,
        });
      }

      throw error;
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
        ];
        for (const key of essentialKeys) {
          if (logData[key]) {
            successInfo[key] = logData[key];
          }
        }
      }

      this.logger.log(`${operation} - ✅ Success`, successInfo);
    } catch (error) {
      // Create a concise error log
      const errorInfo: any = {};
      const errorResponse = (error as any)?.response;

      if (errorResponse?.status) {
        errorInfo.status = errorResponse.status;
      }
      if (errorResponse?.statusText) {
        errorInfo.statusText = errorResponse.statusText;
      }

      const errorMessage = this.getErrorMessage(error);
      if (errorMessage && errorMessage !== "Unknown error occurred") {
        errorInfo.message = errorMessage;
      }

      // Include essential context from logData
      if (logData) {
        const essentialKeys = [
          "customerId",
          "paymentInstrumentId",
          "shippingAddressId",
        ];
        for (const key of essentialKeys) {
          if (logData[key]) {
            errorInfo[key] = logData[key];
          }
        }
      }

      this.logger.error(`${operation} - ❌ Failed`, errorInfo);
      throw error;
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
}
