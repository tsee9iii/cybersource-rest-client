/**
 * Validation utilities for CyberSource data
 *
 * These utilities help validate common payment data before sending to the API,
 * reducing errors and improving user experience.
 */

/**
 * Validates a credit card number using the Luhn algorithm
 *
 * @param cardNumber - The card number to validate (with or without spaces/dashes)
 * @returns True if the card number is valid according to Luhn algorithm
 *
 * @example
 * ```typescript
 * validateCardNumber("4111111111111111") // true
 * validateCardNumber("4111 1111 1111 1111") // true
 * validateCardNumber("1234567890123456") // false
 * ```
 */
export function validateCardNumber(cardNumber: string): boolean {
  // Remove spaces and dashes
  const cleaned = cardNumber.replace(/[\s-]/g, "");

  // Check if only digits
  if (!/^\d+$/.test(cleaned)) {
    return false;
  }

  // Check length (most cards are 13-19 digits)
  if (cleaned.length < 13 || cleaned.length > 19) {
    return false;
  }

  // Luhn algorithm
  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

/**
 * Identifies the card type/network from the card number
 *
 * @param cardNumber - The card number (with or without spaces/dashes)
 * @returns The card network type or 'unknown'
 *
 * @example
 * ```typescript
 * identifyCardType("4111111111111111") // "visa"
 * identifyCardType("5555555555554444") // "mastercard"
 * identifyCardType("378282246310005") // "americanexpress"
 * ```
 */
export function identifyCardType(
  cardNumber: string
):
  | "visa"
  | "mastercard"
  | "americanexpress"
  | "discover"
  | "dinersclub"
  | "jcb"
  | "unknown" {
  const cleaned = cardNumber.replace(/[\s-]/g, "");

  // Visa: starts with 4
  if (/^4/.test(cleaned)) {
    return "visa";
  }

  // Mastercard: 51-55, 2221-2720
  if (
    /^5[1-5]/.test(cleaned) ||
    /^2(2[2-9][0-9]|[3-6][0-9]{2}|7[0-1][0-9]|720)/.test(cleaned)
  ) {
    return "mastercard";
  }

  // American Express: 34 or 37
  if (/^3[47]/.test(cleaned)) {
    return "americanexpress";
  }

  // Discover: 6011, 622126-622925, 644-649, 65
  if (
    /^6011|^64[4-9]|^65|^622(1(2[6-9]|[3-9][0-9])|[2-8][0-9]{2}|9([0-1][0-9]|2[0-5]))/.test(
      cleaned
    )
  ) {
    return "discover";
  }

  // Diners Club: 300-305, 36, 38
  if (/^3(0[0-5]|[68])/.test(cleaned)) {
    return "dinersclub";
  }

  // JCB: 3528-3589
  if (/^35(2[89]|[3-8][0-9])/.test(cleaned)) {
    return "jcb";
  }

  return "unknown";
}

/**
 * Validates expiration date (month and year)
 *
 * @param expirationMonth - Two-digit month string (01-12)
 * @param expirationYear - Four-digit year string (YYYY) or two-digit (YY)
 * @returns True if the card has not expired
 *
 * @example
 * ```typescript
 * validateExpirationDate("12", "2025") // true/false depending on current date
 * validateExpirationDate("01", "2020") // false (expired)
 * ```
 */
export function validateExpirationDate(
  expirationMonth: string,
  expirationYear: string
): boolean {
  const month = parseInt(expirationMonth, 10);
  let year = parseInt(expirationYear, 10);

  // Validate month
  if (month < 1 || month > 12) {
    return false;
  }

  // Convert 2-digit year to 4-digit
  if (year < 100) {
    year += 2000;
  }

  // Check if expired
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // getMonth() is 0-based

  if (year < currentYear) {
    return false;
  }

  if (year === currentYear && month < currentMonth) {
    return false;
  }

  return true;
}

/**
 * Validates CVV/CVC security code based on card type
 *
 * @param cvv - The security code
 * @param cardType - Optional card type (if known)
 * @returns True if the CVV is valid format
 *
 * @example
 * ```typescript
 * validateCVV("123") // true
 * validateCVV("1234", "americanexpress") // true
 * validateCVV("12", "visa") // false
 * ```
 */
export function validateCVV(
  cvv: string,
  cardType?:
    | "visa"
    | "mastercard"
    | "americanexpress"
    | "discover"
    | "dinersclub"
    | "jcb"
): boolean {
  // Remove any non-digits
  const cleaned = cvv.replace(/\D/g, "");

  // American Express uses 4 digits, others use 3
  if (cardType === "americanexpress") {
    return cleaned.length === 4;
  }

  return cleaned.length === 3;
}

/**
 * Formats a card number with spaces for display purposes
 *
 * @param cardNumber - The card number to format
 * @returns Formatted card number with spaces
 *
 * @example
 * ```typescript
 * formatCardNumber("4111111111111111") // "4111 1111 1111 1111"
 * formatCardNumber("378282246310005") // "3782 822463 10005"
 * ```
 */
export function formatCardNumber(cardNumber: string): string {
  const cleaned = cardNumber.replace(/[\s-]/g, "");
  const cardType = identifyCardType(cleaned);

  // American Express: 4-6-5 format
  if (cardType === "americanexpress") {
    return cleaned.replace(/(\d{4})(\d{6})(\d{5})/, "$1 $2 $3");
  }

  // Diners Club: 4-6-4 format
  if (cardType === "dinersclub") {
    return cleaned.replace(/(\d{4})(\d{6})(\d{4})/, "$1 $2 $3");
  }

  // Default: 4-4-4-4 format
  return cleaned.replace(/(\d{4})/g, "$1 ").trim();
}

/**
 * Masks a card number showing only last 4 digits
 *
 * @param cardNumber - The card number to mask
 * @param visibleDigits - Number of digits to show at end (default: 4)
 * @returns Masked card number
 *
 * @example
 * ```typescript
 * maskCardNumber("4111111111111111") // "************1111"
 * maskCardNumber("4111111111111111", 6) // "**********111111"
 * ```
 */
export function maskCardNumber(
  cardNumber: string,
  visibleDigits: number = 4
): string {
  const cleaned = cardNumber.replace(/[\s-]/g, "");
  const maskedLength = Math.max(0, cleaned.length - visibleDigits);
  const masked = "*".repeat(maskedLength) + cleaned.slice(-visibleDigits);
  return masked;
}

/**
 * Validates a routing number (for bank accounts)
 *
 * @param routingNumber - The 9-digit routing number
 * @returns True if valid routing number format
 *
 * @example
 * ```typescript
 * validateRoutingNumber("021000021") // true
 * validateRoutingNumber("123456789") // false (invalid checksum)
 * ```
 */
export function validateRoutingNumber(routingNumber: string): boolean {
  const cleaned = routingNumber.replace(/\D/g, "");

  // Must be 9 digits
  if (cleaned.length !== 9) {
    return false;
  }

  // Checksum algorithm
  const digits = cleaned.split("").map(Number);
  const checksum =
    (3 * (digits[0] + digits[3] + digits[6]) +
      7 * (digits[1] + digits[4] + digits[7]) +
      (digits[2] + digits[5] + digits[8])) %
    10;

  return checksum === 0;
}

/**
 * Validates an email address format
 *
 * @param email - The email address to validate
 * @returns True if valid email format
 *
 * @example
 * ```typescript
 * validateEmail("user@example.com") // true
 * validateEmail("invalid.email") // false
 * ```
 */
export function validateEmail(email: string): boolean {
  // Simple validation to avoid ReDoS vulnerability
  // More permissive but safe against catastrophic backtracking
  if (!email || email.length > 254) {
    return false;
  }

  const atIndex = email.indexOf("@");
  if (atIndex === -1 || atIndex === 0 || atIndex === email.length - 1) {
    return false;
  }

  const localPart = email.substring(0, atIndex);
  const domainPart = email.substring(atIndex + 1);

  // Check for spaces or multiple @ signs
  if (email.indexOf(" ") !== -1 || email.indexOf("@", atIndex + 1) !== -1) {
    return false;
  }

  // Domain must have at least one dot and valid characters
  if (domainPart.indexOf(".") === -1 || domainPart.length < 3) {
    return false;
  }

  // Basic character validation - safe regex with bounded quantifiers
  const safeLocalRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]{1,64}$/;
  const safeDomainRegex =
    /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  return safeLocalRegex.test(localPart) && safeDomainRegex.test(domainPart);
}
/**
 * Validates a US ZIP code (5 digits or 5+4 format)
 *
 * @param zipCode - The ZIP code to validate
 * @returns True if valid ZIP code format
 *
 * @example
 * ```typescript
 * validateZipCode("94102") // true
 * validateZipCode("94102-1234") // true
 * validateZipCode("9410") // false
 * ```
 */
export function validateZipCode(zipCode: string): boolean {
  const zipRegex = /^\d{5}(-\d{4})?$/;
  return zipRegex.test(zipCode);
}

/**
 * Validates a phone number (basic format check)
 *
 * @param phoneNumber - The phone number to validate
 * @returns True if appears to be a valid phone format
 *
 * @example
 * ```typescript
 * validatePhoneNumber("+1-555-123-4567") // true
 * validatePhoneNumber("5551234567") // true
 * validatePhoneNumber("123") // false
 * ```
 */
export function validatePhoneNumber(phoneNumber: string): boolean {
  const cleaned = phoneNumber.replace(/[\s\-\(\)\+]/g, "");
  // Allow 10-15 digits (accommodates international)
  return /^\d{10,15}$/.test(cleaned);
}
