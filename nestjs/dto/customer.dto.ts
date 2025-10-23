export interface CustomerCreateDto {
  /**
   * Object information about the customer
   */
  objectInformation?: {
    /**
     * Name or title of the customer.
     * Max length: 60
     */
    title?: string;
    /**
     * Comments that you can make about the customer.
     * Max length: 150
     */
    comment?: string;
  };

  /**
   * Buyer information for the customer
   */
  buyerInformation?: {
    /**
     * Your identifier for the customer.
     * Max length: 100
     */
    merchantCustomerID?: string;
    /**
     * Customer's primary email address, including the full domain name.
     * Max length: 255
     */
    email?: string;
  };

  /**
   * Client reference information
   */
  clientReferenceInformation?: {
    /**
     * Client-generated order reference or tracking number.
     * Max length: 50
     */
    code?: string;
  };

  /**
   * Object containing the custom data that the merchant defines.
   */
  merchantDefinedInformation?: Array<{
    /**
     * The number you assign as the name for your merchant-defined data or secure field.
     * Possible Values: data1, data2, data3, data4, sensitive1, sensitive2, sensitive3, sensitive4
     */
    name?:
      | "data1"
      | "data2"
      | "data3"
      | "data4"
      | "sensitive1"
      | "sensitive2"
      | "sensitive3"
      | "sensitive4";
    /**
     * The value you assign for your merchant-defined data field.
     * Max length: 100
     *
     * **Warning** Merchant-defined data fields are not intended to and must not be used
     * to capture personally identifying information.
     */
    value?: string;
  }>;

  /**
   * Default payment instrument
   */
  defaultPaymentInstrument?: {
    /**
     * The Id of the Customers default Payment Instrument
     */
    id?: string;
  };

  /**
   * Default shipping address
   */
  defaultShippingAddress?: {
    /**
     * The Id of the Customers default Shipping Address
     */
    id?: string;
  };
}

export interface CustomerUpdateDto {
  /**
   * Object information about the customer
   */
  objectInformation?: {
    /**
     * Name or title of the customer.
     * Max length: 60
     */
    title?: string;
    /**
     * Comments that you can make about the customer.
     * Max length: 150
     */
    comment?: string;
  };

  /**
   * Buyer information for the customer
   */
  buyerInformation?: {
    /**
     * Your identifier for the customer.
     * Max length: 100
     */
    merchantCustomerID?: string;
    /**
     * Customer's primary email address, including the full domain name.
     * Max length: 255
     */
    email?: string;
  };

  /**
   * Client reference information
   */
  clientReferenceInformation?: {
    /**
     * Client-generated order reference or tracking number.
     * Max length: 50
     */
    code?: string;
  };

  /**
   * Object containing the custom data that the merchant defines.
   */
  merchantDefinedInformation?: Array<{
    /**
     * The number you assign as the name for your merchant-defined data or secure field.
     * Possible Values: data1, data2, data3, data4, sensitive1, sensitive2, sensitive3, sensitive4
     */
    name?:
      | "data1"
      | "data2"
      | "data3"
      | "data4"
      | "sensitive1"
      | "sensitive2"
      | "sensitive3"
      | "sensitive4";
    /**
     * The value you assign for your merchant-defined data field.
     * Max length: 100
     *
     * **Warning** Merchant-defined data fields are not intended to and must not be used
     * to capture personally identifying information.
     */
    value?: string;
  }>;

  /**
   * Default payment instrument
   */
  defaultPaymentInstrument?: {
    /**
     * The Id of the Customers default Payment Instrument
     */
    id?: string;
  };

  /**
   * Default shipping address
   */
  defaultShippingAddress?: {
    /**
     * The Id of the Customers default Shipping Address
     */
    id?: string;
  };
}

export interface CustomerLinksDto {
  /**
   * Link to the Customer
   */
  self?: {
    href?: string;
  };
  /**
   * Link to the Customers Payment Instruments
   */
  paymentInstruments?: {
    href?: string;
  };
  /**
   * Link to the Customers Shipping Addresses
   */
  shippingAddress?: {
    href?: string;
  };
}

/**
 * Card information for payment instruments
 */
export interface CardDetailsDto {
  /**
   * Two-digit month in which the payment card expires.
   * Format: MM, Possible Values: 01 through 12
   */
  expirationMonth?: string;
  /**
   * Four-digit year in which the credit card expires.
   * Format: YYYY
   */
  expirationYear?: string;
  /**
   * Value that indicates the card type
   */
  type?: string;
  /**
   * Number of times a Maestro (UK Domestic) card has been issued to the account holder
   * Max length: 2
   */
  issueNumber?: string;
  /**
   * Month of the start of the Maestro (UK Domestic) card validity period
   * Format: MM, Possible Values: 01 through 12
   */
  startMonth?: string;
  /**
   * Year of the start of the Maestro (UK Domestic) card validity period
   * Format: YYYY
   */
  startYear?: string;
  /**
   * Payment Instrument was created / updated as part of a pinless debit transaction
   */
  useAs?: string;
  /**
   * Hash value representing the card (read-only)
   * Min length: 32, Max length: 34
   */
  hash?: string;
  /**
   * Tokenized information
   */
  tokenizedInformation?: {
    /**
     * Value that identifies your business and indicates that the cardholder's account number is tokenized
     * Max length: 11
     */
    requestorID?: string;
    /**
     * Type of transaction that provided the token data
     * Max length: 1
     */
    transactionType?: string;
  };
}

/**
 * Bank account information for payment instruments
 */
export interface BankAccountDetailsDto {
  /**
   * Account type
   * Possible Values: checking (C), general ledger (G), savings (S), corporate checking (X)
   */
  type?: "checking" | "general ledger" | "savings" | "corporate checking";
}

/**
 * Buyer information details
 */
export interface BuyerInformationDetailsDto {
  /**
   * Company's tax identifier (eCheck service only)
   * Max length: 9
   */
  companyTaxID?: string;
  /**
   * Currency used for the order. Use three-character ISO Standard Currency Codes
   * Max length: 3
   */
  currency?: string;
  /**
   * Date of birth of the customer
   * Format: YYYY-MM-DD
   */
  dateOfBirth?: string;
  /**
   * Personal identification information
   */
  personalIdentification?: Array<{
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
     * Issuer information
     */
    issuedBy?: {
      /**
       * The State or province where the customer's driver's license was issued
       * Max length: 20
       */
      administrativeArea?: string;
    };
  }>;
}

/**
 * Billing address information
 */
export interface BillToInformationDto {
  /**
   * Customer's first name
   * Max length: 60
   */
  firstName?: string;
  /**
   * Customer's last name
   * Max length: 60
   */
  lastName?: string;
  /**
   * Name of the customer's company
   * Max length: 60
   */
  company?: string;
  /**
   * Payment card billing street address
   * Max length: 60
   */
  address1?: string;
  /**
   * Additional address information
   * Max length: 60
   */
  address2?: string;
  /**
   * Payment card billing city
   * Max length: 50
   */
  locality?: string;
  /**
   * State or province of the billing address
   * Max length: 20
   */
  administrativeArea?: string;
  /**
   * Postal code for the billing address
   * Max length: 10
   */
  postalCode?: string;
  /**
   * Payment card billing country. Use two-character ISO Standard Country Codes
   * Max length: 2
   */
  country?: string;
  /**
   * Customer's email address
   * Max length: 255
   */
  email?: string;
  /**
   * Customer's phone number
   * Max length: 15
   */
  phoneNumber?: string;
}

/**
 * Processing information for customer payment instruments
 */
export interface CustomerProcessingInformationDto {
  /**
   * Flag that indicates if this is a bill payment or loan payment
   */
  billPaymentProgramEnabled?: boolean;
  /**
   * Bank transfer options
   */
  bankTransferOptions?: {
    /**
     * Authorization method for the transaction
     * Max length: 3
     * Possible Values: ARC, CCD, POP, PPD, TEL, WEB
     */
    SECCode?: "ARC" | "CCD" | "POP" | "PPD" | "TEL" | "WEB";
  };
}

/**
 * Merchant information
 */
export interface MerchantInformationDto {
  merchantDescriptor?: {
    /**
     * Alternate contact information for your business
     * Max length: 13
     */
    alternateName?: string;
  };
}

/**
 * Instrument identifier information (simplified reference)
 */
export interface CustomerInstrumentIdentifierDto {
  /**
   * The Id of the Instrument Identifier linked to the Payment Instrument
   * Min length: 12, Max length: 32
   */
  id?: string;
}

/**
 * Authorization options for processing information
 */
export interface AuthorizationOptionsDto {
  initiator?: {
    merchantInitiatedTransaction?: {
      /**
       * Network transaction identifier from previous transaction
       * Max length: 15
       */
      previousTransactionId?: string;
      /**
       * Amount of the original authorization
       * Max length: 15
       */
      originalAuthorizedAmount?: string;
    };
  };
}

export interface PaymentInstrumentSummaryDto {
  /**
   * Resource links
   */
  _links?: {
    /**
     * Link to the Payment Instrument
     */
    self?: {
      href?: string;
    };
    /**
     * Link to the Customer
     */
    customer?: {
      href?: string;
    };
  };
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
   * Flag that indicates whether customer payment instrument is the default
   */
  default?: boolean;
  /**
   * Issuers state for the card number
   * Possible Values: ACTIVE, CLOSED
   */
  state?: "ACTIVE" | "CLOSED";
  /**
   * The type of Payment Instrument
   * Possible Values: cardHash
   */
  type?: "cardHash";
  /**
   * Bank account information
   */
  bankAccount?: BankAccountDetailsDto;
  /**
   * Card information
   */
  card?: CardDetailsDto;
  /**
   * Buyer information
   */
  buyerInformation?: BuyerInformationDetailsDto;
  /**
   * Billing address information
   */
  billTo?: BillToInformationDto;
  /**
   * Processing information
   */
  processingInformation?: CustomerProcessingInformationDto;
  /**
   * Merchant information
   */
  merchantInformation?: MerchantInformationDto;
  /**
   * Instrument identifier
   */
  instrumentIdentifier?: CustomerInstrumentIdentifierDto;
  /**
   * Metadata about the payment instrument
   */
  metadata?: {
    /**
     * The creator of the Payment Instrument
     */
    creator?: string;
  };
}

export interface ShippingAddressSummaryDto {
  /**
   * Resource links
   */
  _links?: {
    /**
     * Link to the Customers Shipping Address
     */
    self?: {
      href?: string;
    };
    /**
     * Link to the Customer
     */
    customer?: {
      href?: string;
    };
  };
  /**
   * The Id of the Shipping Address Token
   * Min length: 1, Max length: 32
   */
  id?: string;
  /**
   * Flag that indicates whether customer shipping address is the default
   */
  default?: boolean;
  /**
   * Shipping address details
   */
  shipTo?: {
    /**
     * First name of the recipient
     * Max length: 60
     */
    firstName?: string;
    /**
     * Last name of the recipient
     * Max length: 60
     */
    lastName?: string;
    /**
     * Company associated with the shipping address
     * Max length: 60
     */
    company?: string;
    /**
     * First line of the shipping address
     * Max length: 60
     */
    address1?: string;
    /**
     * Second line of the shipping address
     * Max length: 60
     */
    address2?: string;
    /**
     * City of the shipping address
     * Max length: 50
     */
    locality?: string;
    /**
     * State or province of the shipping address. Use 2 character State, Province, and Territory Codes
     * Max length: 20
     */
    administrativeArea?: string;
    /**
     * Postal code for the shipping address. Must consist of 5 to 9 digits
     * Max length: 10
     *
     * Format for US: [5 digits][dash][4 digits] (Example: 12345-6789)
     * Format for Canada: [alpha][numeric][alpha][space][numeric][alpha][numeric] (Example: A1B 2C3)
     */
    postalCode?: string;
    /**
     * Country of the shipping address. Use two-character ISO Standard Country Codes
     * Max length: 2
     */
    country?: string;
    /**
     * Email associated with the shipping address
     * Max length: 320
     */
    email?: string;
    /**
     * Phone number associated with the shipping address
     * Max length: 15
     */
    phoneNumber?: string;
  };
  /**
   * Metadata about the shipping address
   */
  metadata?: {
    /**
     * The creator of the Shipping Address
     */
    creator?: string;
  };
}

export interface CustomerResponseDto {
  /**
   * Resource links
   */
  _links?: CustomerLinksDto;

  /**
   * The Id of the Customer Token
   * Min length: 1, Max length: 32
   */
  id?: string;

  /**
   * Object information about the customer
   */
  objectInformation?: {
    /**
     * Name or title of the customer
     * Max length: 60
     */
    title?: string;
    /**
     * Comments that you can make about the customer
     * Max length: 150
     */
    comment?: string;
  };

  /**
   * Buyer information for the customer
   */
  buyerInformation?: {
    /**
     * Your identifier for the customer
     * Max length: 100
     */
    merchantCustomerID?: string;
    /**
     * Customer's primary email address, including the full domain name
     * Max length: 255
     */
    email?: string;
  };

  /**
   * Client reference information
   */
  clientReferenceInformation?: {
    /**
     * Client-generated order reference or tracking number
     * Max length: 50
     */
    code?: string;
  };

  /**
   * Object containing the custom data that the merchant defines
   */
  merchantDefinedInformation?: Array<{
    /**
     * The number you assign as the name for your merchant-defined data or secure field
     * Possible Values: data1, data2, data3, data4, sensitive1, sensitive2, sensitive3, sensitive4
     */
    name?:
      | "data1"
      | "data2"
      | "data3"
      | "data4"
      | "sensitive1"
      | "sensitive2"
      | "sensitive3"
      | "sensitive4";
    /**
     * The value you assign for your merchant-defined data field
     * Max length: 100
     *
     * **Warning** Merchant-defined data fields are not intended to and must not be used
     * to capture personally identifying information.
     */
    value?: string;
  }>;

  /**
   * Default payment instrument
   */
  defaultPaymentInstrument?: {
    /**
     * The Id of the Customers default Payment Instrument
     */
    id?: string;
  };

  /**
   * Default shipping address
   */
  defaultShippingAddress?: {
    /**
     * The Id of the Customers default Shipping Address
     */
    id?: string;
  };

  /**
   * Metadata about the customer
   */
  metadata?: {
    /**
     * The creator of the Customer
     */
    creator?: string;
  };

  /**
   * Additional embedded resources for the Customer
   */
  _embedded?: {
    /**
     * Default payment instrument details
     */
    defaultPaymentInstrument?: PaymentInstrumentSummaryDto;
    /**
     * Default shipping address details
     */
    defaultShippingAddress?: ShippingAddressSummaryDto;
  };
}

export interface CustomerListResponseDto {
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
   * The number of Customers returned in the array
   */
  count?: number;

  /**
   * The total number of Customers
   */
  total?: number;

  /**
   * Embedded customer resources
   */
  _embedded?: {
    /**
     * Array of customer objects
     */
    customers?: CustomerResponseDto[];
  };
}

export interface CustomerPaginationOptionsDto {
  /**
   * Starting record in zero-based dataset that should be returned as the first object in the array
   * Default is 0, Minimum: 0
   */
  offset?: number;

  /**
   * The maximum number that can be returned in the array starting from the offset record in zero-based dataset
   * Default is 20, Minimum: 1, Maximum: 100
   */
  limit?: number;
}
