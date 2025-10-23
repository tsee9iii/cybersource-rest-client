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
import {
  PaymentInstrumentCreateDto,
  PaymentInstrumentUpdateDto,
  PaymentInstrumentResponseDto,
  PaymentInstrumentPaginationOptionsDto,
  CustomerPaymentInstrumentCreateDto,
  CustomerPaymentInstrumentUpdateDto,
  CustomerPaymentInstrumentResponseDto,
  CustomerPaymentInstrumentListResponseDto,
  CustomerPaymentInstrumentPaginationOptionsDto,
} from "../dto/index";

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

  // ===== DTO-based Methods =====

  /**
   * Create a standalone payment instrument using DTOs
   * @param paymentInstrumentData Payment instrument data
   * @returns Promise<PaymentInstrumentResponseDto>
   */
  async createPaymentInstrumentWithDto(
    paymentInstrumentData: PaymentInstrumentCreateDto
  ): Promise<PaymentInstrumentResponseDto> {
    return this.executeApiCall(
      "Creating standalone payment instrument (DTO)",
      () =>
        this.cyberSourceService.tms.postPaymentInstrument(
          paymentInstrumentData
        ),
      this.sanitizeRequestForLogging({ paymentInstrumentData })
    );
  }

  /**
   * Retrieve a specific payment instrument using DTOs
   * @param paymentInstrumentId Payment instrument ID
   * @param options Query options
   * @returns Promise<PaymentInstrumentResponseDto>
   */
  async getPaymentInstrumentWithDto(
    paymentInstrumentId: string,
    options?: Pick<PaymentInstrumentPaginationOptionsDto, "retrieveBinDetails">
  ): Promise<PaymentInstrumentResponseDto> {
    return this.executeApiCall(
      "Retrieving payment instrument (DTO)",
      () =>
        this.cyberSourceService.tms.getPaymentInstrument(
          paymentInstrumentId,
          options
        ),
      { paymentInstrumentId, options }
    );
  }

  /**
   * Update a payment instrument using DTOs
   * @param paymentInstrumentId Payment instrument ID
   * @param updateData Updated payment instrument data
   * @param options Query options
   * @returns Promise<PaymentInstrumentResponseDto>
   */
  async updatePaymentInstrumentWithDto(
    paymentInstrumentId: string,
    updateData: PaymentInstrumentUpdateDto,
    options?: Pick<PaymentInstrumentPaginationOptionsDto, "retrieveBinDetails">
  ): Promise<PaymentInstrumentResponseDto> {
    return this.executeApiCall(
      "Updating payment instrument (DTO)",
      () =>
        this.cyberSourceService.tms.patchPaymentInstrument(
          paymentInstrumentId,
          updateData,
          options
        ),
      {
        paymentInstrumentId,
        options,
        ...this.sanitizeRequestForLogging({ updateData }),
      }
    );
  }

  /**
   * Create a payment instrument for a customer using DTOs
   * @param customerId Customer ID
   * @param paymentInstrumentData Payment instrument data
   * @returns Promise<CustomerPaymentInstrumentResponseDto>
   */
  async createCustomerPaymentInstrumentWithDto(
    customerId: string,
    paymentInstrumentData: CustomerPaymentInstrumentCreateDto
  ): Promise<CustomerPaymentInstrumentResponseDto> {
    return this.executeApiCall(
      "Creating payment instrument for customer (DTO)",
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
   * List payment instruments for a customer using DTOs
   * @param customerId Customer ID
   * @param options Pagination and query options
   * @returns Promise<CustomerPaymentInstrumentListResponseDto>
   */
  async listCustomerPaymentInstrumentsWithDto(
    customerId: string,
    options?: CustomerPaymentInstrumentPaginationOptionsDto
  ): Promise<CustomerPaymentInstrumentListResponseDto> {
    return this.executeApiCall(
      "Retrieving payment instruments for customer (DTO)",
      () =>
        this.cyberSourceService.tms.getCustomerPaymentInstrumentsList(
          customerId,
          options
        ),
      { customerId, options }
    );
  }

  /**
   * Retrieve a specific payment instrument for a customer using DTOs
   * @param customerId Customer ID
   * @param paymentInstrumentId Payment instrument ID
   * @returns Promise<CustomerPaymentInstrumentResponseDto>
   */
  async getCustomerPaymentInstrumentWithDto(
    customerId: string,
    paymentInstrumentId: string
  ): Promise<CustomerPaymentInstrumentResponseDto> {
    return this.executeApiCall(
      "Retrieving customer payment instrument (DTO)",
      () =>
        this.cyberSourceService.tms.getCustomerPaymentInstrument(
          customerId,
          paymentInstrumentId
        ),
      { customerId, paymentInstrumentId }
    );
  }

  /**
   * Update a payment instrument for a customer using DTOs
   * @param customerId Customer ID
   * @param paymentInstrumentId Payment instrument ID
   * @param updateData Updated payment instrument data
   * @returns Promise<CustomerPaymentInstrumentResponseDto>
   */
  async updateCustomerPaymentInstrumentWithDto(
    customerId: string,
    paymentInstrumentId: string,
    updateData: CustomerPaymentInstrumentUpdateDto
  ): Promise<CustomerPaymentInstrumentResponseDto> {
    return this.executeApiCall(
      "Updating customer payment instrument (DTO)",
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
}
