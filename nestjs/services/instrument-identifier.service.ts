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
import {
  InstrumentIdentifierCreateDto,
  InstrumentIdentifierUpdateDto,
  InstrumentIdentifierResponseDto,
  InstrumentIdentifierEnrollmentDto,
  InstrumentIdentifierPaymentInstrumentListDto,
  InstrumentIdentifierQueryDto,
  InstrumentIdentifierListQueryDto,
} from "../dto";

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
    enrollmentRequest: InstrumentIdentifierEnrollmentRequest
  ): Promise<InstrumentIdentifierEnrollmentResponse> {
    return this.executeApiCall(
      "Enrolling for network token",
      () =>
        this.cyberSourceService.tms.postInstrumentIdentifierEnrollment(
          enrollmentRequest
        ),
      this.sanitizeRequestForLogging({ enrollmentRequest })
    );
  }

  // DTO-based methods

  async createInstrumentIdentifierV2(
    createDto: InstrumentIdentifierCreateDto
  ): Promise<InstrumentIdentifierResponseDto> {
    return this.executeApiCall(
      "Creating instrument identifier (DTO)",
      () => this.cyberSourceService.tms.postInstrumentIdentifier(createDto),
      this.sanitizeRequestForLogging({ createDto })
    );
  }

  async getInstrumentIdentifierV2(
    instrumentIdentifierId: string,
    query?: InstrumentIdentifierQueryDto
  ): Promise<InstrumentIdentifierResponseDto> {
    return this.executeApiCall(
      "Retrieving instrument identifier (DTO)",
      () =>
        this.cyberSourceService.tms.getInstrumentIdentifier(
          instrumentIdentifierId,
          query
        ),
      this.sanitizeRequestForLogging({ instrumentIdentifierId, query })
    );
  }

  async updateInstrumentIdentifierV2(
    instrumentIdentifierId: string,
    updateDto: InstrumentIdentifierUpdateDto,
    profileId?: string
  ): Promise<InstrumentIdentifierResponseDto> {
    return this.executeApiCall(
      "Updating instrument identifier (DTO)",
      () =>
        this.cyberSourceService.tms.patchInstrumentIdentifier(
          instrumentIdentifierId,
          updateDto,
          { profileId }
        ),
      this.sanitizeRequestForLogging({
        instrumentIdentifierId,
        updateDto,
        profileId,
      })
    );
  }

  async deleteInstrumentIdentifierV2(
    instrumentIdentifierId: string,
    profileId?: string
  ): Promise<void> {
    return this.executeVoidApiCall(
      "Deleting instrument identifier (DTO)",
      () =>
        this.cyberSourceService.tms.deleteInstrumentIdentifier(
          instrumentIdentifierId,
          { profileId }
        ),
      this.sanitizeRequestForLogging({ instrumentIdentifierId, profileId })
    );
  }

  async listPaymentInstrumentsV2(
    query?: InstrumentIdentifierListQueryDto
  ): Promise<InstrumentIdentifierPaymentInstrumentListDto> {
    return this.executeApiCall(
      "Listing payment instruments (DTO)",
      () =>
        this.cyberSourceService.tms.getInstrumentIdentifierPaymentInstrumentsList(
          query
        ),
      this.sanitizeRequestForLogging({ query })
    );
  }

  async enrollForNetworkTokenV2(
    enrollmentDto: InstrumentIdentifierEnrollmentDto
  ): Promise<InstrumentIdentifierResponseDto> {
    return this.executeApiCall(
      "Enrolling for network token (DTO)",
      () =>
        this.cyberSourceService.tms.postInstrumentIdentifierEnrollment(
          enrollmentDto
        ),
      this.sanitizeRequestForLogging({ enrollmentDto })
    );
  }

  // Helper methods for common use cases

  async createCardInstrument(
    card: {
      number: string;
      expirationMonth: string;
      expirationYear: string;
      securityCode?: string;
      type?: string;
    },
    billTo?: any,
    options?: {
      type?: "enrollable card" | "enrollable token";
    }
  ): Promise<InstrumentIdentifierResponseDto> {
    const createDto: InstrumentIdentifierCreateDto = {
      card,
      billTo,
      type: options?.type || "enrollable card",
    };

    return this.createInstrumentIdentifierV2(createDto);
  }

  async createBankAccountInstrument(
    bankAccount: {
      routingNumber: string;
      accountNumber: string;
      type: string;
      checkNumber?: string;
    },
    billTo?: any
  ): Promise<InstrumentIdentifierResponseDto> {
    const createDto: InstrumentIdentifierCreateDto = {
      bankAccount,
      billTo,
    };

    return this.createInstrumentIdentifierV2(createDto);
  }

  async enrollCardForNetworkToken(
    card: {
      number: string;
      expirationMonth: string;
      expirationYear: string;
    },
    billTo?: any,
    options?: {
      type?: "enrollable card" | "enrollable token";
    }
  ): Promise<InstrumentIdentifierResponseDto> {
    const enrollmentDto: InstrumentIdentifierEnrollmentDto = {
      card,
      billTo,
      type: options?.type || "enrollable card",
    };

    return this.enrollForNetworkTokenV2(enrollmentDto);
  }
}
