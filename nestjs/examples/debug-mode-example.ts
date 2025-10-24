import { Module, Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { CyberSourceModule, CyberSourceService } from "../index";

/**
 * Example demonstrating how to use debug mode for troubleshooting
 * CyberSource API integration issues.
 */

@Module({
  imports: [
    CyberSourceModule.forRoot({
      merchantId: process.env.CYBERSOURCE_MERCHANT_ID || "your-merchant-id",
      apiKey: process.env.CYBERSOURCE_API_KEY || "your-api-key",
      sharedSecretKey:
        process.env.CYBERSOURCE_SHARED_SECRET || "your-shared-secret",
      sandbox: true,
      debug: true, // Enable debug mode to see detailed request/response logs
    }),
  ],
})
class TestModule {}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(TestModule, {
    logger: ["error", "warn", "log", "debug"], // Enable debug logging
  });

  const cyberSource = app.get(CyberSourceService);
  const logger = new Logger("DebugExample");

  try {
    logger.log("Creating a test payment with debug mode enabled...");
    logger.log("Watch the console for detailed request/response information");

    // Example: Create a payment
    const paymentRequest = {
      clientReferenceInformation: {
        code: `test-${Date.now()}`,
      },
      processingInformation: {
        capture: false,
      },
      paymentInformation: {
        card: {
          number: "4111111111111111",
          expirationMonth: "12",
          expirationYear: "2025",
          securityCode: "123",
        },
      },
      orderInformation: {
        amountDetails: {
          totalAmount: "10.00",
          currency: "USD",
        },
        billTo: {
          firstName: "John",
          lastName: "Doe",
          address1: "1 Market St",
          locality: "San Francisco",
          administrativeArea: "CA",
          postalCode: "94105",
          country: "US",
          email: "test@example.com",
          phoneNumber: "4158880000",
        },
      },
    };

    const result = await cyberSource.createPayment(paymentRequest);

    logger.log("Payment created successfully!");
    logger.log(`Payment ID: ${result.id}`);
    logger.log(`Status: ${result.status}`);
  } catch (error) {
    logger.error(
      "Payment failed:",
      error instanceof Error ? error.message : String(error)
    );
    if (error && typeof error === "object" && "response" in error) {
      const apiError = error as any;
      logger.error(`Status: ${apiError.response.status}`);
      logger.error(`Body:`, apiError.response.data);
    }
  }

  await app.close();
}

bootstrap();
