import { Injectable } from "@nestjs/common";
import { CyberSourceService } from "../cybersource.service";
import { BaseCyberSourceService } from "./base.service";
import {
  PaymentInstrumentCreateDto,
  PaymentInstrumentUpdateDto,
  PaymentInstrumentResponseDto,
  PaymentInstrumentPaginationOptionsDto,
} from "../dto/payment-instrument.dto";

/**
 * Service for managing standalone payment instruments (not customer-specific).
 * For customer payment instruments, use CustomerService instead.
 */
@Injectable()
export class PaymentInstrumentService extends BaseCyberSourceService {
  constructor(cyberSourceService: CyberSourceService) {
    super(cyberSourceService, PaymentInstrumentService.name);
  }

  /**
   * Create a standalone payment instrument (not associated with a customer)
   * Based on: POST /tms/v1/paymentinstruments
   * @param paymentInstrumentData Payment instrument data
   * @param options Query options
   * @returns Promise<PaymentInstrumentResponseDto>
   */
  async createPaymentInstrument(
    paymentInstrumentData: PaymentInstrumentCreateDto,
    options?: Pick<PaymentInstrumentPaginationOptionsDto, "retrieveBinDetails">
  ): Promise<PaymentInstrumentResponseDto> {
    return this.executeApiCall(
      "Creating standalone payment instrument",
      () =>
        this.cyberSourceService.tms.postPaymentInstrument(
          paymentInstrumentData,
          options
        ),
      this.sanitizeRequestForLogging({ paymentInstrumentData, options })
    );
  }

  /**
   * Retrieve a specific standalone payment instrument
   * Based on: GET /tms/v1/paymentinstruments/{paymentInstrumentId}
   * @param paymentInstrumentId Payment instrument ID
   * @param options Query options
   * @returns Promise<PaymentInstrumentResponseDto>
   */
  async getPaymentInstrument(
    paymentInstrumentId: string,
    options?: Pick<PaymentInstrumentPaginationOptionsDto, "retrieveBinDetails">
  ): Promise<PaymentInstrumentResponseDto> {
    return this.executeApiCall(
      "Retrieving standalone payment instrument",
      () =>
        this.cyberSourceService.tms.getPaymentInstrument(
          paymentInstrumentId,
          options
        ),
      { paymentInstrumentId, options }
    );
  }

  /**
   * Update a standalone payment instrument
   * Based on: PATCH /tms/v1/paymentinstruments/{paymentInstrumentId}
   * @param paymentInstrumentId Payment instrument ID
   * @param updateData Updated payment instrument data
   * @param options Query options
   * @returns Promise<PaymentInstrumentResponseDto>
   */
  async updatePaymentInstrument(
    paymentInstrumentId: string,
    updateData: PaymentInstrumentUpdateDto,
    options?: Pick<PaymentInstrumentPaginationOptionsDto, "retrieveBinDetails">
  ): Promise<PaymentInstrumentResponseDto> {
    return this.executeApiCall(
      "Updating standalone payment instrument",
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
   * Delete a standalone payment instrument
   * Based on: DELETE /tms/v1/paymentinstruments/{paymentInstrumentId}
   * @param paymentInstrumentId Payment instrument ID
   * @returns Promise<void>
   */
  async deletePaymentInstrument(paymentInstrumentId: string): Promise<void> {
    return this.executeVoidApiCall(
      "Deleting standalone payment instrument",
      () =>
        this.cyberSourceService.tms.deletePaymentInstrument(
          paymentInstrumentId
        ),
      { paymentInstrumentId }
    );
  }
}
