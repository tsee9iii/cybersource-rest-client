import {
  AmountDetailsDto,
  BillToDto,
  CardDto,
  PaymentInformationDto,
  OrderInformationDto,
  ClientReferenceInformationDto,
  ProcessingInformationDto,
} from "./common.dto";

// Payment Request DTOs
export interface CreatePaymentDto {
  clientReferenceInformation: ClientReferenceInformationDto;
  processingInformation: ProcessingInformationDto;
  paymentInformation: PaymentInformationDto;
  orderInformation: OrderInformationDto;
}

export interface CapturePaymentDto {
  clientReferenceInformation?: ClientReferenceInformationDto;
  orderInformation?: {
    amountDetails: AmountDetailsDto;
  };
}

export interface RefundPaymentDto {
  clientReferenceInformation?: ClientReferenceInformationDto;
  orderInformation?: {
    amountDetails: AmountDetailsDto;
  };
  reason?: string;
}

export interface VoidPaymentDto {
  clientReferenceInformation?: ClientReferenceInformationDto;
  reason?: string;
}

export interface IncrementAuthDto {
  clientReferenceInformation?: ClientReferenceInformationDto;
  orderInformation: {
    amountDetails: AmountDetailsDto;
  };
}

// Authorization specific DTOs
export interface AuthorizationDto extends CreatePaymentDto {
  processingInformation: ProcessingInformationDto & {
    capture: false;
  };
}

export interface SaleDto extends CreatePaymentDto {
  processingInformation: ProcessingInformationDto & {
    capture: true;
  };
}

// Token Management DTOs
export interface CreateTokenDto {
  clientReferenceInformation?: ClientReferenceInformationDto;
  paymentInformation: PaymentInformationDto;
}

export interface CreateCustomerDto {
  /**
   * The Id of the Customer Token.
   * If not provided, CyberSource will generate one.
   * @minLength 1
   * @maxLength 32
   */
  id?: string;
  clientReferenceInformation?: ClientReferenceInformationDto;
  buyerInformation?: {
    /**
     * Your identifier for the customer.
     * @maxLength 100
     */
    merchantCustomerID?: string;
    /**
     * Customer's primary email address, including the full domain name.
     * @maxLength 255
     */
    email?: string;
  };
  objectInformation?: {
    /**
     * Name or title of the customer.
     * @maxLength 60
     */
    title?: string;
    /**
     * Comments that you can make about the customer.
     * @maxLength 150
     */
    comment?: string;
  };
  merchantDefinedInformation?: Array<{
    /**
     * Possible values: data1, data2, data3, data4, sensitive1, sensitive2, sensitive3, sensitive4
     */
    name?: string;
    /**
     * The value for your merchant-defined data field.
     * @maxLength 100
     */
    value?: string;
  }>;
  defaultPaymentInstrument?: {
    /** The Id of the Customers default Payment Instrument */
    id?: string;
  };
  defaultShippingAddress?: {
    /** The Id of the Customers default Shipping Address */
    id?: string;
  };
}

// Verification DTOs
export interface CardVerificationDto {
  clientReferenceInformation?: ClientReferenceInformationDto;
  paymentInformation: PaymentInformationDto;
  orderInformation?: {
    billTo: BillToDto;
  };
}
