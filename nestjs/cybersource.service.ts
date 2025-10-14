import { Injectable, Inject, Logger } from "@nestjs/common";
import {
  PaymentsApi,
  CaptureApi,
  RefundApi,
  VoidApi,
  CustomerApi,
  PaymentTokensApi,
  ReversalApi,
  CreditApi,
  VerificationApi,
  PayerAuthenticationApi,
  DecisionManagerApi,
  ReportsApi,
  BinLookupApi,
  TaxesApi,
  SubscriptionsApi,
  PlansApi,
  CreatePaymentRequest,
  CapturePaymentRequest,
  RefundPaymentRequest,
  VoidPaymentRequest,
} from "@nestjs/cybersource-rest-client";
import { CyberSourceConfig } from "./cybersource.config";

@Injectable()
export class CyberSourceService {
  private readonly logger = new Logger(CyberSourceService.name);

  // API instances
  private readonly paymentsApi: PaymentsApi;
  private readonly captureApi: CaptureApi;
  private readonly refundApi: RefundApi;
  private readonly voidApi: VoidApi;
  private readonly customerApi: CustomerApi;
  private readonly paymentTokensApi: PaymentTokensApi;
  private readonly reversalApi: ReversalApi;
  private readonly creditApi: CreditApi;
  private readonly verificationApi: VerificationApi;
  private readonly payerAuthApi: PayerAuthenticationApi;
  private readonly decisionManagerApi: DecisionManagerApi;
  private readonly reportsApi: ReportsApi;
  private readonly binLookupApi: BinLookupApi;
  private readonly taxesApi: TaxesApi;
  private readonly subscriptionsApi: SubscriptionsApi;
  private readonly plansApi: PlansApi;

  constructor(
    @Inject("CYBERSOURCE_CONFIG") private readonly config: CyberSourceConfig
  ) {
    const basePath =
      config.sandbox !== false
        ? config.basePath || "https://apitest.cybersource.com"
        : "https://api.cybersource.com";

    // Initialize API instances
    this.paymentsApi = new PaymentsApi();
    this.captureApi = new CaptureApi();
    this.refundApi = new RefundApi();
    this.voidApi = new VoidApi();
    this.customerApi = new CustomerApi();
    this.paymentTokensApi = new PaymentTokensApi();
    this.reversalApi = new ReversalApi();
    this.creditApi = new CreditApi();
    this.verificationApi = new VerificationApi();
    this.payerAuthApi = new PayerAuthenticationApi();
    this.decisionManagerApi = new DecisionManagerApi();
    this.reportsApi = new ReportsApi();
    this.binLookupApi = new BinLookupApi();
    this.taxesApi = new TaxesApi();
    this.subscriptionsApi = new SubscriptionsApi();
    this.plansApi = new PlansApi();

    // Set base path for all APIs
    this.setBasePath(basePath);

    this.logger.log(
      `CyberSource client initialized with base path: ${basePath}`
    );
  }

  private setBasePath(basePath: string): void {
    this.paymentsApi.basePath = basePath;
    this.captureApi.basePath = basePath;
    this.refundApi.basePath = basePath;
    this.voidApi.basePath = basePath;
    this.customerApi.basePath = basePath;
    this.paymentTokensApi.basePath = basePath;
    this.reversalApi.basePath = basePath;
    this.creditApi.basePath = basePath;
    this.verificationApi.basePath = basePath;
    this.payerAuthApi.basePath = basePath;
    this.decisionManagerApi.basePath = basePath;
    this.reportsApi.basePath = basePath;
    this.binLookupApi.basePath = basePath;
    this.taxesApi.basePath = basePath;
    this.subscriptionsApi.basePath = basePath;
    this.plansApi.basePath = basePath;
  }

  // Payment Processing Methods
  async createPayment(request: CreatePaymentRequest) {
    try {
      this.logger.debug("Creating payment", {
        amount: request.orderInformation?.amountDetails?.totalAmount,
      });
      const response = await this.paymentsApi.createPayment(request);
      this.logger.log("Payment created successfully", {
        id: response.body.id,
        status: response.body.status,
      });
      return response.body;
    } catch (error) {
      this.logger.error("Failed to create payment", error);
      throw error;
    }
  }

  async capturePayment(id: string, request: CapturePaymentRequest) {
    try {
      this.logger.debug("Capturing payment", { paymentId: id });
      const response = await this.captureApi.capturePayment(request, id);
      this.logger.log("Payment captured successfully", {
        id: response.body.id,
        status: response.body.status,
      });
      return response.body;
    } catch (error) {
      this.logger.error("Failed to capture payment", error);
      throw error;
    }
  }

  async refundPayment(id: string, request: RefundPaymentRequest) {
    try {
      this.logger.debug("Refunding payment", { paymentId: id });
      const response = await this.refundApi.refundPayment(request, id);
      this.logger.log("Payment refunded successfully", {
        id: response.body.id,
        status: response.body.status,
      });
      return response.body;
    } catch (error) {
      this.logger.error("Failed to refund payment", error);
      throw error;
    }
  }

  async voidPayment(id: string, request: VoidPaymentRequest) {
    try {
      this.logger.debug("Voiding payment", { paymentId: id });
      const response = await this.voidApi.voidPayment(request, id);
      this.logger.log("Payment voided successfully", {
        id: response.body.id,
        status: response.body.status,
      });
      return response.body;
    } catch (error) {
      this.logger.error("Failed to void payment", error);
      throw error;
    }
  }

  // Getter methods for direct API access
  get payments(): PaymentsApi {
    return this.paymentsApi;
  }

  get capture(): CaptureApi {
    return this.captureApi;
  }

  get refund(): RefundApi {
    return this.refundApi;
  }

  get void(): VoidApi {
    return this.voidApi;
  }

  get customer(): CustomerApi {
    return this.customerApi;
  }

  get paymentTokens(): PaymentTokensApi {
    return this.paymentTokensApi;
  }

  get reversal(): ReversalApi {
    return this.reversalApi;
  }

  get credit(): CreditApi {
    return this.creditApi;
  }

  get verification(): VerificationApi {
    return this.verificationApi;
  }

  get payerAuth(): PayerAuthenticationApi {
    return this.payerAuthApi;
  }

  get decisionManager(): DecisionManagerApi {
    return this.decisionManagerApi;
  }

  get reports(): ReportsApi {
    return this.reportsApi;
  }

  get binLookup(): BinLookupApi {
    return this.binLookupApi;
  }

  get taxes(): TaxesApi {
    return this.taxesApi;
  }

  get subscriptions(): SubscriptionsApi {
    return this.subscriptionsApi;
  }

  get plans(): PlansApi {
    return this.plansApi;
  }
}
