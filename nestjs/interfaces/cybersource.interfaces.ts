/**
 * Common interfaces for CyberSource integration
 */

export interface PaymentResult {
  id?: string;
  status?: string;
  submitTimeUtc?: string;
  processingInformation?: any;
  paymentInformation?: any;
  orderInformation?: any;
  errorInformation?: any;
}

export interface CaptureResult {
  id?: string;
  status?: string;
  submitTimeUtc?: string;
  processingInformation?: any;
  paymentInformation?: any;
  orderInformation?: any;
  errorInformation?: any;
}

export interface RefundResult {
  id?: string;
  status?: string;
  submitTimeUtc?: string;
  processingInformation?: any;
  paymentInformation?: any;
  orderInformation?: any;
  errorInformation?: any;
}

export interface VoidResult {
  id?: string;
  status?: string;
  submitTimeUtc?: string;
  processingInformation?: any;
  paymentInformation?: any;
  orderInformation?: any;
  errorInformation?: any;
}

export interface CyberSourceError {
  status?: number;
  reason?: string;
  message?: string;
  details?: any[];
}

export interface TransactionInfo {
  id: string;
  referenceNumber?: string;
  submitTime: Date;
  amount: number;
  currency: string;
  status: string;
  processorInformation?: any;
}
