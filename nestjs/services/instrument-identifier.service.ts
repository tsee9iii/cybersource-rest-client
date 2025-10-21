import { Injectable, Logger } from "@nestjs/common";
import { CyberSourceService } from "../cybersource.service";
import {
  InstrumentIdentifierRequest,
  InstrumentIdentifierResponse,
  InstrumentIdentifierUpdateRequest,
  InstrumentIdentifierPaymentInstrumentsListResponse,
  InstrumentIdentifierEnrollmentRequest,
  InstrumentIdentifierEnrollmentResponse,
  InstrumentIdentifierListOptions,
} from "../interfaces/payment-instrument.interfaces";

@Injectable()
export class InstrumentIdentifierService {
  private readonly logger = new Logger(InstrumentIdentifierService.name);

  constructor(private readonly cyberSourceService: CyberSourceService) {}

  /**
   * Create an instrument identifier
   * @param identifierData Instrument identifier data
   * @returns Promise<InstrumentIdentifierResponse>
   */
  async createInstrumentIdentifier(
    identifierData: InstrumentIdentifierRequest
  ): Promise<InstrumentIdentifierResponse> {
    try {
      this.logger.log("Creating instrument identifier");

      const response =
        await this.cyberSourceService.tms.postInstrumentIdentifier(
          identifierData
        );

      this.logger.log(
        `Instrument identifier created successfully with ID: ${response.data?.id}`
      );
      return response.data;
    } catch (error) {
      this.logger.error("Error creating instrument identifier:", error);
      throw error;
    }
  }

  /**
   * Retrieve a specific instrument identifier
   * @param instrumentIdentifierId Instrument identifier ID
   * @returns Promise<InstrumentIdentifierResponse>
   */
  async getInstrumentIdentifier(
    instrumentIdentifierId: string
  ): Promise<InstrumentIdentifierResponse> {
    try {
      this.logger.log(
        `Retrieving instrument identifier: ${instrumentIdentifierId}`
      );

      const response =
        await this.cyberSourceService.tms.getInstrumentIdentifier(
          instrumentIdentifierId
        );

      this.logger.log(
        `Instrument identifier retrieved successfully: ${instrumentIdentifierId}`
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `Error retrieving instrument identifier ${instrumentIdentifierId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Update an instrument identifier
   * @param instrumentIdentifierId Instrument identifier ID
   * @param updateData Updated instrument identifier data
   * @returns Promise<InstrumentIdentifierResponse>
   */
  async updateInstrumentIdentifier(
    instrumentIdentifierId: string,
    updateData: InstrumentIdentifierUpdateRequest
  ): Promise<InstrumentIdentifierResponse> {
    try {
      this.logger.log(
        `Updating instrument identifier: ${instrumentIdentifierId}`
      );

      const response =
        await this.cyberSourceService.tms.patchInstrumentIdentifier(
          instrumentIdentifierId,
          updateData
        );

      this.logger.log(
        `Instrument identifier updated successfully: ${instrumentIdentifierId}`
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `Error updating instrument identifier ${instrumentIdentifierId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Delete an instrument identifier
   * @param instrumentIdentifierId Instrument identifier ID
   * @returns Promise<void>
   */
  async deleteInstrumentIdentifier(
    instrumentIdentifierId: string
  ): Promise<void> {
    try {
      this.logger.log(
        `Deleting instrument identifier: ${instrumentIdentifierId}`
      );

      await this.cyberSourceService.tms.deleteInstrumentIdentifier(
        instrumentIdentifierId
      );

      this.logger.log(
        `Instrument identifier deleted successfully: ${instrumentIdentifierId}`
      );
    } catch (error) {
      this.logger.error(
        `Error deleting instrument identifier ${instrumentIdentifierId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * List payment instruments for an instrument identifier
   * @param instrumentIdentifierId Instrument identifier ID
   * @param options Pagination and query options
   * @returns Promise<InstrumentIdentifierPaymentInstrumentsListResponse>
   */
  async listPaymentInstruments(
    instrumentIdentifierId: string,
    options?: InstrumentIdentifierListOptions
  ): Promise<InstrumentIdentifierPaymentInstrumentsListResponse> {
    try {
      this.logger.log(
        `Listing payment instruments for instrument identifier: ${instrumentIdentifierId}`
      );

      const response =
        await this.cyberSourceService.tms.getInstrumentIdentifierPaymentInstrumentsList(
          instrumentIdentifierId,
          options
        );

      this.logger.log(
        `Retrieved ${
          response.data?._embedded?.paymentInstruments?.length || 0
        } payment instruments for instrument identifier: ${instrumentIdentifierId}`
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `Error listing payment instruments for instrument identifier ${instrumentIdentifierId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Enroll an instrument identifier for network token provisioning
   * @param instrumentIdentifierId Instrument identifier ID
   * @param enrollmentData Enrollment data
   * @returns Promise<InstrumentIdentifierEnrollmentResponse>
   */
  async enrollForNetworkToken(
    instrumentIdentifierId: string,
    enrollmentData: InstrumentIdentifierEnrollmentRequest
  ): Promise<InstrumentIdentifierEnrollmentResponse> {
    try {
      this.logger.log(
        `Enrolling instrument identifier for network token: ${instrumentIdentifierId}`
      );

      const response =
        await this.cyberSourceService.tms.postInstrumentIdentifierEnrollment(
          instrumentIdentifierId,
          enrollmentData
        );

      this.logger.log(
        `Instrument identifier enrolled successfully for network token: ${instrumentIdentifierId}`
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `Error enrolling instrument identifier ${instrumentIdentifierId} for network token:`,
        error
      );
      throw error;
    }
  }
}
