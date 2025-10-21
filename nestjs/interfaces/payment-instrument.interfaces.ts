export interface BaseLinks {
  self?: {
    href?: string;
  };
}

export interface PaginationLinks extends BaseLinks {
  first?: {
    href?: string;
  };
  prev?: {
    href?: string;
  };
  next?: {
    href?: string;
  };
  last?: {
    href?: string;
  };
}

export interface CardInformation {
  number?: string;
  expirationMonth?: string;
  expirationYear?: string;
  securityCode?: string;
  type?: string;
  suffix?: string;
}

export interface BankAccountInformation {
  number?: string;
  routingNumber?: string;
}

export interface BillToInformation {
  address1?: string;
  address2?: string;
  locality?: string;
  administrativeArea?: string;
  postalCode?: string;
  country?: string;
}

export interface ProcessingInformation {
  authorizationOptions?: {
    initiator?: {
      merchantInitiatedTransaction?: {
        previousTransactionId?: string;
        originalAuthorizedAmount?: string;
      };
    };
  };
}

export interface TokenProvisioningInformation {
  consumerConsentObtained?: boolean;
  multiFactorAuthenticated?: boolean;
}

export interface BinLookupCardInformation {
  type?: string;
  brandName?: string;
  currency?: string;
  maxLength?: string;
  credentialType?: string;
  brands?: Array<{
    type?: string;
    brandName?: string;
  }>;
}

export interface BinLookupFeatures {
  accountFundingSource?: string;
  accountFundingSourceSubType?: string;
  cardProduct?: string;
  messageType?: string;
  acceptanceLevel?: string;
  cardPlatform?: string;
  comboCard?: string;
  corporatePurchase?: boolean;
  healthCard?: boolean;
  sharedBIN?: boolean;
  posDomesticOnly?: boolean;
  gamblingAllowed?: boolean;
  commercialCardLevel2?: boolean;
  commercialCardLevel3?: boolean;
  exemptBIN?: boolean;
  accountLevelManagement?: boolean;
  onlineGamblingBlock?: boolean;
  autoSubstantiation?: boolean;
  flexCredential?: boolean;
}

export interface BinLookupNetworkInformation {
  id?: string;
}

export interface BinLookupIssuerInformation {
  name?: string;
  country?: string;
  binLength?: string;
  accountPrefix?: string;
  phoneNumber?: string;
}

export interface BinLookup {
  paymentAccountInformation?: {
    card?: BinLookupCardInformation;
  };
  features?: BinLookupFeatures;
  network?: BinLookupNetworkInformation;
  issuerInformation?: BinLookupIssuerInformation;
}

export interface Metadata {
  scopes?: string[];
}

export interface CustomerPaymentInstrumentListOptions {
  /**
   * Starting record in zero-based dataset that should be returned as the first object in the array.
   * Default is 0.
   */
  offset?: number;

  /**
   * The maximum number that can be returned in the array starting from the offset record in zero-based dataset.
   * Default is 20, maximum is 100.
   */
  limit?: number;
}

export interface PaymentInstrumentListOptions {
  /**
   * Starting record in zero-based dataset that should be returned as the first object in the array.
   * Default is 0.
   */
  offset?: number;

  /**
   * The maximum number that can be returned in the array starting from the offset record in zero-based dataset.
   * Default is 20, maximum is 100.
   */
  limit?: number;
}

export interface PaymentInstrumentUpdateRequest {
  card?: Partial<CardInformation>;
  bankAccount?: Partial<BankAccountInformation>;
  billTo?: Partial<BillToInformation>;
  processingInformation?: Partial<ProcessingInformation>;
  default?: boolean;
  metadata?: Partial<Metadata>;
}

export interface InstrumentIdentifierListOptions {
  /**
   * Starting record in zero-based dataset that should be returned as the first object in the array.
   * Default is 0.
   */
  offset?: number;

  /**
   * The maximum number that can be returned in the array starting from the offset record in zero-based dataset.
   * Default is 20, maximum is 100.
   */
  limit?: number;
}

export interface InstrumentIdentifierPaymentInstrumentsListResponse {
  _links?: PaginationLinks;
  _embedded?: {
    paymentInstruments?: PaymentInstrumentResponse[];
  };
}

export interface InstrumentIdentifierEnrollmentResponse {
  id?: string;
  _links?: BaseLinks;
}

// Customer Payment Instrument Interfaces
export interface CustomerPaymentInstrumentRequest {
  default?: boolean;
  card?: CardInformation;
  bankAccount?: BankAccountInformation;
  billTo?: BillToInformation;
  processingInformation?: ProcessingInformation;
  instrumentIdentifier?: {
    id?: string;
  };
}

export interface CustomerPaymentInstrumentResponse {
  _links?: BaseLinks & {
    customer?: {
      href?: string;
    };
    instrumentIdentifier?: {
      href?: string;
    };
  };
  id?: string;
  object?: string;
  default?: boolean;
  state?: string;
  card?: CardInformation;
  bankAccount?: BankAccountInformation;
  billTo?: BillToInformation;
  instrumentIdentifier?: {
    id?: string;
    object?: string;
    state?: string;
  };
  processingInformation?: ProcessingInformation;
  metadata?: Metadata;
  _embedded?: {
    binLookup?: BinLookup;
  };
}

export interface CustomerPaymentInstrumentListResponse {
  _links?: PaginationLinks;
  count?: number;
  total?: number;
  _embedded?: {
    paymentInstruments?: CustomerPaymentInstrumentResponse[];
  };
}

export interface CustomerPaymentInstrumentUpdateRequest {
  default?: boolean;
  card?: CardInformation;
  bankAccount?: BankAccountInformation;
  billTo?: BillToInformation;
  processingInformation?: ProcessingInformation;
}

// Payment Instrument Interfaces
export interface PaymentInstrumentRequest {
  card?: CardInformation;
  bankAccount?: BankAccountInformation;
  billTo?: BillToInformation;
  processingInformation?: ProcessingInformation;
  instrumentIdentifier?: {
    id?: string;
  };
}

export interface PaymentInstrumentResponse {
  _links?: BaseLinks & {
    instrumentIdentifier?: {
      href?: string;
    };
  };
  id?: string;
  object?: string;
  state?: string;
  card?: CardInformation;
  bankAccount?: BankAccountInformation;
  billTo?: BillToInformation;
  instrumentIdentifier?: {
    id?: string;
    object?: string;
    state?: string;
  };
  processingInformation?: ProcessingInformation;
  metadata?: Metadata;
  _embedded?: {
    binLookup?: BinLookup;
  };
}

export interface PaymentInstrumentListResponse {
  _links?: PaginationLinks;
  count?: number;
  total?: number;
  _embedded?: {
    paymentInstruments?: PaymentInstrumentResponse[];
  };
}

// Instrument Identifier Interfaces
export interface TokenizedCardAsset {
  id?: string;
  _links?: {
    self?: {
      href?: string;
    };
  };
}

export interface TokenizedCardArt {
  foregroundColor?: string;
  combinedAsset?: TokenizedCardAsset;
  brandLogoAsset?: TokenizedCardAsset;
  issuerLogoAsset?: TokenizedCardAsset;
  iconAsset?: TokenizedCardAsset;
}

export interface TokenizedCardIssuer {
  name?: string;
  shortDescription?: string;
  longDescription?: string;
}

export interface TokenizedCardMetadata {
  cardArt?: TokenizedCardArt;
  issuer?: TokenizedCardIssuer;
}

export interface TokenizedCardPasscode {
  value?: string;
}

export interface TokenizedCard {
  _links?: BaseLinks;
  id?: string;
  object?: string;
  accountReferenceId?: string;
  consumerId?: string;
  createInstrumentIdentifier?: boolean;
  source?: string;
  state?: string;
  reason?: string;
  number?: string;
  expirationMonth?: string;
  expirationYear?: string;
  type?: string;
  cryptogram?: string;
  securityCode?: string;
  eci?: string;
  requestorId?: string;
  enrollmentId?: string;
  tokenReferenceId?: string;
  paymentAccountReference?: string;
  card?: CardInformation;
  passcode?: TokenizedCardPasscode;
  metadata?: TokenizedCardMetadata;
}

export interface InstrumentIdentifierIssuer {
  paymentAccountReference?: string;
}

export interface InstrumentIdentifierRequest {
  type?: string;
  tokenProvisioningInformation?: TokenProvisioningInformation;
  card?: CardInformation;
  bankAccount?: BankAccountInformation;
  tokenizedCard?: TokenizedCard;
  billTo?: BillToInformation;
  processingInformation?: ProcessingInformation;
}

export interface InstrumentIdentifierResponse {
  _links?: BaseLinks & {
    paymentInstruments?: {
      href?: string;
    };
  };
  id?: string;
  object?: string;
  state?: string;
  type?: string;
  tokenProvisioningInformation?: TokenProvisioningInformation;
  card?: CardInformation;
  bankAccount?: BankAccountInformation;
  tokenizedCard?: TokenizedCard;
  issuer?: InstrumentIdentifierIssuer;
  processingInformation?: ProcessingInformation;
  billTo?: BillToInformation;
  metadata?: Metadata;
  _embedded?: {
    binLookup?: BinLookup;
  };
}

export interface InstrumentIdentifierListResponse {
  _links?: PaginationLinks;
  count?: number;
  total?: number;
  _embedded?: {
    instrumentIdentifiers?: InstrumentIdentifierResponse[];
  };
}

export interface InstrumentIdentifierUpdateRequest {
  processingInformation?: ProcessingInformation;
}

export interface InstrumentIdentifierEnrollmentRequest {
  type?: string;
  tokenProvisioningInformation?: TokenProvisioningInformation;
  card?: CardInformation;
  billTo?: BillToInformation;
}

// Tokenized Card Interfaces
export interface TokenizedCardRequest {
  accountReferenceId?: string;
  consumerId?: string;
  createInstrumentIdentifier?: boolean;
  source?: string;
  type?: string;
  card?: CardInformation;
  passcode?: TokenizedCardPasscode;
}

export interface TokenizedCardResponse extends TokenizedCard {}

export interface TokenizedCardListResponse {
  _links?: PaginationLinks;
  count?: number;
  total?: number;
  _embedded?: {
    tokenizedCards?: TokenizedCardResponse[];
  };
}

// Query Parameters
export interface PaginationQueryParams {
  offset?: number;
  limit?: number;
}

export interface BinDetailsQueryParams {
  retrieveBinDetails?: boolean;
}

export interface PaymentInstrumentQueryParams
  extends PaginationQueryParams,
    BinDetailsQueryParams {}

// API Response Types
export interface PaymentInstrumentApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
}

// Error Response Interface
export interface PaymentInstrumentErrorDetail {
  name?: string;
  location?: string;
}

export interface PaymentInstrumentError {
  type?: string;
  message?: string;
  details?: PaymentInstrumentErrorDetail[];
}

export interface PaymentInstrumentErrorResponse {
  errors?: PaymentInstrumentError[];
}
