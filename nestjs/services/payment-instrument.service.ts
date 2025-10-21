import { Injectable, Logger } from "@nestjs/common";
import { CyberSourceService } from "../cybersource.service";
import {
  PaymentInstrumentRequest,
  PaymentInstrumentResponse,
  PaymentInstrumentListResponse,
  PaymentInstrumentUpdateRequest,
  PaymentInstrumentListOptions,
} from "../interfaces/payment-instrument.interfaces";

@Injectable()
export class PaymentInstrumentService {
  private readonly logger = new Logger(PaymentInstrumentService.name);

  constructor(private readonly cyberSourceService: CyberSourceService) {}

  /**
   * Create a standalone payment instrument
   * @param paymentInstrumentData Payment instrument data
   * @returns Promise<PaymentInstrumentResponse>
   */
  async createPaymentInstrument(
    paymentInstrumentData: PaymentInstrumentRequest
  ): Promise<PaymentInstrumentResponse> {
    try {
      this.logger.log("Creating standalone payment instrument");

      const response = await this.cyberSourceService.tms.postPaymentInstrument(
        paymentInstrumentData
      );

      this.logger.log(
        `Payment instrument created successfully with ID: ${response.data?.id}`
      );
      return response.data;
    } catch (error) {
      this.logger.error("Error creating payment instrument:", error);
      throw error;
    }
  }

  /**
   * Retrieve a specific payment instrument
   * @param paymentInstrumentId Payment instrument ID
   * @returns Promise<PaymentInstrumentResponse>
   */
  async getPaymentInstrument(
    paymentInstrumentId: string
  ): Promise<PaymentInstrumentResponse> {
    try {
      this.logger.log(`Retrieving payment instrument: ${paymentInstrumentId}`);

      const response = await this.cyberSourceService.tms.getPaymentInstrument(
        paymentInstrumentId
      );

      this.logger.log(
        `Payment instrument retrieved successfully: ${paymentInstrumentId}`
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `Error retrieving payment instrument ${paymentInstrumentId}:`,
        error
      );
      throw error;
    }
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
    try {
      this.logger.log(`Updating payment instrument: ${paymentInstrumentId}`);

      const response = await this.cyberSourceService.tms.patchPaymentInstrument(
        paymentInstrumentId,
        updateData
      );

      this.logger.log(
        `Payment instrument updated successfully: ${paymentInstrumentId}`
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `Error updating payment instrument ${paymentInstrumentId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Delete a payment instrument
   * @param paymentInstrumentId Payment instrument ID
   * @returns Promise<void>
   */
  async deletePaymentInstrument(paymentInstrumentId: string): Promise<void> {
    try {
      this.logger.log(`Deleting payment instrument: ${paymentInstrumentId}`);

      await this.cyberSourceService.tms.deletePaymentInstrument(
        paymentInstrumentId
      );

      this.logger.log(
        `Payment instrument deleted successfully: ${paymentInstrumentId}`
      );
    } catch (error) {
      this.logger.error(
        `Error deleting payment instrument ${paymentInstrumentId}:`,
        error
      );
      throw error;
    }
  }
}
