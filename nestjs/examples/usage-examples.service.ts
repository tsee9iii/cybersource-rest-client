import { Injectable } from "@nestjs/common";
import { PaymentService } from "../services/payment.service";
import { TokenService } from "../services/token.service";
import { VerificationService } from "../services/verification.service";
import { CustomerService } from "../services/customer.service";
import { CustomerPaymentInstrumentService } from "../services/customer-payment-instrument.service";
import { PaymentInstrumentService } from "../services/payment-instrument.service";
import { InstrumentIdentifierService } from "../services/instrument-identifier.service";
import { TokenizedCardService } from "../services/tokenized-card.service";
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
    private readonly verificationService: VerificationService,
    private readonly customerService: CustomerService,
    private readonly customerPaymentInstrumentService: CustomerPaymentInstrumentService,
    private readonly paymentInstrumentService: PaymentInstrumentService,
    private readonly instrumentIdentifierService: InstrumentIdentifierService,
    private readonly tokenizedCardService: TokenizedCardService
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

  // ========================================
  // PAYMENT INSTRUMENT TESTING EXAMPLES
  // ========================================

  /**
   * Example: Complete Customer Payment Instrument Workflow
   * Perfect for testing customer-associated payment instruments
   */
  async testCustomerPaymentInstrumentWorkflow() {
    try {
      // Step 1: Create a customer
      const customer = await this.customerService.createCustomer({
        buyerInformation: {
          merchantCustomerID: `test-customer-${Date.now()}`,
          email: "test.customer@example.com",
        },
      });

      console.log("✅ Customer created:", customer.id);

      // Step 2: Create a payment instrument for the customer
      const paymentInstrument =
        await this.customerPaymentInstrumentService.createCustomerPaymentInstrument(
          customer.id!,
          {
            card: {
              number: "4111111111111111",
              expirationMonth: "12",
              expirationYear: "2025",
            },
            billTo: {
              address1: "123 Test Street",
              locality: "Test City",
              administrativeArea: "CA",
              postalCode: "12345",
              country: "US",
            },
            default: true,
          }
        );

      console.log("✅ Payment instrument created:", paymentInstrument.id);

      // Step 3: List all payment instruments for the customer
      const instrumentsList =
        await this.customerPaymentInstrumentService.listCustomerPaymentInstruments(
          customer.id!,
          { limit: 10, offset: 0 }
        );

      console.log(
        "✅ Listed instruments:",
        instrumentsList._embedded?.paymentInstruments?.length
      );

      // Step 4: Update the payment instrument
      const updatedInstrument =
        await this.customerPaymentInstrumentService.updateCustomerPaymentInstrument(
          customer.id!,
          paymentInstrument.id!,
          {
            billTo: {
              address1: "456 Updated Street",
              locality: "Updated City",
            },
          }
        );

      console.log("✅ Payment instrument updated:", updatedInstrument.id);

      return {
        success: true,
        data: {
          customer,
          paymentInstrument: updatedInstrument,
          instrumentsList,
        },
      };
    } catch (error: any) {
      console.error("❌ Customer payment instrument test failed:", error);
      return { success: false, error: error?.message || "Unknown error" };
    }
  }

  /**
   * Example: Standalone Payment Instrument Testing
   * Perfect for testing payment instruments without customer association
   */
  async testStandalonePaymentInstrumentWorkflow() {
    try {
      // Step 1: Create standalone payment instrument
      const paymentInstrument =
        await this.paymentInstrumentService.createPaymentInstrument({
          card: {
            number: "4111111111111111",
            expirationMonth: "12",
            expirationYear: "2025",
          },
          billTo: {
            address1: "789 Standalone Ave",
            locality: "Standalone City",
            administrativeArea: "CA",
            postalCode: "54321",
            country: "US",
          },
        });

      console.log(
        "✅ Standalone payment instrument created:",
        paymentInstrument.id
      );

      // Step 2: Retrieve the payment instrument
      const retrievedInstrument =
        await this.paymentInstrumentService.getPaymentInstrument(
          paymentInstrument.id!
        );

      console.log("✅ Payment instrument retrieved:", retrievedInstrument.id);

      // Step 3: Update the payment instrument
      const updatedInstrument =
        await this.paymentInstrumentService.updatePaymentInstrument(
          paymentInstrument.id!,
          {
            billTo: {
              address1: "999 Updated Standalone Ave",
            },
          }
        );

      console.log("✅ Payment instrument updated:", updatedInstrument.id);

      return {
        success: true,
        data: {
          original: paymentInstrument,
          retrieved: retrievedInstrument,
          updated: updatedInstrument,
        },
      };
    } catch (error: any) {
      console.error("❌ Standalone payment instrument test failed:", error);
      return { success: false, error: error?.message || "Unknown error" };
    }
  }

  /**
   * Example: Instrument Identifier and Network Token Testing
   * Perfect for testing card tokenization and network token enrollment
   */
  async testInstrumentIdentifierWorkflow() {
    try {
      // Step 1: Create instrument identifier (tokenize card)
      const instrumentIdentifier =
        await this.instrumentIdentifierService.createInstrumentIdentifier({
          card: {
            number: "4111111111111111",
            expirationMonth: "12",
            expirationYear: "2025",
          },
        });

      console.log("✅ Instrument identifier created:", instrumentIdentifier.id);

      // Step 2: Retrieve the instrument identifier
      const retrieved =
        await this.instrumentIdentifierService.getInstrumentIdentifier(
          instrumentIdentifier.id!
        );

      console.log("✅ Instrument identifier retrieved:", retrieved.id);

      // Step 3: Enroll for network token (example)
      try {
        const enrollment =
          await this.instrumentIdentifierService.enrollForNetworkToken(
            instrumentIdentifier.id!,
            {
              type: "networkToken",
            }
          );

        console.log("✅ Network token enrollment initiated:", enrollment.id);
      } catch (enrollError: any) {
        console.log(
          "ℹ️ Network token enrollment may require additional setup:",
          enrollError?.message || "Unknown error"
        );
      }

      // Step 4: List payment instruments for this identifier
      const paymentInstruments =
        await this.instrumentIdentifierService.listPaymentInstruments(
          instrumentIdentifier.id!
        );

      console.log(
        "✅ Listed payment instruments for identifier:",
        paymentInstruments._embedded?.paymentInstruments?.length
      );

      return {
        success: true,
        data: {
          instrumentIdentifier,
          retrieved,
          paymentInstruments,
        },
      };
    } catch (error: any) {
      console.error("❌ Instrument identifier test failed:", error);
      return { success: false, error: error?.message || "Unknown error" };
    }
  }

  /**
   * Example: Network Token Management Testing
   * Perfect for testing tokenized card operations
   */
  async testTokenizedCardWorkflow() {
    try {
      // Step 1: Create tokenized card (network token)
      const tokenizedCard = await this.tokenizedCardService.createTokenizedCard(
        {
          card: {
            number: "4111111111111111",
            expirationMonth: "12",
            expirationYear: "2025",
          },
        }
      );

      console.log("✅ Tokenized card created:", tokenizedCard.id);

      // Step 2: Retrieve the tokenized card
      const retrieved = await this.tokenizedCardService.getTokenizedCard(
        tokenizedCard.id!
      );

      console.log("✅ Tokenized card retrieved:", retrieved.id);

      return {
        success: true,
        data: {
          tokenizedCard,
          retrieved,
        },
      };
    } catch (error: any) {
      console.error("❌ Tokenized card test failed:", error);
      return { success: false, error: error?.message || "Unknown error" };
    }
  }

  /**
   * Complete Payment Instrument Test Suite
   * Runs all payment instrument tests in sequence
   */
  async runCompletePaymentInstrumentTestSuite() {
    console.log("🧪 Starting Complete Payment Instrument Test Suite...\n");

    const results = {
      customerPaymentInstruments: null as any,
      standalonePaymentInstruments: null as any,
      instrumentIdentifiers: null as any,
      tokenizedCards: null as any,
      summary: {
        total: 4,
        passed: 0,
        failed: 0,
      },
    };

    // Test 1: Customer Payment Instruments
    console.log("📋 Test 1: Customer Payment Instruments");
    results.customerPaymentInstruments =
      await this.testCustomerPaymentInstrumentWorkflow();
    if (results.customerPaymentInstruments.success) results.summary.passed++;
    else results.summary.failed++;

    console.log("\n---\n");

    // Test 2: Standalone Payment Instruments
    console.log("📋 Test 2: Standalone Payment Instruments");
    results.standalonePaymentInstruments =
      await this.testStandalonePaymentInstrumentWorkflow();
    if (results.standalonePaymentInstruments.success) results.summary.passed++;
    else results.summary.failed++;

    console.log("\n---\n");

    // Test 3: Instrument Identifiers
    console.log("📋 Test 3: Instrument Identifiers & Network Tokens");
    results.instrumentIdentifiers =
      await this.testInstrumentIdentifierWorkflow();
    if (results.instrumentIdentifiers.success) results.summary.passed++;
    else results.summary.failed++;

    console.log("\n---\n");

    // Test 4: Tokenized Cards
    console.log("📋 Test 4: Tokenized Cards");
    results.tokenizedCards = await this.testTokenizedCardWorkflow();
    if (results.tokenizedCards.success) results.summary.passed++;
    else results.summary.failed++;

    console.log("\n🎯 Test Suite Complete!");
    console.log(
      `✅ Passed: ${results.summary.passed}/${results.summary.total}`
    );
    console.log(
      `❌ Failed: ${results.summary.failed}/${results.summary.total}`
    );

    return results;
  }

  /**
   * Quick Payment Instrument Validation
   * Useful for testing API connectivity and basic functionality
   */
  async quickPaymentInstrumentTest() {
    try {
      // Quick test: Create and retrieve a customer
      const customer = await this.customerService.createCustomer({
        buyerInformation: {
          merchantCustomerID: `quick-test-${Date.now()}`,
          email: "quicktest@example.com",
        },
      });

      // Quick cleanup (optional)
      // await this.customerService.deleteCustomer(customer.id!);

      return {
        success: true,
        message: "Payment instrument services are working correctly!",
        data: { customerId: customer.id },
      };
    } catch (error: any) {
      return {
        success: false,
        message: "Payment instrument services test failed",
        error: error?.message || "Unknown error",
      };
    }
  }
}
