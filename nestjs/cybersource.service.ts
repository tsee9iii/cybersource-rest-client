import { Injectable, Inject, Logger } from "@nestjs/common";
import { Api } from "@infinitesolutions/cybersource-rest-client";
import { CyberSourceConfig } from "./cybersource.config";
import { CyberSourceAuthUtil } from "./utils/cybersource-auth.util";

// Import our DTOs for type safety
import {
  CreatePaymentDto,
  CapturePaymentDto,
  RefundPaymentDto,
  VoidPaymentDto,
} from "./dto/payment.dto";

// Legacy type exports for backward compatibility
export type CreatePaymentRequest = CreatePaymentDto;
export type CapturePaymentRequest = CapturePaymentDto;
export type RefundPaymentRequest = RefundPaymentDto;
export type VoidPaymentRequest = VoidPaymentDto;

@Injectable()
export class CyberSourceService {
  private readonly logger = new Logger(CyberSourceService.name);
  private readonly api: Api<unknown>;

  constructor(
    @Inject("CYBERSOURCE_CONFIG") private readonly config: CyberSourceConfig
  ) {
    const baseUrl =
      config.sandbox !== false
        ? config.basePath || "https://apitest.cybersource.com"
        : "https://api.cybersource.com";

    // Initialize the single API instance with HTTP Signature authentication
    this.api = new Api({
      baseUrl,
      // Configure HTTP Signature authentication
      securityWorker: () => {
        // Note: The actual signature generation happens per-request in the custom fetch
        // This securityWorker is called for each request automatically
        return {};
      },
      // Custom fetch implementation with CyberSource authentication
      customFetch: async (
        input: string | URL | Request,
        init?: RequestInit
      ) => {
        const url = typeof input === "string" ? input : input.toString();
        const method = init?.method || "GET";
        let body = init?.body;
        let bodyForDigest: string | undefined;

        // Stringify body for digest calculation if needed
        if (body && typeof body !== "string" && !(body instanceof FormData)) {
          bodyForDigest = JSON.stringify(body);
          // Keep body as object - let the API client handle stringification
        } else if (typeof body === "string") {
          bodyForDigest = body;
        }

        // Extract host and path from the full URL
        const host = CyberSourceAuthUtil.extractHost(baseUrl);
        const path = CyberSourceAuthUtil.extractPath(url);

        // Generate authentication headers
        const authHeaders = CyberSourceAuthUtil.generateAuthHeaders({
          merchantId: this.config.merchantId,
          apiKey: this.config.apiKey,
          sharedSecretKey: this.config.sharedSecretKey,
          method,
          path,
          body: bodyForDigest, // Pass the stringified version for digest
          host,
        });

        // Merge authentication headers with existing headers
        const headers = {
          ...init?.headers,
          ...authHeaders,
          // Ensure Content-Type is set (case-sensitive for some systems)
          "Content-Type": authHeaders["content-type"],
        };

        // Log authentication headers in debug mode (without sensitive data)
        this.logger.debug("CyberSource request authentication", {
          method,
          path,
          merchantId: this.config.merchantId,
          hasDigest: !!authHeaders.digest,
          hasSignature: !!authHeaders.signature,
          contentType: headers["content-type"],
          allHeaders: Object.keys(headers),
          bodyType: typeof body,
        });

        // Make the request with authentication headers
        // Note: body is passed as-is (object or string) and the API client will handle stringification
        return (globalThis as any).fetch(url, {
          ...init,
          headers,
          body, // Keep original body format - API client will stringify if needed
        });
      },
    });

    this.logger.log(`CyberSource client initialized with base URL: ${baseUrl}`);
    this.logger.log(
      `Authentication configured for merchant: ${config.merchantId}`
    );
  }

  // Payment Processing Methods
  async createPayment(request: CreatePaymentDto) {
    try {
      this.logger.debug("Creating payment", {
        amount: request.orderInformation?.amountDetails?.totalAmount,
      });
      const response = await this.api.pts.createPayment(request);
      this.logger.log("Payment created successfully", {
        id: response.data.id,
        status: response.data.status,
      });
      return response.data;
    } catch (error) {
      this.logger.error("Failed to create payment", error);
      throw error;
    }
  }

  async capturePayment(id: string, request: CapturePaymentDto) {
    try {
      this.logger.debug("Capturing payment", { paymentId: id });
      const response = await this.api.pts.capturePayment(id, request);
      this.logger.log("Payment captured successfully", {
        id: response.data.id,
        status: response.data.status,
      });
      return response.data;
    } catch (error) {
      this.logger.error("Failed to capture payment", error);
      throw error;
    }
  }

  async refundPayment(id: string, request: RefundPaymentDto) {
    try {
      this.logger.debug("Refunding payment", { paymentId: id });
      const response = await this.api.pts.refundPayment(id, request);
      this.logger.log("Payment refunded successfully", {
        id: response.data.id,
        status: response.data.status,
      });
      return response.data;
    } catch (error) {
      this.logger.error("Failed to refund payment", error);
      throw error;
    }
  }

  async voidPayment(id: string, request: VoidPaymentDto) {
    try {
      this.logger.debug("Voiding payment", { paymentId: id });
      const response = await this.api.pts.voidPayment(id, request);
      this.logger.log("Payment voided successfully", {
        id: response.data.id,
        status: response.data.status,
      });
      return response.data;
    } catch (error) {
      this.logger.error("Failed to void payment", error);
      throw error;
    }
  }

  // Direct API access for advanced usage
  get apiClient(): Api<unknown> {
    return this.api;
  }

  // Convenience getters for different API sections
  get payments() {
    return this.api.pts;
  }

  get tms() {
    return this.api.tms;
  }

  get risk() {
    return this.api.risk;
  }

  get reporting() {
    return this.api.reporting;
  }

  get rbs() {
    return this.api.rbs;
  }
}
