import { Injectable, Logger } from '@nestjs/common';
import { CyberSourceService } from '../cybersource.service';
import { CardVerificationDto } from '../dto/payment.dto';
import { CyberSourceErrorResponse } from '../dto/response.dto';
import { CyberSourceResult } from './payment.service';

export interface VerificationResponse {
  id: string;
  status: string;
  submitTimeUtc: string;
  clientReferenceInformation?: {
    code?: string;
  };
  processorInformation?: {
    approvalCode?: string;
    responseCode?: string;
    avs?: {
      code?: string;
      codeRaw?: string;
    };
    cardVerification?: {
      resultCode?: string;
      resultCodeRaw?: string;
    };
  };
}

@Injectable()
export class VerificationService {
  private readonly logger = new Logger(VerificationService.name);

  constructor(private readonly cyberSource: CyberSourceService) {}

  /**
   * Verify card information without processing payment
   */
  async verifyCard(request: CardVerificationDto): Promise<CyberSourceResult<VerificationResponse>> {
    try {
      this.logger.log('Verifying card', {
        referenceCode: request.clientReferenceInformation?.code
      });

      // Use the payments API with a $0 verification transaction
      const verificationRequest = {
        ...request,
        processingInformation: {
          capture: false
        },
        orderInformation: {
          ...request.orderInformation,
          amountDetails: {
            totalAmount: '0.00',
            currency: 'USD'
          }
        }
      };
      
      const response = await this.cyberSource.apiClient.pts.createPayment(verificationRequest);
      
      this.logger.log('Card verification completed', {
        id: response.data.id,
        status: response.data.status
      });

      return {
        success: true,
        data: response.data as VerificationResponse
      };
    } catch (error: any) {
      this.logger.error('Card verification failed', {
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
   * Perform Address Verification Service (AVS) check
   */
  async verifyAddress(request: CardVerificationDto): Promise<CyberSourceResult<VerificationResponse>> {
    // AVS verification is typically part of card verification
    return this.verifyCard(request);
  }

  /**
   * Perform CVV verification
   */
  async verifyCVV(request: CardVerificationDto): Promise<CyberSourceResult<VerificationResponse>> {
    // CVV verification is typically part of card verification
    return this.verifyCard(request);
  }

  /**
   * Quick card verification with minimal data
   */
  async quickCardVerification(options: {
    cardNumber: string;
    expirationMonth: string;
    expirationYear: string;
    cvv?: string;
    firstName?: string;
    lastName?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    referenceCode?: string;
  }): Promise<CyberSourceResult<VerificationResponse>> {
    const request: CardVerificationDto = {
      clientReferenceInformation: {
        code: options.referenceCode || `verify-${Date.now()}`
      },
      paymentInformation: {
        card: {
          number: options.cardNumber,
          expirationMonth: options.expirationMonth,
          expirationYear: options.expirationYear,
          securityCode: options.cvv
        }
      }
    };

    // Add billing information if provided
    if (options.firstName || options.lastName || options.address) {
      request.orderInformation = {
        billTo: {
          firstName: options.firstName || '',
          lastName: options.lastName || '',
          address1: options.address || '',
          locality: options.city || '',
          administrativeArea: options.state || '',
          postalCode: options.zipCode || '',
          country: options.country || 'US',
          email: 'test@example.com' // Required field
        }
      };
    }

    return this.verifyCard(request);
  }

  /**
   * Check if a card number passes Luhn algorithm validation
   */
  validateCardNumber(cardNumber: string): boolean {
    // Remove spaces and non-digits
    const cleanNumber = cardNumber.replace(/\D/g, '');
    
    if (cleanNumber.length < 13 || cleanNumber.length > 19) {
      return false;
    }

    // Luhn algorithm
    let sum = 0;
    let alternate = false;

    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanNumber.charAt(i), 10);

      if (alternate) {
        digit *= 2;
        if (digit > 9) {
          digit = (digit % 10) + 1;
        }
      }

      sum += digit;
      alternate = !alternate;
    }

    return sum % 10 === 0;
  }

  /**
   * Identify card type from card number
   */
  identifyCardType(cardNumber: string): string {
    const cleanNumber = cardNumber.replace(/\D/g, '');
    
    const patterns = {
      visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
      mastercard: /^5[1-5][0-9]{14}$|^2(?:2(?:2[1-9]|[3-9][0-9])|[3-6][0-9][0-9]|7(?:[01][0-9]|20))[0-9]{12}$/,
      amex: /^3[47][0-9]{13}$/,
      discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
      diners: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
      jcb: /^(?:2131|1800|35\d{3})\d{11}$/
    };

    for (const [type, pattern] of Object.entries(patterns)) {
      if (pattern.test(cleanNumber)) {
        return type;
      }
    }

    return 'unknown';
  }

  /**
   * Validate expiration date
   */
  validateExpirationDate(month: string, year: string): boolean {
    const expMonth = parseInt(month, 10);
    const expYear = parseInt(year, 10);
    
    if (expMonth < 1 || expMonth > 12) {
      return false;
    }
    
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    
    // Handle 2-digit years
    const fullYear = expYear < 100 ? 2000 + expYear : expYear;
    
    if (fullYear < currentYear) {
      return false;
    }
    
    if (fullYear === currentYear && expMonth < currentMonth) {
      return false;
    }
    
    return true;
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