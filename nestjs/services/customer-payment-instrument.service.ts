import { Injectable, Logger } from "@nestjs/common";
import { CyberSourceService } from "../cybersource.service";
import {
  CustomerPaymentInstrumentRequest,
  CustomerPaymentInstrumentResponse,
  CustomerPaymentInstrumentListResponse,
  CustomerPaymentInstrumentUpdateRequest,
  CustomerPaymentInstrumentListOptions,
} from "../interfaces/payment-instrument.interfaces";

@Injectable()
export class CustomerPaymentInstrumentService {
  private readonly logger = new Logger(CustomerPaymentInstrumentService.name);

  constructor(private readonly cyberSourceService: CyberSourceService) {}

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
    try {
      this.logger.log(
        `Creating payment instrument for customer: ${customerId}`
      );

      const response =
        await this.cyberSourceService.tms.postCustomerPaymentInstrument(
          customerId,
          paymentInstrumentData
        );

      this.logger.log(
        `Payment instrument created successfully for customer: ${customerId}, instrument ID: ${response.data?.id}`
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `Error creating payment instrument for customer ${customerId}:`,
        error
      );
      throw error;
    }
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
    try {
      this.logger.log(
        `Retrieving payment instruments for customer: ${customerId}`
      );

      const response =
        await this.cyberSourceService.tms.getCustomerPaymentInstrumentsList(
          customerId,
          options
        );

      this.logger.log(
        `Retrieved ${
          response.data?._embedded?.paymentInstruments?.length || 0
        } payment instruments for customer: ${customerId}`
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `Error retrieving payment instruments for customer ${customerId}:`,
        error
      );
      throw error;
    }
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
    try {
      this.logger.log(
        `Retrieving payment instrument: ${paymentInstrumentId} for customer: ${customerId}`
      );

      const response =
        await this.cyberSourceService.tms.getCustomerPaymentInstrument(
          customerId,
          paymentInstrumentId
        );

      this.logger.log(
        `Payment instrument retrieved successfully: ${paymentInstrumentId}`
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `Error retrieving payment instrument ${paymentInstrumentId} for customer ${customerId}:`,
        error
      );
      throw error;
    }
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
    try {
      this.logger.log(
        `Updating payment instrument: ${paymentInstrumentId} for customer: ${customerId}`
      );

      const response =
        await this.cyberSourceService.tms.patchCustomersPaymentInstrument(
          customerId,
          paymentInstrumentId,
          updateData
        );

      this.logger.log(
        `Payment instrument updated successfully: ${paymentInstrumentId}`
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `Error updating payment instrument ${paymentInstrumentId} for customer ${customerId}:`,
        error
      );
      throw error;
    }
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
    try {
      this.logger.log(
        `Deleting payment instrument: ${paymentInstrumentId} for customer: ${customerId}`
      );

      await this.cyberSourceService.tms.deleteCustomerPaymentInstrument(
        customerId,
        paymentInstrumentId
      );

      this.logger.log(
        `Payment instrument deleted successfully: ${paymentInstrumentId}`
      );
    } catch (error) {
      this.logger.error(
        `Error deleting payment instrument ${paymentInstrumentId} for customer ${customerId}:`,
        error
      );
      throw error;
    }
  }
}
