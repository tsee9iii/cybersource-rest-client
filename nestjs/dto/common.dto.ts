// Common DTOs for CyberSource API operations

export interface AmountDetailsDto {
  totalAmount: string;
  currency: string;
  taxAmount?: string;
}

export interface BillToDto {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  locality: string;
  administrativeArea: string;
  postalCode: string;
  country: string;
  email: string;
  phoneNumber?: string;
  company?: string;
}

export interface CardDto {
  number: string;
  expirationMonth: string;
  expirationYear: string;
  securityCode?: string;
  type?: string;
}

export interface PaymentInformationDto {
  card: CardDto;
}

export interface OrderInformationDto {
  amountDetails: AmountDetailsDto;
  billTo: BillToDto;
}

export interface ClientReferenceInformationDto {
  code: string;
  partner?: string;
  application?: string;
}

export interface ProcessingInformationDto {
  capture?: boolean;
  paymentSolution?: string;
  commerceIndicator?: string;
}
