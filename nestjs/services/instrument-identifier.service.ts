import { Injectable } from "@nestjs/common";
import { CyberSourceService } from "../cybersource.service";
import { BaseCyberSourceService } from "./base.service";
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
export class InstrumentIdentifierService extends BaseCyberSourceService {
  constructor(cyberSourceService: CyberSourceService) {
    super(cyberSourceService, InstrumentIdentifierService.name);
  }

  /**
   * Create an instrument identifier
   * @param identifierData Instrument identifier data
   * @returns Promise<InstrumentIdentifierResponse>
   */
  async createInstrumentIdentifier(
    identifierData: InstrumentIdentifierRequest
  ): Promise<InstrumentIdentifierResponse> {
    return this.executeApiCall(
      "Creating instrument identifier",
      () =>
        this.cyberSourceService.tms.postInstrumentIdentifier(identifierData),
      this.sanitizeRequestForLogging({ identifierData })
    );
  }

  /**
   * Retrieve a specific instrument identifier
   * @param instrumentIdentifierId Instrument identifier ID
   * @returns Promise<InstrumentIdentifierResponse>
   */
  async getInstrumentIdentifier(
    instrumentIdentifierId: string
  ): Promise<InstrumentIdentifierResponse> {
    return this.executeApiCall(
      "Retrieving instrument identifier",
      () =>
        this.cyberSourceService.tms.getInstrumentIdentifier(
          instrumentIdentifierId
        ),
      { instrumentIdentifierId }
    );
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
    return this.executeApiCall(
      "Updating instrument identifier",
      () =>
        this.cyberSourceService.tms.patchInstrumentIdentifier(
          instrumentIdentifierId,
          updateData
        ),
      {
        instrumentIdentifierId,
        ...this.sanitizeRequestForLogging({ updateData }),
      }
    );
  }

  /**
   * Delete an instrument identifier
   * @param instrumentIdentifierId Instrument identifier ID
   * @returns Promise<void>
   */
  async deleteInstrumentIdentifier(
    instrumentIdentifierId: string
  ): Promise<void> {
    return this.executeVoidApiCall(
      "Deleting instrument identifier",
      () =>
        this.cyberSourceService.tms.deleteInstrumentIdentifier(
          instrumentIdentifierId
        ),
      { instrumentIdentifierId }
    );
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
    return this.executeApiCall(
      "Listing payment instruments for instrument identifier",
      () =>
        this.cyberSourceService.tms.getInstrumentIdentifierPaymentInstrumentsList(
          instrumentIdentifierId,
          options
        ),
      { instrumentIdentifierId, options }
    );
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
    return this.executeApiCall(
      "Enrolling instrument identifier for network token",
      () =>
        this.cyberSourceService.tms.postInstrumentIdentifierEnrollment(
          instrumentIdentifierId,
          enrollmentData
        ),
      {
        instrumentIdentifierId,
        ...this.sanitizeRequestForLogging({ enrollmentData }),
      }
    );
  }
}
