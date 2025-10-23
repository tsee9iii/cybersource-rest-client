import { describe, expect, it, jest } from "@jest/globals";
import {
  maskSensitive,
  maskApiKey,
  maskMerchantId,
  getSecretInfo,
  sanitizeForLogging,
  safeLog,
} from "../utils/security.util";

describe("Security Utilities", () => {
  describe("maskSensitive", () => {
    it("should mask middle portion of string with default settings", () => {
      const result = maskSensitive("sk_live_1234567890abcdef");
      expect(result).toBe("sk_l****************cdef");
    });

    it("should mask with custom visible characters", () => {
      const result = maskSensitive("secret123", 2, 2);
      expect(result).toBe("se*****23");
    });

    it("should handle empty or null values", () => {
      expect(maskSensitive(undefined)).toBe("[NOT SET]");
      expect(maskSensitive(null)).toBe("[NOT SET]");
      expect(maskSensitive("")).toBe("[NOT SET]");
    });

    it("should mask entire string if too short", () => {
      const result = maskSensitive("short", 4, 4);
      expect(result).toBe("*****");
    });

    it("should handle string exactly at threshold length", () => {
      const result = maskSensitive("12345678", 4, 4);
      expect(result).toBe("********");
    });

    it("should handle single character visible settings", () => {
      const result = maskSensitive("abcdefghij", 1, 1);
      expect(result).toBe("a********j");
    });

    it("should handle zero visible characters", () => {
      const result = maskSensitive("sensitive", 0, 0);
      expect(result).toBe("*********");
    });
  });

  describe("maskApiKey", () => {
    it("should mask API key showing first and last 4 characters", () => {
      const result = maskApiKey("a1b2c3d4-e5f6-g7h8-i9j0");
      expect(result).toBe("a1b2***************i9j0");
    });

    it("should handle undefined API key", () => {
      expect(maskApiKey(undefined)).toBe("[NOT SET]");
    });

    it("should handle null API key", () => {
      expect(maskApiKey(null)).toBe("[NOT SET]");
    });

    it("should mask short API keys completely", () => {
      const result = maskApiKey("short");
      expect(result).toBe("*****");
    });

    it("should handle typical UUID-format keys", () => {
      const result = maskApiKey("550e8400-e29b-41d4-a716-446655440000");
      expect(result).toBe("550e****************************0000");
    });
  });

  describe("maskMerchantId", () => {
    it("should show first 8 characters only", () => {
      const result = maskMerchantId("merchant_12345678_test");
      expect(result).toBe("merchant**************");
    });

    it("should handle undefined merchant ID", () => {
      expect(maskMerchantId(undefined)).toBe("[NOT SET]");
    });

    it("should handle null merchant ID", () => {
      expect(maskMerchantId(null)).toBe("[NOT SET]");
    });

    it("should mask short merchant IDs completely", () => {
      const result = maskMerchantId("short");
      expect(result).toBe("*****");
    });

    it("should handle merchant ID exactly 8 characters", () => {
      const result = maskMerchantId("12345678");
      expect(result).toBe("********");
    });

    it("should handle merchant ID with 9 characters", () => {
      const result = maskMerchantId("123456789");
      expect(result).toBe("12345678*");
    });
  });

  describe("getSecretInfo", () => {
    it("should return length and set status for valid secret", () => {
      const result = getSecretInfo("my-secret-key-here");
      expect(result).toEqual({ length: 18, set: true });
    });

    it("should handle undefined secret", () => {
      const result = getSecretInfo(undefined);
      expect(result).toEqual({ length: 0, set: false });
    });

    it("should handle null secret", () => {
      const result = getSecretInfo(null);
      expect(result).toEqual({ length: 0, set: false });
    });

    it("should handle empty string as not set", () => {
      const result = getSecretInfo("");
      expect(result).toEqual({ length: 0, set: false });
    });

    it("should handle very long secrets", () => {
      const longSecret = "a".repeat(1000);
      const result = getSecretInfo(longSecret);
      expect(result).toEqual({ length: 1000, set: true });
    });

    it("should handle single character secret", () => {
      const result = getSecretInfo("x");
      expect(result).toEqual({ length: 1, set: true });
    });
  });

  describe("sanitizeForLogging", () => {
    it("should mask default sensitive fields", () => {
      const input = {
        merchantId: "merchant_123",
        apiKey: "secret123",
        amount: 100,
      };

      const result = sanitizeForLogging(input);

      expect(result.merchantId).toBe("merchant_123"); // merchantId doesn't match default sensitive keys
      expect(result.apiKey).toBe("secr*t123");
      expect(result.amount).toBe(100);
    });

    it("should handle nested objects", () => {
      const input = {
        user: {
          name: "John",
          password: "supersecret",
        },
        amount: 50,
      };

      const result = sanitizeForLogging(input);

      expect(result.user.name).toBe("John");
      expect(result.user.password).toBe("supe***cret");
      expect(result.amount).toBe(50);
    });

    it("should handle custom sensitive keys", () => {
      const input = {
        customSecret: "hideme",
        publicData: "showme",
      };

      const result = sanitizeForLogging(input, ["customSecret"]);

      expect(result.customSecret).toBe("******");
      expect(result.publicData).toBe("showme");
    });

    it("should handle arrays", () => {
      const input = {
        items: [1, 2, 3],
        apiKey: "secret",
      };

      const result = sanitizeForLogging(input);

      expect(result.items).toEqual([1, 2, 3]);
      expect(result.apiKey).toBe("******");
    });

    it("should handle null values", () => {
      const input = {
        apiKey: null,
        data: "value",
      };

      const result = sanitizeForLogging(input);

      expect(result.apiKey).toBe(null);
      expect(result.data).toBe("value");
    });

    it("should handle case-insensitive key matching", () => {
      const input = {
        APIKEY: "secret123",
        ApiKey: "secret456",
        apikey: "secret789",
      };

      const result = sanitizeForLogging(input);

      expect(result.APIKEY).toBe("secr*t123");
      expect(result.ApiKey).toBe("secr*t456");
      expect(result.apikey).toBe("secr*t789");
    });

    it("should handle partial key name matches", () => {
      const input = {
        myApiKey: "secret123",
        userToken: "token456", // "token" matches default sensitive key
        cardNumber: "4111111111111111",
      };

      const result = sanitizeForLogging(input);

      expect(result.myApiKey).toBe("secr*t123");
      expect(result.userToken).toBe("********"); // "token" is in default sensitive keys
      expect(result.cardNumber).toBe("4111********1111");
    });

    it("should handle non-string sensitive values", () => {
      const input = {
        apiKey: 12345,
        amount: 100,
      };

      const result = sanitizeForLogging(input);

      expect(result.apiKey).toBe(12345); // Non-string values pass through
      expect(result.amount).toBe(100);
    });

    it("should handle deeply nested objects", () => {
      const input = {
        level1: {
          level2: {
            level3: {
              secret: "deepSecret",
              value: "normalValue",
            },
          },
        },
      };

      const result = sanitizeForLogging(input);

      expect(result.level1.level2.level3.secret).toBe("deep**cret");
      expect(result.level1.level2.level3.value).toBe("normalValue");
    });

    it("should handle all default sensitive field names", () => {
      const input = {
        apiKey: "secret1",
        apikey: "secret2",
        api_key: "secret3",
        secret: "secret4",
        sharedSecret: "secret5",
        shared_secret: "secret6",
        sharedSecretKey: "secret7",
        password: "secret8",
        token: "secret9",
        authorization: "secret10",
        cardNumber: "4111111111111111",
        card_number: "5555555555554444",
        cvv: "123",
        securityCode: "456",
        security_code: "789",
      };

      const result = sanitizeForLogging(input);

      // All should be masked
      Object.values(result).forEach((value) => {
        expect(typeof value).toBe("string");
        expect(value).toMatch(/\*/);
      });
    });
  });

  describe("safeLog", () => {
    let consoleLogSpy: jest.SpiedFunction<typeof console.log>;

    beforeEach(() => {
      consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    });

    afterEach(() => {
      consoleLogSpy.mockRestore();
    });

    it("should log message without data", () => {
      safeLog("Simple message");

      expect(consoleLogSpy).toHaveBeenCalledWith("Simple message");
      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    });

    it("should log message with sanitized data", () => {
      const data = {
        merchantId: "merchant_123",
        apiKey: "secret123",
        amount: 100,
      };

      safeLog("Processing payment", data);

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledWith(
        "Processing payment",
        expect.objectContaining({
          amount: 100,
        })
      );

      // Check that sensitive data was masked
      const loggedData = consoleLogSpy.mock.calls[0][1] as Record<string, any>;
      expect(loggedData.merchantId).not.toContain("*"); // merchantId not in default sensitive keys
      expect(loggedData.apiKey).toContain("*");
    });

    it("should handle complex nested data", () => {
      const data = {
        user: {
          name: "John",
          password: "supersecret",
        },
        payment: {
          amount: 100,
          cardNumber: "4111111111111111",
        },
      };

      safeLog("Complex operation", data);

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);

      const loggedData = consoleLogSpy.mock.calls[0][1] as Record<string, any>;
      expect(loggedData.user.name).toBe("John");
      expect(loggedData.user.password).toContain("*");
      expect(loggedData.payment.amount).toBe(100);
      expect(loggedData.payment.cardNumber).toContain("*");
    });

    it("should handle undefined data gracefully", () => {
      safeLog("Message with no data", undefined);

      expect(consoleLogSpy).toHaveBeenCalledWith("Message with no data");
      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    });
  });
});
