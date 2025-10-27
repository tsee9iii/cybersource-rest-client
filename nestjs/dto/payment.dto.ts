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

// Note: Customer DTOs are defined in customer.dto.ts
// Import from there: CustomerCreateDto, CustomerUpdateDto, CustomerResponseDto, etc.

// Verification DTOs
export interface CardVerificationDto {
  clientReferenceInformation?: ClientReferenceInformationDto;
  paymentInformation: PaymentInformationDto;
  orderInformation?: {
    billTo: BillToDto;
  };
}
