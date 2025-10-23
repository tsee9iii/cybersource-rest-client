/**
 * Tokenized Card DTOs for CyberSource TMS API v2
 *
 * Tokenized Cards represent network tokens which perform better than regular card numbers.
 * Network tokens are not necessarily invalidated when a cardholder loses their card or it expires.
 * They provide enhanced security and better authorization rates compared to traditional PANs.
 *
 * These DTOs cover:
 * - Create a Tokenized Card (Network Token)
 * - Retrieve a Tokenized Card
 * - Delete a Tokenized Card
 *
 * Network tokens can be created from:
 * - Card information (ONFILE)
 * - Existing network tokens (TOKEN)
 * - Issuer account reference IDs (ISSUER)
 */

/**
 * Base links structure for Tokenized Cards
 */
export interface TokenizedCardLinksDto {
  readonly self?: {
    readonly href?: string;
  };
}

/**
 * Card art asset information for enhanced UI presentation
 */
export interface TokenizedCardAssetDto {
  readonly id?: string;
  readonly _links?: {
    readonly self?: {
      readonly href?: string;
    };
  };
}

/**
 * Card art metadata for visual representation
 */
export interface TokenizedCardArtDto {
  /**
   * Card foreground color for UI theming
   */
  readonly foregroundColor?: string;

  /**
   * Combined card art asset (full card image)
   */
  readonly combinedAsset?: TokenizedCardAssetDto;

  /**
   * Brand logo asset (e.g., Visa, Mastercard logo)
   */
  readonly brandLogoAsset?: TokenizedCardAssetDto;

  /**
   * Issuer logo asset (bank/financial institution logo)
   */
  readonly issuerLogoAsset?: TokenizedCardAssetDto;

  /**
   * Icon asset for compact displays
   */
  readonly iconAsset?: TokenizedCardAssetDto;
}

/**
 * Issuer information associated with the tokenized card
 */
export interface TokenizedCardIssuerDto {
  /**
   * Issuer name (e.g., "Chase Bank")
   */
  readonly name?: string;

  /**
   * Short description of the issuer
   */
  readonly shortDescription?: string;

  /**
   * Detailed description of the issuer
   */
  readonly longDescription?: string;
}

/**
 * Comprehensive metadata for tokenized cards including visual assets
 */
export interface TokenizedCardMetadataDto {
  /**
   * Card art information for UI presentation
   */
  readonly cardArt?: TokenizedCardArtDto;

  /**
   * Issuer information
   */
  readonly issuer?: TokenizedCardIssuerDto;
}

/**
 * Card information for tokenized card creation
 */
export interface TokenizedCardInfoDto {
  /**
   * The customer's payment card number (PAN)
   * Required for ONFILE source
   */
  number?: string;

  /**
   * Two-digit expiration month (01-12)
   * Format: MM
   */
  expirationMonth?: string;

  /**
   * Four-digit expiration year
   * Format: YYYY
   */
  expirationYear?: string;

  /**
   * The type of card (Card Network)
   * Possible values: 001 (visa), etc.
   */
  type?: string;

  /**
   * The customer's latest payment card number suffix (read-only)
   */
  readonly suffix?: string;
}

/**
 * Passcode for issuer ID&V (Identity and Verification)
 */
export interface TokenizedCardPasscodeDto {
  /**
   * OTP generated at issuer for verification
   */
  value?: string;
}

/**
 * Core Tokenized Card response structure
 */
export interface TokenizedCardBaseDto {
  readonly _links?: TokenizedCardLinksDto;

  /**
   * The ID of the Tokenized Card
   */
  readonly id?: string;

  /**
   * The object type (always "tokenizedCard")
   */
  readonly object?: "tokenizedCard";

  /**
   * An identifier provided by the issuer for the account
   */
  accountReferenceId?: string;

  /**
   * Identifier of the consumer within the wallet
   * Maximum 24 characters for VTS
   */
  consumerId?: string;

  /**
   * Specifies whether the InstrumentId should be created
   * - true: The InstrumentId should be created
   * - false: The InstrumentId should not be created
   */
  createInstrumentIdentifier?: boolean;

  /**
   * Source of the payment instrument
   * - ONFILE: From stored card information
   * - TOKEN: From existing network token
   * - ISSUER: From issuer account reference
   */
  source?: "ONFILE" | "TOKEN" | "ISSUER";

  /**
   * State of the network token or network token provision
   * - ACTIVE: Network token is active
   * - SUSPENDED: Network token is suspended (can change back to ACTIVE)
   * - DELETED: Final state for a network token instance
   * - UNPROVISIONED: A previous network token
   */
  readonly state?: "ACTIVE" | "SUSPENDED" | "DELETED" | "UNPROVISIONED";

  /**
   * Issuer's state for the network token
   * - INVALID_REQUEST: Request contained invalid data
   * - CARD_VERIFICATION_FAILED: Data could not be verified
   * - CARD_NOT_ELIGIBLE: Card cannot be used with issuer for tokenization
   * - CARD_NOT_ALLOWED: Card cannot be used with card association for tokenization
   * - DECLINED: Card cannot be used with issuer for tokenization
   * - SERVICE_UNAVAILABLE: Network token service was unavailable or timed out
   * - SYSTEM_ERROR: Unexpected error occurred with network token service
   */
  readonly reason?:
    | "INVALID_REQUEST"
    | "CARD_VERIFICATION_FAILED"
    | "CARD_NOT_ELIGIBLE"
    | "CARD_NOT_ALLOWED"
    | "DECLINED"
    | "SERVICE_UNAVAILABLE"
    | "SYSTEM_ERROR"
    | "ACTIVE";

  /**
   * The token requestor's network token for the provided PAN and consumer ID
   */
  readonly number?: string;

  /**
   * Two-digit month in which the network token expires
   * Format: MM (01-12)
   */
  readonly expirationMonth?: string;

  /**
   * Four-digit year in which the network token expires
   * Format: YYYY
   */
  readonly expirationYear?: string;

  /**
   * The type of card (Card Network)
   * - visa
   * - mastercard
   * - americanexpress
   */
  type?: "visa" | "mastercard" | "americanexpress";

  /**
   * Value generated by the card association for payment processing
   * Used alongside the network token for transactions
   */
  readonly cryptogram?: string;

  /**
   * 4-digit number generated by the card association
   * Used alongside the network token for payment processing
   * Only supported for Amex and SCOF
   */
  readonly securityCode?: string;

  /**
   * Raw Electronic Commerce Indicator from card association
   * Provided with cardholder authentication result
   */
  readonly eci?: string;

  /**
   * 11-digit identifier that uniquely identifies the Token Requestor
   */
  readonly requestorId?: string;

  /**
   * Unique ID to identify this PAN/enrollment
   */
  readonly enrollmentId?: string;

  /**
   * Unique ID for network token
   */
  readonly tokenReferenceId?: string;

  /**
   * Payment account reference
   */
  readonly paymentAccountReference?: string;

  /**
   * Card object used to create the network token
   */
  card?: TokenizedCardInfoDto;

  /**
   * Passcode by issuer for ID&V
   */
  passcode?: TokenizedCardPasscodeDto;

  /**
   * Metadata associated with the tokenized card including visual assets
   */
  readonly metadata?: TokenizedCardMetadataDto;
}

/**
 * Request DTO for creating a Tokenized Card (Network Token)
 */
export interface TokenizedCardCreateDto {
  /**
   * An identifier provided by the issuer for the account
   * Required when source is ISSUER
   */
  accountReferenceId?: string;

  /**
   * Identifier of the consumer within the wallet
   * Maximum 24 characters for VTS
   */
  consumerId?: string;

  /**
   * Specifies whether the InstrumentId should be created
   * Default: false
   */
  createInstrumentIdentifier?: boolean;

  /**
   * Source of the payment instrument
   * - ONFILE: From stored card information
   * - TOKEN: From existing network token
   * - ISSUER: From issuer account reference
   */
  source: "ONFILE" | "TOKEN" | "ISSUER";

  /**
   * The type of card (Card Network)
   * - visa
   * - mastercard
   * - americanexpress
   */
  type?: "visa" | "mastercard" | "americanexpress";

  /**
   * Card information for token creation
   * Required when source is ONFILE or TOKEN
   */
  card?: TokenizedCardInfoDto;

  /**
   * Passcode by issuer for ID&V
   * Used for additional verification when required
   */
  passcode?: TokenizedCardPasscodeDto;
}

/**
 * Response DTO for Tokenized Card operations
 */
export interface TokenizedCardResponseDto extends TokenizedCardBaseDto {}

/**
 * Complete Tokenized Card DTO combining all properties
 */
export interface TokenizedCardDto extends TokenizedCardBaseDto {}

/**
 * Query parameters for retrieving Tokenized Cards
 * Currently no specific query parameters are supported for tokenized card retrieval
 */
export interface TokenizedCardQueryDto {
  // Reserved for future query parameters
}

/**
 * Common error response structure for Tokenized Card operations
 */
export interface TokenizedCardErrorDto {
  readonly errors?: Array<{
    readonly type?:
      | "invalidHeaders"
      | "missingHeaders"
      | "invalidFields"
      | "missingFields"
      | "unsupportedPaymentMethodModification"
      | "invalidCombination"
      | "forbidden"
      | "notFound"
      | "instrumentIdentifierDeletionError"
      | "tokenIdConflict"
      | "conflict"
      | "notAvailable"
      | "internalError";
    readonly message?: string;
    readonly details?: Array<{
      readonly name?: string;
      readonly location?: string;
    }>;
  }>;
}

/**
 * Example request structures for different use cases
 */

/**
 * Create Network Token using Card Information
 *
 * @example
 * ```typescript
 * const createFromCard: TokenizedCardCreateDto = {
 *   createInstrumentIdentifier: true,
 *   source: "ONFILE",
 *   card: {
 *     number: "4622943123116478",
 *     expirationMonth: "12",
 *     expirationYear: "2026"
 *   }
 * };
 * ```
 */

/**
 * Create Network Token using Issuer Account Reference
 *
 * @example
 * ```typescript
 * const createFromIssuer: TokenizedCardCreateDto = {
 *   createInstrumentIdentifier: true,
 *   source: "ISSUER",
 *   accountReferenceId: "c0e9dde7a241ec5e9e50cfd823a51c01",
 *   card: {
 *     type: "001" // visa
 *   }
 * };
 * ```
 */

/**
 * Create Network Token using Existing Network Token
 *
 * @example
 * ```typescript
 * const createFromToken: TokenizedCardCreateDto = {
 *   createInstrumentIdentifier: true,
 *   source: "TOKEN",
 *   card: {
 *     number: "4895370017256311", // existing network token
 *     expirationMonth: "12",
 *     expirationYear: "2031"
 *   }
 * };
 * ```
 */

/**
 * Create Network Token with Consumer ID
 *
 * @example
 * ```typescript
 * const createWithConsumer: TokenizedCardCreateDto = {
 *   createInstrumentIdentifier: true,
 *   source: "ONFILE",
 *   consumerId: "consumerId-1234",
 *   card: {
 *     number: "4622943123116478",
 *     expirationMonth: "12",
 *     expirationYear: "2026"
 *   }
 * };
 * ```
 */
