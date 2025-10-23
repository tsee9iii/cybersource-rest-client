/**
 * Security utilities for handling sensitive data
 * Helps prevent accidental exposure of credentials in logs, errors, etc.
 */

/**
 * Masks a sensitive string, showing only first and last few characters
 *
 * @param value - The sensitive value to mask
 * @param visibleStart - Number of characters to show at start (default: 4)
 * @param visibleEnd - Number of characters to show at end (default: 4)
 * @returns Masked string
 *
 * @example
 * ```typescript
 * maskSensitive("sk_live_1234567890abcdef") // "sk_l************cdef"
 * maskSensitive("secret123", 2, 2) // "se*****23"
 * ```
 */
export function maskSensitive(
  value: string | undefined | null,
  visibleStart: number = 4,
  visibleEnd: number = 4
): string {
  if (!value) {
    return "[NOT SET]";
  }

  if (value.length <= visibleStart + visibleEnd) {
    return "*".repeat(value.length);
  }

  const start = value.substring(0, visibleStart);
  const end = value.substring(value.length - visibleEnd);
  const maskedLength = value.length - visibleStart - visibleEnd;

  return `${start}${"*".repeat(maskedLength)}${end}`;
}

/**
 * Masks an API key for safe logging
 *
 * @param apiKey - The API key to mask
 * @returns Masked API key
 *
 * @example
 * ```typescript
 * maskApiKey("a1b2c3d4-e5f6-g7h8-i9j0") // "a1b2************i9j0"
 * ```
 */
export function maskApiKey(apiKey: string | undefined | null): string {
  return maskSensitive(apiKey, 4, 4);
}

/**
 * Masks a merchant ID for safe logging
 * Shows first 8 characters only
 *
 * @param merchantId - The merchant ID to mask
 * @returns Masked merchant ID
 *
 * @example
 * ```typescript
 * maskMerchantId("merchant_12345678_test") // "merchant********"
 * ```
 */
export function maskMerchantId(merchantId: string | undefined | null): string {
  if (!merchantId) {
    return "[NOT SET]";
  }
  if (merchantId.length <= 8) {
    return "*".repeat(merchantId.length);
  }
  return merchantId.substring(0, 8) + "*".repeat(merchantId.length - 8);
}

/**
 * Returns only the length of a secret without exposing content
 *
 * @param secret - The secret value
 * @returns Object with length information
 *
 * @example
 * ```typescript
 * getSecretInfo("my-secret-key-here") // { length: 18, set: true }
 * getSecretInfo(undefined) // { length: 0, set: false }
 * ```
 */
export function getSecretInfo(secret: string | undefined | null): {
  length: number;
  set: boolean;
} {
  return {
    length: secret?.length || 0,
    set: Boolean(secret && secret.length > 0),
  };
}

/**
 * Sanitizes an object for logging by masking sensitive fields
 *
 * @param obj - Object to sanitize
 * @param sensitiveKeys - Array of key names to mask (default: common sensitive fields)
 * @returns Sanitized object safe for logging
 *
 * @example
 * ```typescript
 * sanitizeForLogging({
 *   merchantId: 'merchant_123',
 *   apiKey: 'secret123',
 *   amount: 100
 * })
 * // { merchantId: 'merchant********', apiKey: 'secr****23', amount: 100 }
 * ```
 */
export function sanitizeForLogging(
  obj: Record<string, any>,
  sensitiveKeys: string[] = [
    "apiKey",
    "apikey",
    "api_key",
    "secret",
    "sharedSecret",
    "shared_secret",
    "sharedSecretKey",
    "password",
    "token",
    "authorization",
    "cardNumber",
    "card_number",
    "cvv",
    "securityCode",
    "security_code",
  ]
): Record<string, any> {
  const sanitized: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    const lowerKey = key.toLowerCase();
    const isSensitive = sensitiveKeys.some((sk) =>
      lowerKey.includes(sk.toLowerCase())
    );

    if (isSensitive && typeof value === "string") {
      sanitized[key] = maskSensitive(value);
    } else if (
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value)
    ) {
      sanitized[key] = sanitizeForLogging(value, sensitiveKeys);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Safe logger that automatically masks sensitive data
 * Use this instead of console.log for production code
 *
 * @param message - Message to log
 * @param data - Optional data object to log (will be sanitized)
 *
 * @example
 * ```typescript
 * safeLog('Processing payment', {
 *   merchantId: 'merchant_123',
 *   apiKey: 'secret123',
 *   amount: 100
 * })
 * // Logs: Processing payment { merchantId: 'merchant********', apiKey: 'secr****23', amount: 100 }
 * ```
 */
export function safeLog(message: string, data?: Record<string, any>): void {
  if (data) {
    console.log(message, sanitizeForLogging(data));
  } else {
    console.log(message);
  }
}
