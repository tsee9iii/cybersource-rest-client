import { Injectable } from "@nestjs/common";
import { PaymentService } from "../services/payment.service";
import { TokenService } from "../services/token.service";
import { VerificationService } from "../services/verification.service";
import {
  CreatePaymentDto,
  CreateTokenDto,
  CardVerificationDto,
} from "../dto/payment.dto";

@Injectable()
export class PaymentExampleService {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly tokenService: TokenService,
    private readonly verificationService: VerificationService
  ) {}

  /**
   * Example: Process a complete payment workflow
   */
  async processCompletePayment() {
    // Step 1: Verify card first
    const verification = await this.verificationService.quickCardVerification({
      cardNumber: "4111111111111111",
      expirationMonth: "12",
      expirationYear: "2031",
      cvv: "123",
      firstName: "John",
      lastName: "Doe",
      address: "123 Main St",
      city: "San Francisco",
      state: "CA",
      zipCode: "94105",
      country: "US",
    });

    if (!verification.success) {
      return { success: false, error: "Card verification failed" };
    }

    // Step 2: Process payment
    const payment = await this.paymentService.quickPayment({
      amount: "100.00",
      currency: "USD",
      cardNumber: "4111111111111111",
      expirationMonth: "12",
      expirationYear: "2031",
      cvv: "123",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      address: "123 Main St",
      city: "San Francisco",
      state: "CA",
      zipCode: "94105",
      country: "US",
      capture: true, // Immediate capture
    });

    return payment;
  }

  /**
   * Example: Authorization and capture workflow
   */
  async authAndCaptureWorkflow() {
    // Step 1: Authorize payment
    const authorization = await this.paymentService.authorizePayment({
      clientReferenceInformation: {
        code: `auth-${Date.now()}`,
      },
      processingInformation: {
        capture: false,
      },
      paymentInformation: {
        card: {
          number: "4111111111111111",
          expirationMonth: "12",
          expirationYear: "2031",
          securityCode: "123",
        },
      },
      orderInformation: {
        amountDetails: {
          totalAmount: "50.00",
          currency: "USD",
        },
        billTo: {
          firstName: "Jane",
          lastName: "Smith",
          email: "jane.smith@example.com",
          address1: "456 Oak Ave",
          locality: "Los Angeles",
          administrativeArea: "CA",
          postalCode: "90210",
          country: "US",
        },
      },
    });

    if (!authorization.success) {
      return authorization;
    }

    // Step 2: Capture the authorized amount
    const capture = await this.paymentService.capturePayment(
      authorization.data!.id,
      {
        orderInformation: {
          amountDetails: {
            totalAmount: "50.00",
            currency: "USD",
          },
        },
      }
    );

    return capture;
  }

  /**
   * Example: Token-based payment workflow
   */
  async tokenizedPaymentWorkflow() {
    // Step 1: Create customer
    const customer = await this.tokenService.createCustomer({
      clientReferenceInformation: {
        code: `customer-${Date.now()}`,
      },
      buyerInformation: {
        firstName: "Alice",
        lastName: "Johnson",
        email: "alice.johnson@example.com",
        address1: "789 Pine St",
        locality: "Seattle",
        administrativeArea: "WA",
        postalCode: "98101",
        country: "US",
      },
    });

    if (!customer.success) {
      return customer;
    }

    // Step 2: Create payment token
    const token = await this.tokenService.createPaymentInstrument(
      customer.data!.id,
      {
        paymentInformation: {
          card: {
            number: "4111111111111111",
            expirationMonth: "12",
            expirationYear: "2031",
          },
        },
      }
    );

    if (!token.success) {
      return token;
    }

    // Step 3: Use token for payment (this would use the tokenized card)
    // Note: This would require modifying the payment request to use the token
    return {
      success: true,
      data: {
        customer: customer.data,
        token: token.data,
        message: "Customer and token created successfully",
      },
    };
  }

  /**
   * Example: Refund workflow
   */
  async processRefund(paymentId: string, refundAmount?: string) {
    const refund = await this.paymentService.refundPayment(paymentId, {
      orderInformation: refundAmount
        ? {
            amountDetails: {
              totalAmount: refundAmount,
              currency: "USD",
            },
          }
        : undefined,
      reason: "Customer request",
    });

    return refund;
  }

  /**
   * Example: Card validation utilities
   */
  async validateCardDetails(cardNumber: string, month: string, year: string) {
    const isValidNumber =
      this.verificationService.validateCardNumber(cardNumber);
    const isValidExpiry = this.verificationService.validateExpirationDate(
      month,
      year
    );
    const cardType = this.verificationService.identifyCardType(cardNumber);

    return {
      isValidNumber,
      isValidExpiry,
      cardType,
      isValid: isValidNumber && isValidExpiry,
    };
  }
}
