import { Injectable, Inject, Logger } from "@nestjs/common";
import { Api } from "@tsee9ii/cybersource-rest-client";
import { CyberSourceConfig } from "./cybersource.config";

// Type definitions for the main request types - using any for now since types are inline
export type CreatePaymentRequest = any;
export type CapturePaymentRequest = any;
export type RefundPaymentRequest = any;
export type VoidPaymentRequest = any;

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

    // Initialize the single API instance
    this.api = new Api({
      baseUrl,
      // Configure authentication if needed
      securityWorker: (securityData: any) => {
        return {};
      },
    });

    this.logger.log(`CyberSource client initialized with base URL: ${baseUrl}`);
  }

  // Payment Processing Methods
  async createPayment(request: CreatePaymentRequest) {
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

  async capturePayment(id: string, request: CapturePaymentRequest) {
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

  async refundPayment(id: string, request: RefundPaymentRequest) {
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

  async voidPayment(id: string, request: VoidPaymentRequest) {
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

  get flex() {
    return this.api.flex;
  }

  get reporting() {
    return this.api.reporting;
  }
}
