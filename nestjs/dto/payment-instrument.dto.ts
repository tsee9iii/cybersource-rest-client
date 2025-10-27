/**
 * Payment Instrument DTOs for CyberSource TMS API v2
 * Based on official CyberSource Payment Instrument API specifications
 * For standalone payment instruments (not customer-specific)
 */

/**
 * Tokenized information for payment instruments
 */
export interface PaymentInstrumentTokenizedInfoDto {
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
 * Card information for payment instruments
 * Based on CyberSource TMS API v2 specification
 */
export interface PaymentInstrumentCardDto {
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
  tokenizedInformation?: PaymentInstrumentTokenizedInfoDto;
}

/**
 * Bank account information for payment instruments
 */
export interface PaymentInstrumentBankAccountDto {
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
export interface PaymentInstrumentIssuedByDto {
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
export interface PaymentInstrumentPersonalIdentificationDto {
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
  issuedBy?: PaymentInstrumentIssuedByDto;
}

/**
 * Buyer information for payment instruments
 */
export interface PaymentInstrumentBuyerInformationDto {
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
  personalIdentification?: PaymentInstrumentPersonalIdentificationDto[];
}

/**
 * Billing address information for payment instruments
 */
export interface PaymentInstrumentBillToDto {
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
 * Bank transfer options for payment instruments
 */
export interface PaymentInstrumentBankTransferOptionsDto {
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
 * Processing information for payment instruments
 */
export interface PaymentInstrumentProcessingInformationDto {
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
  bankTransferOptions?: PaymentInstrumentBankTransferOptionsDto;
}

/**
 * Merchant descriptor information
 */
export interface PaymentInstrumentMerchantDescriptorDto {
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
 * Merchant information for payment instruments
 */
export interface PaymentInstrumentMerchantInformationDto {
  /**
   * Merchant descriptor information
   */
  merchantDescriptor?: PaymentInstrumentMerchantDescriptorDto;
}

/**
 * Instrument identifier information for payment instruments
 */
export interface PaymentInstrumentInstrumentIdentifierDto {
  /**
   * The Id of the Instrument Identifier linked to the Payment Instrument.
   * Min length: 12, Max length: 32
   */
  id?: string;
}

/**
 * Links for payment instrument resources
 */
export interface PaymentInstrumentLinksDto {
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
   * Link to the Customer (if applicable)
   */
  customer?: {
    /**
     * URL to the customer resource
     */
    href?: string;
  };
}

/**
 * Metadata information for payment instruments
 */
export interface PaymentInstrumentMetadataDto {
  /**
   * The creator of the Payment Instrument Token
   */
  creator?: string;
}

/**
 * BIN lookup card information
 */
export interface PaymentInstrumentBinCardDto {
  /**
   * 3-digit numeric value that indicates the card type within Cybersource eco-system.
   * Possible values: 000-082 (see documentation for full list)
   * Max length: 3
   */
  type?: string;

  /**
   * Card brand name (VISA, MASTERCARD, AMERICAN EXPRESS, etc.)
   * Max length: 20
   */
  brandName?: string;

  /**
   * 3-letter ISO Standard Currency Code for the card currency
   * Max length: 3
   */
  currency?: string;

  /**
   * Max length of the card
   * Max length: 2
   */
  maxLength?: string;

  /**
   * Type of the payment credential
   * Possible values: PAN, TOKEN
   * Max length: 5
   */
  credentialType?: string;

  /**
   * Array of brands associated with the card
   */
  brands?: Array<{
    /**
     * 3-digit card type code
     */
    type?: string;
    /**
     * Brand name
     */
    brandName?: string;
  }>;
}

/**
 * BIN lookup features information
 */
export interface PaymentInstrumentBinFeaturesDto {
  /**
   * Account funding source (CREDIT, DEBIT, PREPAID, DEFERRED DEBIT, CHARGE)
   * Max length: 20
   */
  accountFundingSource?: string;

  /**
   * Type of prepaid card (Reloadable, Non-reloadable)
   * Max length: 20
   */
  accountFundingSourceSubType?: string;

  /**
   * Type of issuer product (Visa Classic, Visa Signature, Visa Infinite)
   * Max length: 50
   */
  cardProduct?: string;

  /**
   * Type of BIN based authentication (S: Single Message, D: Dual Message)
   * Max length: 1
   */
  messageType?: string;

  /**
   * Acceptance level of the PAN (0: Normal, 1: Monitor, 2: Refuse, 3: Not Allowed, 4: Private, 5: Test)
   * Max length: 2
   */
  acceptanceLevel?: string;

  /**
   * Type of card platform (BUSINESS, CONSUMER, CORPORATE, COMMERCIAL, GOVERNMENT)
   * Max length: 20
   */
  cardPlatform?: string;

  /**
   * Type of combo card (0: Not combo, 1: Credit/Prepaid, 2: Credit/Debit, 3: Prepaid Credit/Debit)
   * Max length: 1
   */
  comboCard?: string;

  /**
   * Whether instrument can be used for corporate purchasing (American Express only)
   */
  corporatePurchase?: boolean;

  /**
   * Whether BIN is for healthcare (HSA/FSA) - Visa BINs only
   */
  healthCard?: boolean;

  /**
   * Whether BIN is shared by multiple issuers
   */
  sharedBIN?: boolean;

  /**
   * Whether BIN is valid only for POS domestic usage
   */
  posDomesticOnly?: boolean;

  /**
   * Whether gambling transactions are allowed on the BIN
   */
  gamblingAllowed?: boolean;

  /**
   * Whether transaction qualifies for level 2 interchange rates
   */
  commercialCardLevel2?: boolean;

  /**
   * Whether transaction qualifies for level 3 interchange rates
   */
  commercialCardLevel3?: boolean;

  /**
   * Whether transaction qualifies for government exempt interchange fee
   */
  exemptBIN?: boolean;

  /**
   * Whether BIN participates in Account Level Management (ALM)
   */
  accountLevelManagement?: boolean;

  /**
   * Whether online gambling is blocked on the BIN
   */
  onlineGamblingBlock?: boolean;

  /**
   * Whether auto-substantiation is enabled on the BIN
   */
  autoSubstantiation?: boolean;

  /**
   * Whether instrument is a flex credential
   */
  flexCredential?: boolean;

  /**
   * Visa-assigned product identifier (Visa BINs only)
   */
  productId?: string;

  /**
   * Visa-assigned product subtype identifier (Visa BINs only)
   */
  productIdSubtype?: string;

  /**
   * Whether payment instrument supports 3D Secure authentication
   */
  threeDSSupport?: boolean;

  /**
   * Whether payment instrument is eligible for Standing Instructions (recurring payments)
   */
  siEligible?: boolean;

  /**
   * Whether card is eligible for Equated Monthly Installments (EMI)
   */
  emiEligible?: boolean;
}

/**
 * BIN lookup network information
 */
export interface PaymentInstrumentBinNetworkDto {
  /**
   * Code that identifies the network
   */
  id?: string;
}

/**
 * BIN lookup issuer information
 */
export interface PaymentInstrumentBinIssuerDto {
  /**
   * Issuer name
   * Max length: 200
   */
  name?: string;

  /**
   * 2-character ISO Country Code for the issuer
   * Max length: 2
   */
  country?: string;

  /**
   * Length of the BIN
   * Max length: 2
   */
  binLength?: string;

  /**
   * First 6 to 8 digits of primary account number (PAN)
   * Max length: 8
   */
  accountPrefix?: string;

  /**
   * Customer service phone number for the issuer
   * Max length: 50
   */
  phoneNumber?: string;
}

/**
 * BIN lookup information (embedded when retrieveBinDetails=true)
 */
export interface PaymentInstrumentBinLookupDto {
  /**
   * Payment account information
   */
  paymentAccountInformation?: {
    /**
     * Card information
     */
    card?: PaymentInstrumentBinCardDto;
  };

  /**
   * BIN features information
   */
  features?: PaymentInstrumentBinFeaturesDto;

  /**
   * Network information
   */
  network?: PaymentInstrumentBinNetworkDto;

  /**
   * Issuer information
   */
  issuerInformation?: PaymentInstrumentBinIssuerDto;
}

/**
 * Embedded resources for payment instruments
 */
export interface PaymentInstrumentEmbeddedDto {
  /**
   * BIN lookup information (only when retrieveBinDetails=true)
   */
  binLookup?: PaymentInstrumentBinLookupDto;
}

/**
 * DTO for creating a payment instrument
 * Based on CyberSource TMS API v2 Create Payment Instrument specification
 */
export interface PaymentInstrumentCreateDto {
  /**
   * Resource links (read-only)
   */
  _links?: PaymentInstrumentLinksDto;

  /**
   * The Id of the Payment Instrument Token.
   * If not provided, CyberSource will generate one automatically.
   * Min length: 1, Max length: 32
   */
  id?: string;

  /**
   * Flag that indicates whether payment instrument is the default.
   * Possible Values:
   * - true: Payment instrument is default
   * - false: Payment instrument is not default
   */
  default?: boolean;

  /**
   * Card information for the payment instrument
   */
  card?: PaymentInstrumentCardDto;

  /**
   * Bank account information for the payment instrument
   */
  bankAccount?: PaymentInstrumentBankAccountDto;

  /**
   * Buyer information for the payment instrument
   */
  buyerInformation?: PaymentInstrumentBuyerInformationDto;

  /**
   * Billing address information for the payment instrument
   */
  billTo?: PaymentInstrumentBillToDto;

  /**
   * Processing information for the payment instrument
   */
  processingInformation?: PaymentInstrumentProcessingInformationDto;

  /**
   * Merchant information for the payment instrument
   */
  merchantInformation?: PaymentInstrumentMerchantInformationDto;

  /**
   * Instrument identifier for the payment instrument
   */
  instrumentIdentifier?: PaymentInstrumentInstrumentIdentifierDto;
}

/**
 * DTO for updating a payment instrument
 * Based on CyberSource TMS API v2 Update Payment Instrument specification
 */
export interface PaymentInstrumentUpdateDto {
  /**
   * Resource links (read-only)
   */
  _links?: PaymentInstrumentLinksDto;

  /**
   * The Id of the Payment Instrument Token.
   * Min length: 1, Max length: 32
   */
  id?: string;

  /**
   * Flag that indicates whether payment instrument is the default.
   * Possible Values:
   * - true: Payment instrument is default
   * - false: Payment instrument is not default
   */
  default?: boolean;

  /**
   * Card information for the payment instrument
   */
  card?: PaymentInstrumentCardDto;

  /**
   * Bank account information for the payment instrument
   */
  bankAccount?: PaymentInstrumentBankAccountDto;

  /**
   * Buyer information for the payment instrument
   */
  buyerInformation?: PaymentInstrumentBuyerInformationDto;

  /**
   * Billing address information for the payment instrument
   */
  billTo?: PaymentInstrumentBillToDto;

  /**
   * Processing information for the payment instrument
   */
  processingInformation?: PaymentInstrumentProcessingInformationDto;

  /**
   * Merchant information for the payment instrument
   */
  merchantInformation?: PaymentInstrumentMerchantInformationDto;

  /**
   * Instrument identifier for the payment instrument
   */
  instrumentIdentifier?: PaymentInstrumentInstrumentIdentifierDto;
}

/**
 * DTO for payment instrument response
 * Based on CyberSource TMS API v2 Payment Instrument response specification
 */
export interface PaymentInstrumentResponseDto {
  /**
   * Resource links
   */
  _links?: PaymentInstrumentLinksDto;

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
   * Flag that indicates whether payment instrument is the default.
   * Possible Values:
   * - true: Payment instrument is default
   * - false: Payment instrument is not default
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
  bankAccount?: PaymentInstrumentBankAccountDto;

  /**
   * Card information for the payment instrument
   */
  card?: PaymentInstrumentCardDto;

  /**
   * Buyer information for the payment instrument
   */
  buyerInformation?: PaymentInstrumentBuyerInformationDto;

  /**
   * Billing address information for the payment instrument
   */
  billTo?: PaymentInstrumentBillToDto;

  /**
   * Processing information for the payment instrument
   */
  processingInformation?: PaymentInstrumentProcessingInformationDto;

  /**
   * Merchant information for the payment instrument
   */
  merchantInformation?: PaymentInstrumentMerchantInformationDto;

  /**
   * Instrument identifier for the payment instrument
   */
  instrumentIdentifier?: PaymentInstrumentInstrumentIdentifierDto;

  /**
   * Metadata about the payment instrument
   */
  metadata?: PaymentInstrumentMetadataDto;

  /**
   * Embedded resources (BIN lookup when retrieveBinDetails=true)
   */
  _embedded?: PaymentInstrumentEmbeddedDto;
}

/**
 * DTO for payment instrument pagination options
 */
export interface PaymentInstrumentPaginationOptionsDto {
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

  /**
   * Retrieve the BIN Details of PAN or network token
   */
  retrieveBinDetails?: boolean;
}
