import { describe, expect, test } from "@jest/globals";
import {
  validateCardNumber,
  identifyCardType,
  validateExpirationDate,
  validateCVV,
  formatCardNumber,
  maskCardNumber,
  validateRoutingNumber,
  validateEmail,
  validateZipCode,
  validatePhoneNumber,
} from "../utils/validation.util";

describe("Validation Utilities", () => {
  describe("validateCardNumber", () => {
    test("should validate valid Visa card numbers", () => {
      expect(validateCardNumber("4111111111111111")).toBe(true);
      expect(validateCardNumber("4012888888881881")).toBe(true);
    });

    test("should validate valid Mastercard numbers", () => {
      expect(validateCardNumber("5555555555554444")).toBe(true);
      expect(validateCardNumber("2221000000000009")).toBe(true);
    });

    test("should validate valid American Express numbers", () => {
      expect(validateCardNumber("378282246310005")).toBe(true);
      expect(validateCardNumber("371449635398431")).toBe(true);
    });

    test("should accept card numbers with spaces", () => {
      expect(validateCardNumber("4111 1111 1111 1111")).toBe(true);
      expect(validateCardNumber("5555-5555-5555-4444")).toBe(true);
    });

    test("should reject invalid card numbers", () => {
      expect(validateCardNumber("4111111111111112")).toBe(false); // Wrong check digit
      expect(validateCardNumber("1234567890123456")).toBe(false); // Fails Luhn
      expect(validateCardNumber("411111111111111")).toBe(false); // Too short
      expect(validateCardNumber("41111111111111111111")).toBe(false); // Too long
    });

    test("should reject non-numeric input", () => {
      expect(validateCardNumber("abcd1234efgh5678")).toBe(false);
      expect(validateCardNumber("4111-ABCD-1111-1111")).toBe(false);
    });

    test("should reject empty or invalid input", () => {
      expect(validateCardNumber("")).toBe(false);
      expect(validateCardNumber("   ")).toBe(false);
    });
  });

  describe("identifyCardType", () => {
    test("should identify Visa cards", () => {
      expect(identifyCardType("4111111111111111")).toBe("visa");
      expect(identifyCardType("4012888888881881")).toBe("visa");
    });

    test("should identify Mastercard", () => {
      expect(identifyCardType("5555555555554444")).toBe("mastercard");
      expect(identifyCardType("5105105105105100")).toBe("mastercard");
      expect(identifyCardType("2221000000000009")).toBe("mastercard"); // New range
    });

    test("should identify American Express", () => {
      expect(identifyCardType("378282246310005")).toBe("americanexpress");
      expect(identifyCardType("371449635398431")).toBe("americanexpress");
    });

    test("should identify Discover", () => {
      expect(identifyCardType("6011111111111117")).toBe("discover");
      expect(identifyCardType("6011000990139424")).toBe("discover");
    });

    test("should identify Diners Club", () => {
      expect(identifyCardType("30569309025904")).toBe("dinersclub");
      expect(identifyCardType("38520000023237")).toBe("dinersclub");
    });

    test("should identify JCB", () => {
      expect(identifyCardType("3530111333300000")).toBe("jcb");
      expect(identifyCardType("3566002020360505")).toBe("jcb");
    });

    test("should return unknown for unrecognized patterns", () => {
      expect(identifyCardType("9999999999999999")).toBe("unknown");
      expect(identifyCardType("1234567890123456")).toBe("unknown");
    });

    test("should handle cards with spaces and dashes", () => {
      expect(identifyCardType("4111 1111 1111 1111")).toBe("visa");
      expect(identifyCardType("5555-5555-5555-4444")).toBe("mastercard");
    });
  });

  describe("validateExpirationDate", () => {
    test("should accept valid future dates", () => {
      expect(validateExpirationDate("12", "2030")).toBe(true);
      expect(validateExpirationDate("06", "2026")).toBe(true);
    });

    test("should accept 2-digit year format", () => {
      expect(validateExpirationDate("12", "30")).toBe(true);
      expect(validateExpirationDate("06", "26")).toBe(true);
    });

    test("should accept current month/year", () => {
      const now = new Date();
      const currentMonth = String(now.getMonth() + 1).padStart(2, "0");
      const currentYear = String(now.getFullYear());
      expect(validateExpirationDate(currentMonth, currentYear)).toBe(true);
    });

    test("should reject past dates", () => {
      expect(validateExpirationDate("01", "2020")).toBe(false);
      expect(validateExpirationDate("12", "2021")).toBe(false);
    });

    test("should reject invalid months", () => {
      expect(validateExpirationDate("00", "2030")).toBe(false);
      expect(validateExpirationDate("13", "2030")).toBe(false);
      expect(validateExpirationDate("99", "2030")).toBe(false);
    });

    test("should reject invalid month in current year", () => {
      const now = new Date();
      const currentYear = String(now.getFullYear());
      expect(validateExpirationDate("01", currentYear)).toBe(false); // January has passed
    });
  });

  describe("validateCVV", () => {
    test("should accept 3-digit CVV for most cards", () => {
      expect(validateCVV("123")).toBe(true);
      expect(validateCVV("000")).toBe(true);
      expect(validateCVV("999")).toBe(true);
    });

    test("should accept 4-digit CVV for American Express", () => {
      expect(validateCVV("1234", "americanexpress")).toBe(true);
      expect(validateCVV("0000", "americanexpress")).toBe(true);
    });

    test("should reject 3-digit CVV for American Express", () => {
      expect(validateCVV("123", "americanexpress")).toBe(false);
    });

    test("should reject 4-digit CVV for Visa/Mastercard", () => {
      expect(validateCVV("1234", "visa")).toBe(false);
      expect(validateCVV("1234", "mastercard")).toBe(false);
    });

    test("should reject invalid CVV lengths", () => {
      expect(validateCVV("12")).toBe(false);
      expect(validateCVV("12345")).toBe(false);
      expect(validateCVV("")).toBe(false);
    });

    test("should handle CVV with non-digits", () => {
      expect(validateCVV("12a")).toBe(false);
      expect(validateCVV("1 2 3")).toBe(true); // Strips spaces
    });
  });

  describe("formatCardNumber", () => {
    test("should format Visa cards in 4-4-4-4 pattern", () => {
      expect(formatCardNumber("4111111111111111")).toBe("4111 1111 1111 1111");
    });

    test("should format Mastercard in 4-4-4-4 pattern", () => {
      expect(formatCardNumber("5555555555554444")).toBe("5555 5555 5555 4444");
    });

    test("should format American Express in 4-6-5 pattern", () => {
      expect(formatCardNumber("378282246310005")).toBe("3782 822463 10005");
    });

    test("should format Diners Club in 4-6-4 pattern", () => {
      expect(formatCardNumber("30569309025904")).toBe("3056 930902 5904");
    });

    test("should handle already formatted numbers", () => {
      expect(formatCardNumber("4111 1111 1111 1111")).toBe(
        "4111 1111 1111 1111"
      );
    });

    test("should handle numbers with dashes", () => {
      expect(formatCardNumber("4111-1111-1111-1111")).toBe(
        "4111 1111 1111 1111"
      );
    });
  });

  describe("maskCardNumber", () => {
    test("should mask card showing last 4 digits by default", () => {
      expect(maskCardNumber("4111111111111111")).toBe("************1111");
    });

    test("should mask card showing last N digits", () => {
      expect(maskCardNumber("4111111111111111", 6)).toBe("**********111111");
      expect(maskCardNumber("4111111111111111", 2)).toBe("**************11");
    });

    test("should handle cards with spaces/dashes", () => {
      expect(maskCardNumber("4111 1111 1111 1111")).toBe("************1111");
      expect(maskCardNumber("4111-1111-1111-1111")).toBe("************1111");
    });

    test("should handle short numbers", () => {
      expect(maskCardNumber("1234", 4)).toBe("1234");
      expect(maskCardNumber("12345678", 4)).toBe("****5678");
    });
  });

  describe("validateRoutingNumber", () => {
    test("should validate valid routing numbers", () => {
      expect(validateRoutingNumber("021000021")).toBe(true); // JPMorgan Chase
      expect(validateRoutingNumber("011401533")).toBe(true); // Bank of America
      expect(validateRoutingNumber("111000025")).toBe(true); // Wells Fargo
    });

    test("should reject invalid routing numbers", () => {
      expect(validateRoutingNumber("123456789")).toBe(false); // Invalid checksum
      expect(validateRoutingNumber("111111111")).toBe(false); // Invalid checksum
      expect(validateRoutingNumber("999999999")).toBe(false);
    });

    test("should reject wrong length", () => {
      expect(validateRoutingNumber("12345678")).toBe(false); // Too short
      expect(validateRoutingNumber("1234567890")).toBe(false); // Too long
      expect(validateRoutingNumber("")).toBe(false);
    });

    test("should handle routing numbers with non-digits", () => {
      expect(validateRoutingNumber("021-000-021")).toBe(true); // Strips dashes
      expect(validateRoutingNumber("021 000 021")).toBe(true); // Strips spaces
    });
  });

  describe("validateEmail", () => {
    test("should validate valid email addresses", () => {
      expect(validateEmail("user@example.com")).toBe(true);
      expect(validateEmail("test.user@example.co.uk")).toBe(true);
      expect(validateEmail("name+tag@domain.com")).toBe(true);
    });

    test("should reject invalid emails", () => {
      expect(validateEmail("notanemail")).toBe(false);
      expect(validateEmail("@example.com")).toBe(false);
      expect(validateEmail("user@")).toBe(false);
      expect(validateEmail("user@.com")).toBe(false);
      expect(validateEmail("")).toBe(false);
    });

    test("should reject emails with spaces", () => {
      expect(validateEmail("user name@example.com")).toBe(false);
      expect(validateEmail("user@exam ple.com")).toBe(false);
    });
  });

  describe("validateZipCode", () => {
    test("should validate 5-digit ZIP codes", () => {
      expect(validateZipCode("94102")).toBe(true);
      expect(validateZipCode("12345")).toBe(true);
      expect(validateZipCode("00000")).toBe(true);
    });

    test("should validate ZIP+4 format", () => {
      expect(validateZipCode("94102-1234")).toBe(true);
      expect(validateZipCode("12345-6789")).toBe(true);
    });

    test("should reject invalid ZIP codes", () => {
      expect(validateZipCode("9410")).toBe(false); // Too short
      expect(validateZipCode("941022")).toBe(false); // Too long
      expect(validateZipCode("94102-123")).toBe(false); // Invalid ZIP+4
      expect(validateZipCode("")).toBe(false);
    });

    test("should reject non-numeric ZIP codes", () => {
      expect(validateZipCode("abcde")).toBe(false);
      expect(validateZipCode("9410a")).toBe(false);
    });
  });

  describe("validatePhoneNumber", () => {
    test("should validate 10-digit US phone numbers", () => {
      expect(validatePhoneNumber("5551234567")).toBe(true);
      expect(validatePhoneNumber("4158880000")).toBe(true);
    });

    test("should validate formatted phone numbers", () => {
      expect(validatePhoneNumber("+1-555-123-4567")).toBe(true);
      expect(validatePhoneNumber("(555) 123-4567")).toBe(true);
      expect(validatePhoneNumber("+1 (555) 123-4567")).toBe(true);
    });

    test("should validate international numbers", () => {
      expect(validatePhoneNumber("+44 20 7946 0958")).toBe(true); // UK
      expect(validatePhoneNumber("+81 3 1234 5678")).toBe(true); // Japan
    });

    test("should reject invalid phone numbers", () => {
      expect(validatePhoneNumber("123")).toBe(false); // Too short
      expect(validatePhoneNumber("12345678901234567890")).toBe(false); // Too long
      expect(validatePhoneNumber("")).toBe(false);
    });

    test("should reject phone numbers with letters", () => {
      expect(validatePhoneNumber("555-CALL-NOW")).toBe(false);
    });
  });
});
