import { Injectable, Logger } from '@nestjs/common';
import { CyberSourceService } from '../cybersource.service';
import { 
  CreatePaymentDto, 
  CapturePaymentDto, 
  RefundPaymentDto, 
  VoidPaymentDto, 
  IncrementAuthDto,
  AuthorizationDto,
  SaleDto
} from '../dto/payment.dto';
import { 
  CreatePaymentResponse, 
  CapturePaymentResponse, 
  RefundPaymentResponse, 
  VoidPaymentResponse,
  CyberSourceErrorResponse
} from '../dto/response.dto';

export interface CyberSourceResult<T> {
  success: boolean;
  data?: T;
  error?: CyberSourceErrorResponse;
}

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(private readonly cyberSource: CyberSourceService) {}

  /**
   * Create a payment (authorization + capture)
   */
  async createPayment(request: CreatePaymentDto): Promise<CyberSourceResult<CreatePaymentResponse>> {
    try {
      this.logger.log('Creating payment', {
        amount: request.orderInformation.amountDetails.totalAmount,
        currency: request.orderInformation.amountDetails.currency,
        referenceCode: request.clientReferenceInformation.code
      });

      const response = await this.cyberSource.createPayment(request);
      
      this.logger.log('Payment created successfully', {
        id: response.id,
        status: response.status
      });

      return {
        success: true,
        data: response as CreatePaymentResponse
      };
    } catch (error: any) {
      this.logger.error('Payment creation failed', {
        error: error.message,
        request: this.sanitizeRequestForLogging(request)
      });

      return {
        success: false,
        error: this.parseError(error)
      };
    }
  }

  /**
   * Create an authorization (capture = false)
   */
  async authorizePayment(request: AuthorizationDto): Promise<CyberSourceResult<CreatePaymentResponse>> {
    const authRequest = {
      ...request,
      processingInformation: {
        ...request.processingInformation,
        capture: false
      }
    };

    return this.createPayment(authRequest);
  }

  /**
   * Create a sale (capture = true)
   */
  async salePayment(request: SaleDto): Promise<CyberSourceResult<CreatePaymentResponse>> {
    const saleRequest = {
      ...request,
      processingInformation: {
        ...request.processingInformation,
        capture: true
      }
    };

    return this.createPayment(saleRequest);
  }

  /**
   * Capture an authorized payment
   */
  async capturePayment(paymentId: string, request: CapturePaymentDto): Promise<CyberSourceResult<CapturePaymentResponse>> {
    try {
      this.logger.log('Capturing payment', { 
        paymentId,
        amount: request.orderInformation?.amountDetails?.totalAmount 
      });

      const response = await this.cyberSource.capturePayment(paymentId, request);
      
      this.logger.log('Payment captured successfully', {
        id: response.id,
        status: response.status
      });

      return {
        success: true,
        data: response as CapturePaymentResponse
      };
    } catch (error: any) {
      this.logger.error('Payment capture failed', {
        paymentId,
        error: error.message
      });

      return {
        success: false,
        error: this.parseError(error)
      };
    }
  }

  /**
   * Refund a payment
   */
  async refundPayment(paymentId: string, request: RefundPaymentDto): Promise<CyberSourceResult<RefundPaymentResponse>> {
    try {
      this.logger.log('Refunding payment', { 
        paymentId,
        amount: request.orderInformation?.amountDetails?.totalAmount,
        reason: request.reason
      });

      const response = await this.cyberSource.refundPayment(paymentId, request);
      
      this.logger.log('Payment refunded successfully', {
        id: response.id,
        status: response.status
      });

      return {
        success: true,
        data: response as RefundPaymentResponse
      };
    } catch (error: any) {
      this.logger.error('Payment refund failed', {
        paymentId,
        error: error.message
      });

      return {
        success: false,
        error: this.parseError(error)
      };
    }
  }

  /**
   * Void a payment
   */
  async voidPayment(paymentId: string, request: VoidPaymentDto): Promise<CyberSourceResult<VoidPaymentResponse>> {
    try {
      this.logger.log('Voiding payment', { 
        paymentId,
        reason: request.reason 
      });

      const response = await this.cyberSource.voidPayment(paymentId, request);
      
      this.logger.log('Payment voided successfully', {
        id: response.id,
        status: response.status
      });

      return {
        success: true,
        data: response as VoidPaymentResponse
      };
    } catch (error: any) {
      this.logger.error('Payment void failed', {
        paymentId,
        error: error.message
      });

      return {
        success: false,
        error: this.parseError(error)
      };
    }
  }

  /**
   * Increment authorization amount
   */
  async incrementAuth(paymentId: string, request: IncrementAuthDto): Promise<CyberSourceResult<CreatePaymentResponse>> {
    try {
      this.logger.log('Incrementing authorization', { 
        paymentId,
        newAmount: request.orderInformation.amountDetails.totalAmount
      });

      const response = await this.cyberSource.apiClient.pts.incrementAuth(paymentId, request);
      
      this.logger.log('Authorization incremented successfully', {
        id: response.data.id,
        status: response.data.status
      });

      return {
        success: true,
        data: response.data as CreatePaymentResponse
      };
    } catch (error: any) {
      this.logger.error('Authorization increment failed', {
        paymentId,
        error: error.message
      });

      return {
        success: false,
        error: this.parseError(error)
      };
    }
  }

  /**
   * Helper method to create a quick payment with minimal data
   */
  async quickPayment(options: {
    amount: string;
    currency: string;
    cardNumber: string;
    expirationMonth: string;
    expirationYear: string;
    cvv: string;
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    capture?: boolean;
    referenceCode?: string;
  }): Promise<CyberSourceResult<CreatePaymentResponse>> {
    const request: CreatePaymentDto = {
      clientReferenceInformation: {
        code: options.referenceCode || `payment-${Date.now()}`
      },
      processingInformation: {
        capture: options.capture ?? true
      },
      paymentInformation: {
        card: {
          number: options.cardNumber,
          expirationMonth: options.expirationMonth,
          expirationYear: options.expirationYear,
          securityCode: options.cvv
        }
      },
      orderInformation: {
        amountDetails: {
          totalAmount: options.amount,
          currency: options.currency
        },
        billTo: {
          firstName: options.firstName,
          lastName: options.lastName,
          email: options.email,
          address1: options.address,
          locality: options.city,
          administrativeArea: options.state,
          postalCode: options.zipCode,
          country: options.country
        }
      }
    };

    return this.createPayment(request);
  }

  private sanitizeRequestForLogging(request: any): any {
    const sanitized = { ...request };
    
    // Remove sensitive card information from logs
    if (sanitized.paymentInformation?.card) {
      sanitized.paymentInformation.card = {
        ...sanitized.paymentInformation.card,
        number: sanitized.paymentInformation.card.number ? 
          `****${sanitized.paymentInformation.card.number.slice(-4)}` : 
          undefined,
        securityCode: sanitized.paymentInformation.card.securityCode ? '***' : undefined
      };
    }
    
    return sanitized;
  }

  private parseError(error: any): CyberSourceErrorResponse {
    if (error.response?.data) {
      return error.response.data;
    }

    return {
      submitTimeUtc: new Date().toISOString(),
      status: 'ERROR',
      reason: 'SYSTEM_ERROR',
      message: error.message || 'An unexpected error occurred'
    };
  }
}