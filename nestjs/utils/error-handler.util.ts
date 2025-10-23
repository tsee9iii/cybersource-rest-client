/**
 * Error handling utilities for CyberSource API responses
 *
 * Provides standardized error parsing and user-friendly error messages
 */

/**
 * CyberSource API error response structure
 */
export interface CyberSourceApiError {
  status?: string;
  reason?: string;
  message?: string;
  details?: Array<{
    field?: string;
    reason?: string;
  }>;
}

/**
 * Standardized error information
 */
export interface ParsedError {
  code: string;
  message: string;
  userMessage: string;
  field?: string;
  details?: string;
  retryable: boolean;
}

/**
 * Parses CyberSource API error responses into user-friendly format
 *
 * @param error - The error object from CyberSource API
 * @returns Parsed error information
 *
 * @example
 * ```typescript
 * try {
 *   await cybersourceService.createPayment(data);
 * } catch (error) {
 *   const parsedError = parseCyberSourceError(error);
 *   console.error(parsedError.userMessage);
 * }
 * ```
 */
export function parseCyberSourceError(error: any): ParsedError {
  // Default error
  const defaultError: ParsedError = {
    code: "UNKNOWN_ERROR",
    message: error?.message || "An unknown error occurred",
    userMessage:
      "We encountered an error processing your request. Please try again.",
    retryable: true,
  };

  // Check if it's a CyberSource error response
  if (!error?.response?.data) {
    return defaultError;
  }

  const errorData: CyberSourceApiError = error.response.data;
  const status = errorData.status || "";
  const reason = errorData.reason || "";
  const message = errorData.message || "";

  // Map common error codes to user-friendly messages
  const errorMap: Record<string, Partial<ParsedError>> = {
    // Card validation errors
    INVALID_DATA: {
      code: "INVALID_DATA",
      message: "The provided data is invalid",
      userMessage: "Please check your payment information and try again.",
      retryable: false,
    },
    INVALID_CARD: {
      code: "INVALID_CARD",
      message: "Invalid card number",
      userMessage:
        "The card number you entered is invalid. Please check and try again.",
      retryable: false,
    },
    EXPIRED_CARD: {
      code: "EXPIRED_CARD",
      message: "Card has expired",
      userMessage: "This card has expired. Please use a different card.",
      retryable: false,
    },
    INSUFFICIENT_FUND: {
      code: "INSUFFICIENT_FUND",
      message: "Insufficient funds",
      userMessage:
        "The card has insufficient funds. Please use a different payment method.",
      retryable: false,
    },

    // Authorization errors
    UNAUTHORIZED: {
      code: "UNAUTHORIZED",
      message: "Authentication failed",
      userMessage: "Authentication failed. Please contact support.",
      retryable: false,
    },
    FORBIDDEN: {
      code: "FORBIDDEN",
      message: "Access forbidden",
      userMessage: "You do not have permission to perform this action.",
      retryable: false,
    },

    // Processing errors
    PROCESSOR_DECLINED: {
      code: "PROCESSOR_DECLINED",
      message: "Transaction declined by processor",
      userMessage:
        "Your payment was declined. Please contact your bank or try a different card.",
      retryable: false,
    },
    DECLINE: {
      code: "DECLINE",
      message: "Transaction declined",
      userMessage:
        "Your payment was declined. Please try a different payment method.",
      retryable: false,
    },

    // Network/System errors
    GATEWAY_TIMEOUT: {
      code: "GATEWAY_TIMEOUT",
      message: "Gateway timeout",
      userMessage: "The request timed out. Please try again.",
      retryable: true,
    },
    SERVICE_UNAVAILABLE: {
      code: "SERVICE_UNAVAILABLE",
      message: "Service temporarily unavailable",
      userMessage:
        "The service is temporarily unavailable. Please try again in a few moments.",
      retryable: true,
    },
    SYSTEM_ERROR: {
      code: "SYSTEM_ERROR",
      message: "System error occurred",
      userMessage:
        "A system error occurred. Please try again or contact support.",
      retryable: true,
    },

    // Duplicate errors
    DUPLICATE_REQUEST: {
      code: "DUPLICATE_REQUEST",
      message: "Duplicate request detected",
      userMessage: "This request has already been processed.",
      retryable: false,
    },
  };

  // Try to match the error
  const matchedError = errorMap[status] || errorMap[reason];

  if (matchedError) {
    return {
      ...matchedError,
      message: message || matchedError.message || "",
      details: extractFieldDetails(errorData),
      field: extractFieldName(errorData),
    } as ParsedError;
  }

  // HTTP status code based errors
  const httpStatus = error.response?.status;
  if (httpStatus) {
    if (httpStatus === 400) {
      return {
        code: "BAD_REQUEST",
        message: message || "Bad request",
        userMessage:
          "Invalid request. Please check your information and try again.",
        retryable: false,
        details: extractFieldDetails(errorData),
        field: extractFieldName(errorData),
      };
    }

    if (httpStatus === 401) {
      return {
        code: "UNAUTHORIZED",
        message: "Authentication required",
        userMessage: "Authentication failed. Please contact support.",
        retryable: false,
      };
    }

    if (httpStatus === 404) {
      return {
        code: "NOT_FOUND",
        message: "Resource not found",
        userMessage: "The requested resource was not found.",
        retryable: false,
      };
    }

    if (httpStatus === 429) {
      return {
        code: "RATE_LIMIT",
        message: "Rate limit exceeded",
        userMessage: "Too many requests. Please try again in a few moments.",
        retryable: true,
      };
    }

    if (httpStatus >= 500) {
      return {
        code: "SERVER_ERROR",
        message: "Server error",
        userMessage: "A server error occurred. Please try again later.",
        retryable: true,
      };
    }
  }

  return defaultError;
}

/**
 * Extracts field-level error details from CyberSource error
 */
function extractFieldDetails(
  errorData: CyberSourceApiError
): string | undefined {
  if (!errorData.details || errorData.details.length === 0) {
    return undefined;
  }

  const fieldErrors = errorData.details
    .map((d: any) => `${d.field}: ${d.reason}`)
    .join(", ");

  return fieldErrors || undefined;
}

/**
 * Extracts the field name from error details
 */
function extractFieldName(errorData: CyberSourceApiError): string | undefined {
  if (!errorData.details || errorData.details.length === 0) {
    return undefined;
  }

  return errorData.details[0]?.field;
}

/**
 * Determines if an error is retryable
 *
 * @param error - The error to check
 * @returns True if the operation should be retried
 *
 * @example
 * ```typescript
 * if (isRetryableError(error)) {
 *   // Implement retry logic
 *   await retryOperation();
 * }
 * ```
 */
export function isRetryableError(error: any): boolean {
  const parsed = parseCyberSourceError(error);
  return parsed.retryable;
}

/**
 * Creates a retry strategy with exponential backoff
 *
 * @param maxRetries - Maximum number of retry attempts (default: 3)
 * @param initialDelay - Initial delay in milliseconds (default: 1000)
 * @returns Retry configuration
 *
 * @example
 * ```typescript
 * const retryConfig = createRetryStrategy(3, 1000);
 *
 * async function executeWithRetry<T>(
 *   operation: () => Promise<T>,
 *   config: ReturnType<typeof createRetryStrategy>
 * ): Promise<T> {
 *   for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
 *     try {
 *       return await operation();
 *     } catch (error) {
 *       if (attempt === config.maxRetries || !isRetryableError(error)) {
 *         throw error;
 *       }
 *       await new Promise(resolve =>
 *         setTimeout(resolve, config.getDelay(attempt))
 *       );
 *     }
 *   }
 *   throw new Error('Max retries exceeded');
 * }
 * ```
 */
export function createRetryStrategy(
  maxRetries: number = 3,
  initialDelay: number = 1000
) {
  return {
    maxRetries,
    initialDelay,
    getDelay: (attempt: number): number => {
      // Exponential backoff: 1s, 2s, 4s, 8s...
      return initialDelay * Math.pow(2, attempt);
    },
  };
}

/**
 * Logs error details for debugging
 *
 * @param error - The error to log
 * @param context - Additional context information
 *
 * @example
 * ```typescript
 * try {
 *   await cybersourceService.createPayment(data);
 * } catch (error) {
 *   logError(error, { operation: 'createPayment', customerId: '123' });
 *   throw error;
 * }
 * ```
 */
export function logError(error: any, context?: Record<string, any>): void {
  const parsed = parseCyberSourceError(error);

  console.error("[CyberSource Error]", {
    code: parsed.code,
    message: parsed.message,
    userMessage: parsed.userMessage,
    field: parsed.field,
    details: parsed.details,
    retryable: parsed.retryable,
    context,
    timestamp: new Date().toISOString(),
  });
}
