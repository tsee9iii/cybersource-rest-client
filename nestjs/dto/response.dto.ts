// CyberSource Response DTOs

export interface PaymentStatus {
  status: string;
  reason?: string;
  message?: string;
}

export interface ProcessorInformation {
  approvalCode?: string;
  networkTransactionId?: string;
  transactionId?: string;
  responseCode?: string;
  responseDetails?: string;
  avs?: {
    code?: string;
    codeRaw?: string;
  };
  cardVerification?: {
    resultCode?: string;
    resultCodeRaw?: string;
  };
}

export interface ApplicationInformation {
  status?: string;
  reasonCode?: string;
  rCode?: string;
  rFlag?: string;
  rMsg?: string;
  applications?: Array<{
    name: string;
    status: string;
    reasonCode?: string;
    rCode?: string;
    rFlag?: string;
    rMsg?: string;
  }>;
}

export interface OrderInformationResponse {
  amountDetails?: {
    totalAmount?: string;
    authorizedAmount?: string;
    currency?: string;
  };
}

export interface PaymentAccountInformation {
  card?: {
    type?: string;
    suffix?: string;
  };
}

export interface PaymentInformationResponse {
  tokenizedCard?: {
    type?: string;
    suffix?: string;
  };
  accountFeatures?: {
    balanceAmount?: string;
    balanceAmountType?: string;
    currency?: string;
  };
}

export interface BasePaymentResponse {
  id: string;
  submitTimeUtc: string;
  status: string;
  reconciliationId?: string;
  clientReferenceInformation?: {
    code?: string;
    partner?: string;
    application?: string;
  };
  processorInformation?: ProcessorInformation;
  paymentInformation?: PaymentInformationResponse;
  paymentAccountInformation?: PaymentAccountInformation;
  orderInformation?: OrderInformationResponse;
  _links?: {
    self?: { href: string };
    capture?: { href: string };
    void?: { href: string };
    refund?: { href: string };
  };
}

export interface CreatePaymentResponse extends BasePaymentResponse {
  applicationInformation?: ApplicationInformation;
  pointOfSaleInformation?: {
    terminalId?: string;
  };
  issuerInformation?: {
    discretionaryData?: string;
  };
}

export interface CapturePaymentResponse extends BasePaymentResponse {
  applicationInformation?: ApplicationInformation;
}

export interface RefundPaymentResponse extends BasePaymentResponse {
  applicationInformation?: ApplicationInformation;
  refundAmountDetails?: {
    refundAmount?: string;
    currency?: string;
  };
}

export interface VoidPaymentResponse extends BasePaymentResponse {
  applicationInformation?: ApplicationInformation;
}

export interface TokenResponse {
  id: string;
  paymentInformation?: {
    tokenizedCard?: {
      type?: string;
      number?: string;
      expirationMonth?: string;
      expirationYear?: string;
    };
  };
  _links?: {
    self?: { href: string };
  };
}

export interface CustomerResponse {
  id: string;
  defaultPaymentInstrument?: {
    id: string;
  };
  clientReferenceInformation?: {
    code?: string;
  };
  _links?: {
    self?: { href: string };
    paymentInstruments?: { href: string };
  };
}

export interface ErrorInformation {
  reason: string;
  message: string;
  details?: Array<{
    field: string;
    reason: string;
  }>;
}

export interface CyberSourceErrorResponse {
  submitTimeUtc: string;
  status: string;
  reason: string;
  message: string;
  correlationId?: string;
  details?: Array<{
    field: string;
    reason: string;
  }>;
}
