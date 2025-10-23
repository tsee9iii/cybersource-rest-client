/**
 * Customer Payment Instrument DTOs for CyberSource TMS API v2
 * Based on official CyberSource Customer Payment Instrument API specifications
 */

/**
 * Tokenized information for customer payment instruments
 */
export interface CustomerPaymentInstrumentTokenizedInfoDto {
  /**
   * Value that identifies your business and indicates that the cardholder's account number is tokenized.
   * This value is assigned by the token service provider and is unique within the token service provider's database.
   * Note: This field is supported only through VisaNet and FDC Nashville Global.
   * Max length: 11
   */
  requestorID?: string;

  /**
   * Type of transaction that provided the token data. This value does not specify the token service provider;
   * it specifies the entity that provided you with information about the token.
   * Set the value for this field to 1. An application on the customer's mobile device provided the token data.
   * Max length: 1
   */
  transactionType?: string;
}

/**
 * Card information for customer payment instruments
 * Based on CyberSource TMS API v2 specification
 */
export interface CustomerPaymentInstrumentCardDto {
  /**
   * Two-digit month in which the payment card expires.
   * Format: MM, Possible Values: 01 through 12
   * Max length: 2
   */
  expirationMonth?: string;

  /**
   * Four-digit year in which the credit card expires.
   * Format: YYYY
   * Max length: 4
   */
  expirationYear?: string;

  /**
   * Value that indicates the card type. Possible card type values from v2 to v1:
   * 001: visa, 002: mastercard, 003: american express, 004: discover, 005: diners club,
   * 006: carte blanche, 007: jcb, 008: optima, 011: twinpay credit, 012: twinpay debit,
   * 013: walmart, 014: enRoute, 015: lowes consumer, 016: home depot consumer, 017: mbna,
   * 018: dicks sportswear, 019: casual corner, 020: sears, 021: jal, 023: disney,
   * 024: maestro uk domestic, 025: sams club consumer, 026: sams club business,
   * 028: bill me later, 029: bebe, 030: restoration hardware, 031: delta online,
   * 032: solo, 033: visa electron, 034: dankort, 035: laser, 036: carte bleue,
   * 037: carta si, 038: pinless debit, 039: encoded account, 040: uatp, 041: household,
   * 042: maestro international, 043: ge money uk, 044: korean cards, 045: style,
   * 046: jcrew, 047: payease china processing ewallet, 048: payease china processing bank transfer,
   * 049: meijer private label, 050: hipercard, 051: aura, 052: redecard, 054: elo,
   * 055: capital one private label, 056: synchrony private label, 057: costco private label,
   * 060: mada, 062: china union pay, 063: falabella private label
   */
  type?: string;

  /**
   * Number of times a Maestro (UK Domestic) card has been issued to the account holder.
   * The card might or might not have an issue number. The number can consist of one or two digits,
   * and the first digit might be a zero. Do not include if not a Maestro (UK Domestic) card.
   * Max length: 2
   */
  issueNumber?: string;

  /**
   * Month of the start of the Maestro (UK Domestic) card validity period.
   * Format: MM, Possible Values: 01 through 12
   * Do not include if not a Maestro (UK Domestic) card.
   * Max length: 2
   */
  startMonth?: string;

  /**
   * Year of the start of the Maestro (UK Domestic) card validity period.
   * Format: YYYY
   * Do not include if not a Maestro (UK Domestic) card.
   * Max length: 4
   */
  startYear?: string;

  /**
   * Payment Instrument was created / updated as part of a pinless debit transaction.
   * Example: "pinless debit"
   */
  useAs?: string;

  /**
   * Hash value representing the card (read-only)
   * Min length: 32, Max length: 34
   */
  hash?: string;

  /**
   * Tokenized information for the card
   */
  tokenizedInformation?: CustomerPaymentInstrumentTokenizedInfoDto;
}

/**
 * Bank account information for customer payment instruments
 */
export interface CustomerPaymentInstrumentBankAccountDto {
  /**
   * Account type
   * Possible Values:
   * - checking (C)
   * - general ledger (G) - supported only on Wells Fargo ACH
   * - savings (S) - U.S. dollars only
   * - corporate checking (X) - U.S. dollars only
   * Max length: 18
   */
  type?: "checking" | "general ledger" | "savings" | "corporate checking";

  /**
   * Account number.
   * When processing encoded account numbers, use this field for the encoded account number.
   * Max length: 17
   */
  number?: string;

  /**
   * Bank routing number. This is also called the transit number.
   */
  routingNumber?: string;
}

/**
 * Issuer information for personal identification
 */
export interface CustomerPaymentInstrumentIssuedByDto {
  /**
   * The State or province where the customer's driver's license was issued.
   * Use the two-character State, Province, and Territory Codes for the United States and Canada.
   * Max length: 20
   */
  administrativeArea?: string;
}

/**
 * Personal identification information
 */
export interface CustomerPaymentInstrumentPersonalIdentificationDto {
  /**
   * The value of the identification type
   * Max length: 26
   */
  id?: string;

  /**
   * The type of the identification
   * Possible Values: driver license
   */
  type?: "driver license";

  /**
   * Issuer information for the identification
   */
  issuedBy?: CustomerPaymentInstrumentIssuedByDto;
}

/**
 * Buyer information for customer payment instruments
 */
export interface CustomerPaymentInstrumentBuyerInformationDto {
  /**
   * Company's tax identifier. This is only used for eCheck service.
   * Max length: 9
   */
  companyTaxID?: string;

  /**
   * Currency used for the order. Use the three-character ISO Standard Currency Codes.
   * For an authorization reversal or a capture, you must use the same currency that you used
   * in your payment authorization request.
   * Max length: 3
   */
  currency?: string;

  /**
   * Date of birth of the customer.
   * Format: YYYY-MM-DD
   */
  dateOfBirth?: string;

  /**
   * Personal identification information array
   */
  personalIdentification?: CustomerPaymentInstrumentPersonalIdentificationDto[];
}

/**
 * Billing address information for customer payment instruments
 */
export interface CustomerPaymentInstrumentBillToDto {
  /**
   * Customer's first name. This name must be the same as the name on the card.
   * Max length: 60
   */
  firstName?: string;

  /**
   * Customer's last name. This name must be the same as the name on the card.
   * Max length: 60
   */
  lastName?: string;

  /**
   * Name of the customer's company.
   * Max length: 60
   */
  company?: string;

  /**
   * Payment card billing street address as it appears on the credit card issuer's records.
   * Max length: 60
   */
  address1?: string;

  /**
   * Additional address information.
   * Max length: 60
   */
  address2?: string;

  /**
   * Payment card billing city.
   * Max length: 50
   */
  locality?: string;

  /**
   * State or province of the billing address. Use the State, Province, and Territory Codes
   * for the United States and Canada.
   * Max length: 20
   */
  administrativeArea?: string;

  /**
   * Postal code for the billing address. The postal code must consist of 5 to 9 digits.
   *
   * When the billing country is the U.S., the 9-digit postal code must follow this format:
   * [5 digits][dash][4 digits] (Example: 12345-6789)
   *
   * When the billing country is Canada, the 6-digit postal code must follow this format:
   * [alpha][numeric][alpha][space][numeric][alpha][numeric] (Example: A1B 2C3)
   * Max length: 10
   */
  postalCode?: string;

  /**
   * Payment card billing country. Use the two-character ISO Standard Country Codes.
   * Max length: 2
   */
  country?: string;

  /**
   * Customer's email address, including the full domain name.
   * Max length: 255
   */
  email?: string;

  /**
   * Customer's phone number.
   * Max length: 15
   */
  phoneNumber?: string;
}

/**
 * Bank transfer options for customer payment instruments
 */
export interface CustomerPaymentInstrumentBankTransferOptionsDto {
  /**
   * Specifies the authorization method for the transaction.
   *
   * TeleCheck Possible Values:
   * - ARC: account receivable conversion
   * - CCD: corporate cash disbursement
   * - POP: point of purchase conversion
   * - PPD: prearranged payment and deposit entry
   * - TEL: telephone-initiated entry
   * - WEB: internet-initiated entry
   * Max length: 3
   */
  SECCode?: "ARC" | "CCD" | "POP" | "PPD" | "TEL" | "WEB";
}

/**
 * Processing information for customer payment instruments
 */
export interface CustomerPaymentInstrumentProcessingInformationDto {
  /**
   * Flag that indicates that this is a payment for a bill or for an existing contractual loan.
   * Possible Values:
   * - true: Bill payment or loan payment
   * - false (default): Not a bill payment or loan payment
   */
  billPaymentProgramEnabled?: boolean;

  /**
   * Bank transfer options for the payment instrument
   */
  bankTransferOptions?: CustomerPaymentInstrumentBankTransferOptionsDto;
}

/**
 * Merchant descriptor information
 */
export interface CustomerPaymentInstrumentMerchantDescriptorDto {
  /**
   * Alternate contact information for your business, such as an email address or URL.
   * This value might be displayed on the cardholder's statement.
   * When you do not include this value in your capture or credit request, the merchant URL from your CyberSource account is used.
   * Important: This value must consist of English characters.
   * Max length: 13
   */
  alternateName?: string;
}

/**
 * Merchant information for customer payment instruments
 */
export interface CustomerPaymentInstrumentMerchantInformationDto {
  /**
   * Merchant descriptor information
   */
  merchantDescriptor?: CustomerPaymentInstrumentMerchantDescriptorDto;
}

/**
 * Instrument identifier information for customer payment instruments
 */
export interface CustomerPaymentInstrumentInstrumentIdentifierDto {
  /**
   * The Id of the Instrument Identifier linked to the Payment Instrument.
   * Min length: 12, Max length: 32
   */
  id?: string;
}

/**
 * Links for customer payment instrument resources
 */
export interface CustomerPaymentInstrumentLinksDto {
  /**
   * Link to the Payment Instrument
   */
  self?: {
    /**
     * URL to the payment instrument resource
     */
    href?: string;
  };

  /**
   * Link to the Customer
   */
  customer?: {
    /**
     * URL to the customer resource
     */
    href?: string;
  };
}

/**
 * Metadata information for customer payment instruments
 */
export interface CustomerPaymentInstrumentMetadataDto {
  /**
   * The creator of the Payment Instrument Token
   */
  creator?: string;
}

/**
 * DTO for creating a customer payment instrument
 * Based on CyberSource TMS API v2 Create Customer Payment Instrument specification
 */
export interface CustomerPaymentInstrumentCreateDto {
  /**
   * Resource links (read-only)
   */
  _links?: CustomerPaymentInstrumentLinksDto;

  /**
   * Flag that indicates whether customer payment instrument is the default.
   * Possible Values:
   * - true: Payment instrument is customer's default
   * - false: Payment instrument is not customer's default
   */
  default?: boolean;

  /**
   * Card information for the payment instrument
   */
  card?: CustomerPaymentInstrumentCardDto;

  /**
   * Bank account information for the payment instrument
   */
  bankAccount?: CustomerPaymentInstrumentBankAccountDto;

  /**
   * Buyer information for the payment instrument
   */
  buyerInformation?: CustomerPaymentInstrumentBuyerInformationDto;

  /**
   * Billing address information for the payment instrument
   */
  billTo?: CustomerPaymentInstrumentBillToDto;

  /**
   * Processing information for the payment instrument
   */
  processingInformation?: CustomerPaymentInstrumentProcessingInformationDto;

  /**
   * Merchant information for the payment instrument
   */
  merchantInformation?: CustomerPaymentInstrumentMerchantInformationDto;

  /**
   * Instrument identifier for the payment instrument
   */
  instrumentIdentifier?: CustomerPaymentInstrumentInstrumentIdentifierDto;
}

/**
 * DTO for updating a customer payment instrument
 * Based on CyberSource TMS API v2 Update Customer Payment Instrument specification
 */
export interface CustomerPaymentInstrumentUpdateDto {
  /**
   * Resource links (read-only)
   */
  _links?: CustomerPaymentInstrumentLinksDto;

  /**
   * Flag that indicates whether customer payment instrument is the default.
   * Possible Values:
   * - true: Payment instrument is customer's default
   * - false: Payment instrument is not customer's default
   */
  default?: boolean;

  /**
   * Card information for the payment instrument
   */
  card?: CustomerPaymentInstrumentCardDto;

  /**
   * Bank account information for the payment instrument
   */
  bankAccount?: CustomerPaymentInstrumentBankAccountDto;

  /**
   * Buyer information for the payment instrument
   */
  buyerInformation?: CustomerPaymentInstrumentBuyerInformationDto;

  /**
   * Billing address information for the payment instrument
   */
  billTo?: CustomerPaymentInstrumentBillToDto;

  /**
   * Processing information for the payment instrument
   */
  processingInformation?: CustomerPaymentInstrumentProcessingInformationDto;

  /**
   * Merchant information for the payment instrument
   */
  merchantInformation?: CustomerPaymentInstrumentMerchantInformationDto;

  /**
   * Instrument identifier for the payment instrument
   */
  instrumentIdentifier?: CustomerPaymentInstrumentInstrumentIdentifierDto;
}

/**
 * DTO for customer payment instrument response
 * Based on CyberSource TMS API v2 Customer Payment Instrument response specification
 */
export interface CustomerPaymentInstrumentResponseDto {
  /**
   * Resource links
   */
  _links?: CustomerPaymentInstrumentLinksDto;

  /**
   * The Id of the Payment Instrument Token
   * Min length: 1, Max length: 32
   */
  id?: string;

  /**
   * The type (always "paymentInstrument")
   */
  object?: "paymentInstrument";

  /**
   * Flag that indicates whether customer payment instrument is the default.
   * Possible Values:
   * - true: Payment instrument is customer's default
   * - false: Payment instrument is not customer's default
   */
  default?: boolean;

  /**
   * Issuers state for the card number.
   * Possible Values:
   * - ACTIVE
   * - CLOSED: The account has been closed
   */
  state?: "ACTIVE" | "CLOSED";

  /**
   * The type of Payment Instrument.
   * Possible Values: cardHash
   */
  type?: "cardHash";

  /**
   * Bank account information for the payment instrument
   */
  bankAccount?: CustomerPaymentInstrumentBankAccountDto;

  /**
   * Card information for the payment instrument
   */
  card?: CustomerPaymentInstrumentCardDto;

  /**
   * Buyer information for the payment instrument
   */
  buyerInformation?: CustomerPaymentInstrumentBuyerInformationDto;

  /**
   * Billing address information for the payment instrument
   */
  billTo?: CustomerPaymentInstrumentBillToDto;

  /**
   * Processing information for the payment instrument
   */
  processingInformation?: CustomerPaymentInstrumentProcessingInformationDto;

  /**
   * Merchant information for the payment instrument
   */
  merchantInformation?: CustomerPaymentInstrumentMerchantInformationDto;

  /**
   * Instrument identifier for the payment instrument
   */
  instrumentIdentifier?: CustomerPaymentInstrumentInstrumentIdentifierDto;

  /**
   * Metadata about the payment instrument
   */
  metadata?: CustomerPaymentInstrumentMetadataDto;
}

/**
 * DTO for customer payment instrument list response
 * Based on CyberSource TMS API v2 List Customer Payment Instruments specification
 */
export interface CustomerPaymentInstrumentListResponseDto {
  /**
   * Links for pagination
   */
  _links?: {
    /**
     * Link to current page
     */
    self?: { href?: string };
    /**
     * Link to first page
     */
    first?: { href?: string };
    /**
     * Link to previous page
     */
    prev?: { href?: string };
    /**
     * Link to next page
     */
    next?: { href?: string };
    /**
     * Link to last page
     */
    last?: { href?: string };
  };

  /**
   * The offset parameter supplied in the request
   */
  offset?: number;

  /**
   * The limit parameter supplied in the request
   */
  limit?: number;

  /**
   * The number of Payment Instruments returned in the array
   */
  count?: number;

  /**
   * The total number of Payment Instruments associated with the Customer
   */
  total?: number;

  /**
   * Embedded payment instrument resources
   */
  _embedded?: {
    /**
     * Array of payment instrument objects
     */
    paymentInstruments?: CustomerPaymentInstrumentResponseDto[];
  };
}

/**
 * DTO for customer payment instrument pagination options
 */
export interface CustomerPaymentInstrumentPaginationOptionsDto {
  /**
   * Starting record in zero-based dataset that should be returned as the first object in the array.
   * Default is 0, Minimum: 0
   */
  offset?: number;

  /**
   * The maximum number that can be returned in the array starting from the offset record in zero-based dataset.
   * Default is 20, Minimum: 1, Maximum: 100
   */
  limit?: number;
}
