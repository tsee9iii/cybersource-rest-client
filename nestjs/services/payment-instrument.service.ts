import { Injectable } from "@nestjs/common";
import { CyberSourceService } from "../cybersource.service";
import { BaseCyberSourceService } from "./base.service";
import {
  PaymentInstrumentRequest,
  PaymentInstrumentResponse,
  PaymentInstrumentUpdateRequest,
  CustomerPaymentInstrumentRequest,
  CustomerPaymentInstrumentResponse,
  CustomerPaymentInstrumentListResponse,
  CustomerPaymentInstrumentUpdateRequest,
  CustomerPaymentInstrumentListOptions,
} from "../interfaces/payment-instrument.interfaces";

@Injectable()
export class PaymentInstrumentService extends BaseCyberSourceService {
  constructor(cyberSourceService: CyberSourceService) {
    super(cyberSourceService, PaymentInstrumentService.name);
  }

  /**
   * Create a standalone payment instrument
   * @param paymentInstrumentData Payment instrument data
   * @returns Promise<PaymentInstrumentResponse>
   */
  async createPaymentInstrument(
    paymentInstrumentData: PaymentInstrumentRequest
  ): Promise<PaymentInstrumentResponse> {
    return this.executeApiCall(
      "Creating standalone payment instrument",
      () =>
        this.cyberSourceService.tms.postPaymentInstrument(
          paymentInstrumentData
        ),
      this.sanitizeRequestForLogging({ paymentInstrumentData })
    );
  }

  /**
   * Retrieve a specific payment instrument
   * @param paymentInstrumentId Payment instrument ID
   * @returns Promise<PaymentInstrumentResponse>
   */
  async getPaymentInstrument(
    paymentInstrumentId: string
  ): Promise<PaymentInstrumentResponse> {
    return this.executeApiCall(
      "Retrieving payment instrument",
      () =>
        this.cyberSourceService.tms.getPaymentInstrument(paymentInstrumentId),
      { paymentInstrumentId }
    );
  }

  /**
   * Update a payment instrument
   * @param paymentInstrumentId Payment instrument ID
   * @param updateData Updated payment instrument data
   * @returns Promise<PaymentInstrumentResponse>
   */
  async updatePaymentInstrument(
    paymentInstrumentId: string,
    updateData: PaymentInstrumentUpdateRequest
  ): Promise<PaymentInstrumentResponse> {
    return this.executeApiCall(
      "Updating payment instrument",
      () =>
        this.cyberSourceService.tms.patchPaymentInstrument(
          paymentInstrumentId,
          updateData
        ),
      { paymentInstrumentId, ...this.sanitizeRequestForLogging({ updateData }) }
    );
  }

  /**
   * Delete a payment instrument
   * @param paymentInstrumentId Payment instrument ID
   * @returns Promise<void>
   */
  async deletePaymentInstrument(paymentInstrumentId: string): Promise<void> {
    return this.executeVoidApiCall(
      "Deleting payment instrument",
      () =>
        this.cyberSourceService.tms.deletePaymentInstrument(
          paymentInstrumentId
        ),
      { paymentInstrumentId }
    );
  }

  // ===== Customer Payment Instrument Methods =====

  /**
   * Create a payment instrument for a customer
   * @param customerId Customer ID
   * @param paymentInstrumentData Payment instrument data
   * @returns Promise<CustomerPaymentInstrumentResponse>
   */
  async createCustomerPaymentInstrument(
    customerId: string,
    paymentInstrumentData: CustomerPaymentInstrumentRequest
  ): Promise<CustomerPaymentInstrumentResponse> {
    return this.executeApiCall(
      "Creating payment instrument for customer",
      () =>
        this.cyberSourceService.tms.postCustomerPaymentInstrument(
          customerId,
          paymentInstrumentData
        ),
      {
        customerId,
        ...this.sanitizeRequestForLogging({ paymentInstrumentData }),
      }
    );
  }

  /**
   * List payment instruments for a customer
   * @param customerId Customer ID
   * @param options Pagination and query options
   * @returns Promise<CustomerPaymentInstrumentListResponse>
   */
  async listCustomerPaymentInstruments(
    customerId: string,
    options?: CustomerPaymentInstrumentListOptions
  ): Promise<CustomerPaymentInstrumentListResponse> {
    return this.executeApiCall(
      "Retrieving payment instruments for customer",
      () =>
        this.cyberSourceService.tms.getCustomerPaymentInstrumentsList(
          customerId,
          options
        ),
      { customerId, options }
    );
  }

  /**
   * Retrieve a specific payment instrument for a customer
   * @param customerId Customer ID
   * @param paymentInstrumentId Payment instrument ID
   * @returns Promise<CustomerPaymentInstrumentResponse>
   */
  async getCustomerPaymentInstrument(
    customerId: string,
    paymentInstrumentId: string
  ): Promise<CustomerPaymentInstrumentResponse> {
    return this.executeApiCall(
      "Retrieving customer payment instrument",
      () =>
        this.cyberSourceService.tms.getCustomerPaymentInstrument(
          customerId,
          paymentInstrumentId
        ),
      { customerId, paymentInstrumentId }
    );
  }

  /**
   * Update a payment instrument for a customer
   * @param customerId Customer ID
   * @param paymentInstrumentId Payment instrument ID
   * @param updateData Updated payment instrument data
   * @returns Promise<CustomerPaymentInstrumentResponse>
   */
  async updateCustomerPaymentInstrument(
    customerId: string,
    paymentInstrumentId: string,
    updateData: CustomerPaymentInstrumentUpdateRequest
  ): Promise<CustomerPaymentInstrumentResponse> {
    return this.executeApiCall(
      "Updating customer payment instrument",
      () =>
        this.cyberSourceService.tms.patchCustomersPaymentInstrument(
          customerId,
          paymentInstrumentId,
          updateData
        ),
      {
        customerId,
        paymentInstrumentId,
        ...this.sanitizeRequestForLogging({ updateData }),
      }
    );
  }

  /**
   * Delete a payment instrument for a customer
   * @param customerId Customer ID
   * @param paymentInstrumentId Payment instrument ID
   * @returns Promise<void>
   */
  async deleteCustomerPaymentInstrument(
    customerId: string,
    paymentInstrumentId: string
  ): Promise<void> {
    return this.executeVoidApiCall(
      "Deleting customer payment instrument",
      () =>
        this.cyberSourceService.tms.deleteCustomerPaymentInstrument(
          customerId,
          paymentInstrumentId
        ),
      { customerId, paymentInstrumentId }
    );
  }
}
