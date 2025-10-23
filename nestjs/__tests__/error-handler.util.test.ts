import { describe, expect, test, jest } from "@jest/globals";
import {
  parseCyberSourceError,
  isRetryableError,
  createRetryStrategy,
  logError,
} from "../utils/error-handler.util";

describe("Error Handler Utilities", () => {
  describe("parseCyberSourceError", () => {
    test("should parse invalid card error", () => {
      const error = {
        response: {
          status: 400,
          data: {
            status: "INVALID_CARD",
            reason: "INVALID_CARD",
            message: "Invalid card number",
          },
        },
      };

      const parsed = parseCyberSourceError(error);
      expect(parsed.code).toBe("INVALID_CARD");
      expect(parsed.retryable).toBe(false);
      expect(parsed.userMessage).toContain("card number");
    });

    test("should parse expired card error", () => {
      const error = {
        response: {
          status: 400,
          data: {
            status: "EXPIRED_CARD",
            message: "Card has expired",
          },
        },
      };

      const parsed = parseCyberSourceError(error);
      expect(parsed.code).toBe("EXPIRED_CARD");
      expect(parsed.retryable).toBe(false);
      expect(parsed.userMessage).toContain("expired");
    });

    test("should parse declined transaction error", () => {
      const error = {
        response: {
          status: 400,
          data: {
            status: "DECLINE",
            message: "Transaction declined",
          },
        },
      };

      const parsed = parseCyberSourceError(error);
      expect(parsed.code).toBe("DECLINE");
      expect(parsed.retryable).toBe(false);
      expect(parsed.userMessage).toContain("declined");
    });

    test("should parse insufficient funds error", () => {
      const error = {
        response: {
          status: 400,
          data: {
            status: "INSUFFICIENT_FUND",
            message: "Insufficient funds",
          },
        },
      };

      const parsed = parseCyberSourceError(error);
      expect(parsed.code).toBe("INSUFFICIENT_FUND");
      expect(parsed.retryable).toBe(false);
      expect(parsed.userMessage).toContain("insufficient");
    });

    test("should parse gateway timeout as retryable", () => {
      const error = {
        response: {
          status: 504,
          data: {
            status: "GATEWAY_TIMEOUT",
            message: "Gateway timeout",
          },
        },
      };

      const parsed = parseCyberSourceError(error);
      expect(parsed.code).toBe("GATEWAY_TIMEOUT");
      expect(parsed.retryable).toBe(true);
      expect(parsed.userMessage).toContain("timed out");
    });

    test("should parse service unavailable as retryable", () => {
      const error = {
        response: {
          status: 503,
          data: {
            status: "SERVICE_UNAVAILABLE",
            message: "Service temporarily unavailable",
          },
        },
      };

      const parsed = parseCyberSourceError(error);
      expect(parsed.code).toBe("SERVICE_UNAVAILABLE");
      expect(parsed.retryable).toBe(true);
    });

    test("should parse 401 unauthorized error", () => {
      const error = {
        response: {
          status: 401,
          data: {
            message: "Unauthorized",
          },
        },
      };

      const parsed = parseCyberSourceError(error);
      expect(parsed.code).toBe("UNAUTHORIZED");
      expect(parsed.retryable).toBe(false);
      expect(parsed.userMessage).toContain("Authentication");
    });

    test("should parse 404 not found error", () => {
      const error = {
        response: {
          status: 404,
          data: {
            message: "Resource not found",
          },
        },
      };

      const parsed = parseCyberSourceError(error);
      expect(parsed.code).toBe("NOT_FOUND");
      expect(parsed.retryable).toBe(false);
    });

    test("should parse 429 rate limit error as retryable", () => {
      const error = {
        response: {
          status: 429,
          data: {
            message: "Too many requests",
          },
        },
      };

      const parsed = parseCyberSourceError(error);
      expect(parsed.code).toBe("RATE_LIMIT");
      expect(parsed.retryable).toBe(true);
      expect(parsed.userMessage).toContain("Too many requests");
    });

    test("should parse 500 server error as retryable", () => {
      const error = {
        response: {
          status: 500,
          data: {
            message: "Internal server error",
          },
        },
      };

      const parsed = parseCyberSourceError(error);
      expect(parsed.code).toBe("SERVER_ERROR");
      expect(parsed.retryable).toBe(true);
    });

    test("should extract field-level errors", () => {
      const error = {
        response: {
          status: 400,
          data: {
            status: "INVALID_DATA",
            message: "Invalid data",
            details: [
              { field: "cardNumber", reason: "Invalid format" },
              { field: "cvv", reason: "Required field missing" },
            ],
          },
        },
      };

      const parsed = parseCyberSourceError(error);
      expect(parsed.details).toBeDefined();
      expect(parsed.details).toContain("cardNumber");
      expect(parsed.details).toContain("cvv");
      expect(parsed.field).toBe("cardNumber"); // First field
    });

    test("should handle errors without response data", () => {
      const error = {
        message: "Network error",
      };

      const parsed = parseCyberSourceError(error);
      expect(parsed.code).toBe("UNKNOWN_ERROR");
      expect(parsed.retryable).toBe(true);
      expect(parsed.message).toContain("Network error");
    });

    test("should handle bad request with field details", () => {
      const error = {
        response: {
          status: 400,
          data: {
            message: "Bad request",
            details: [{ field: "email", reason: "Invalid email format" }],
          },
        },
      };

      const parsed = parseCyberSourceError(error);
      expect(parsed.code).toBe("BAD_REQUEST");
      expect(parsed.retryable).toBe(false);
      expect(parsed.field).toBe("email");
    });

    test("should parse duplicate request error", () => {
      const error = {
        response: {
          status: 400,
          data: {
            status: "DUPLICATE_REQUEST",
            message: "Duplicate request",
          },
        },
      };

      const parsed = parseCyberSourceError(error);
      expect(parsed.code).toBe("DUPLICATE_REQUEST");
      expect(parsed.retryable).toBe(false);
      expect(parsed.userMessage).toContain("already been processed");
    });

    test("should use reason field when status is not available", () => {
      const error = {
        response: {
          status: 400,
          data: {
            reason: "INVALID_CARD",
            message: "Card validation failed",
          },
        },
      };

      const parsed = parseCyberSourceError(error);
      expect(parsed.code).toBe("INVALID_CARD");
      expect(parsed.retryable).toBe(false);
    });
  });

  describe("isRetryableError", () => {
    test("should return true for gateway timeout", () => {
      const error = {
        response: {
          status: 504,
          data: { status: "GATEWAY_TIMEOUT" },
        },
      };
      expect(isRetryableError(error)).toBe(true);
    });

    test("should return true for service unavailable", () => {
      const error = {
        response: {
          status: 503,
          data: { status: "SERVICE_UNAVAILABLE" },
        },
      };
      expect(isRetryableError(error)).toBe(true);
    });

    test("should return true for rate limit", () => {
      const error = {
        response: {
          status: 429,
          data: {},
        },
      };
      expect(isRetryableError(error)).toBe(true);
    });

    test("should return true for server errors (5xx)", () => {
      const error = {
        response: {
          status: 500,
          data: {},
        },
      };
      expect(isRetryableError(error)).toBe(true);
    });

    test("should return false for invalid card", () => {
      const error = {
        response: {
          status: 400,
          data: { status: "INVALID_CARD" },
        },
      };
      expect(isRetryableError(error)).toBe(false);
    });

    test("should return false for declined transactions", () => {
      const error = {
        response: {
          status: 400,
          data: { status: "DECLINE" },
        },
      };
      expect(isRetryableError(error)).toBe(false);
    });

    test("should return false for unauthorized", () => {
      const error = {
        response: {
          status: 401,
          data: {},
        },
      };
      expect(isRetryableError(error)).toBe(false);
    });

    test("should return true for network errors", () => {
      const error = {
        message: "Network error",
      };
      expect(isRetryableError(error)).toBe(true);
    });
  });

  describe("createRetryStrategy", () => {
    test("should create strategy with default values", () => {
      const strategy = createRetryStrategy();
      expect(strategy.maxRetries).toBe(3);
      expect(strategy.initialDelay).toBe(1000);
    });

    test("should create strategy with custom values", () => {
      const strategy = createRetryStrategy(5, 2000);
      expect(strategy.maxRetries).toBe(5);
      expect(strategy.initialDelay).toBe(2000);
    });

    test("should calculate exponential backoff delays", () => {
      const strategy = createRetryStrategy(3, 1000);

      expect(strategy.getDelay(0)).toBe(1000); // 1s
      expect(strategy.getDelay(1)).toBe(2000); // 2s
      expect(strategy.getDelay(2)).toBe(4000); // 4s
      expect(strategy.getDelay(3)).toBe(8000); // 8s
    });

    test("should handle custom initial delay in backoff", () => {
      const strategy = createRetryStrategy(3, 500);

      expect(strategy.getDelay(0)).toBe(500);
      expect(strategy.getDelay(1)).toBe(1000);
      expect(strategy.getDelay(2)).toBe(2000);
    });

    test("should work with zero attempt", () => {
      const strategy = createRetryStrategy(3, 1000);
      expect(strategy.getDelay(0)).toBe(1000);
    });

    test("should handle large attempt numbers", () => {
      const strategy = createRetryStrategy(10, 1000);
      expect(strategy.getDelay(10)).toBe(1024000); // 2^10 * 1000
    });
  });

  describe("Error message user-friendliness", () => {
    test("technical errors should have user-friendly messages", () => {
      const errors = [
        { status: "INVALID_CARD", expected: "invalid" },
        { status: "EXPIRED_CARD", expected: "expired" },
        { status: "DECLINE", expected: "declined" },
        { status: "GATEWAY_TIMEOUT", expected: "timed out" },
      ];

      errors.forEach(({ status, expected }) => {
        const error = {
          response: {
            status: 400,
            data: { status },
          },
        };
        const parsed = parseCyberSourceError(error);
        expect(parsed.userMessage.toLowerCase()).toContain(expected);
      });
    });

    test("should avoid technical jargon in user messages", () => {
      const error = {
        response: {
          status: 500,
          data: { message: "NullPointerException in payment processor" },
        },
      };
      const parsed = parseCyberSourceError(error);
      expect(parsed.userMessage).not.toContain("NullPointerException");
      expect(parsed.userMessage).toContain("server error");
    });
  });

  describe("logError", () => {
    let consoleErrorSpy: jest.SpiedFunction<typeof console.error>;

    beforeEach(() => {
      consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
    });

    afterEach(() => {
      consoleErrorSpy.mockRestore();
    });

    test("should log error with context", () => {
      const error = {
        response: {
          status: 400,
          data: {
            status: "INVALID_CARD",
            message: "Invalid card number",
          },
        },
      };

      const context = { operation: "createPayment", customerId: "123" };
      logError(error, context);

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      const loggedData = consoleErrorSpy.mock.calls[0][1];
      expect(loggedData).toMatchObject({
        code: "INVALID_CARD",
        retryable: false,
        context,
      });
      expect(loggedData).toHaveProperty("timestamp");
    });

    test("should log error without context", () => {
      const error = {
        response: {
          status: 500,
          data: { message: "Server error" },
        },
      };

      logError(error);

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      const loggedData = consoleErrorSpy.mock.calls[0][1];
      expect(loggedData).toHaveProperty("code");
      expect(loggedData).toHaveProperty("timestamp");
      expect(loggedData.context).toBeUndefined();
    });

    test("should include all parsed error fields", () => {
      const error = {
        response: {
          status: 400,
          data: {
            status: "DECLINED",
            message: "Payment declined",
            details: [{ field: "amount", reason: "Too high" }],
          },
        },
      };

      logError(error);

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      const loggedData = consoleErrorSpy.mock.calls[0][1];
      expect(loggedData).toHaveProperty("code");
      expect(loggedData).toHaveProperty("message");
      expect(loggedData).toHaveProperty("userMessage");
      expect(loggedData).toHaveProperty("retryable");
    });
  });
});
