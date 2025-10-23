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

  /**
   * Create a card-based instrument identifier with simplified parameters
   *
   * Instrument identifiers represent unique card numbers (PANs) or bank accounts.
   * The same ID is returned for the same card number, enabling cross-channel tracking.
   *
   * @param card - Card information
   * @param card.number - Primary Account Number (12-19 digits)
   * @param card.expirationMonth - Two-digit month (01-12)
   * @param card.expirationYear - Four-digit year (YYYY)
   * @param card.securityCode - Optional CVV/CVC code
   * @param card.type - Optional card network type
   * @param billTo - Optional billing address information
   * @param options - Additional options
   * @param options.type - Whether card is enrollable for network tokenization (default: "enrollable card")
   * @returns Promise resolving to the instrument identifier with optional BIN details
   *
   * @example
   * ```typescript
   * const instrument = await instrumentIdService.createCardInstrument({
   *   number: "4111111111111111",
   *   expirationMonth: "12",
   *   expirationYear: "2025",
   *   securityCode: "123"
   * }, {
   *   firstName: "John",
   *   lastName: "Doe",
   *   address1: "123 Main St",
   *   locality: "San Francisco",
   *   administrativeArea: "CA",
   *   postalCode: "94102",
   *   country: "US"
   * });
   * ```
   */
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

  /**
   * Create a bank account-based instrument identifier with simplified parameters
   *
   * Bank account instrument identifiers enable tokenization and tracking of ACH/eCheck
   * payment methods using routing and account numbers.
   *
   * @param bankAccount - Bank account information
   * @param bankAccount.routingNumber - Bank routing/transit number
   * @param bankAccount.accountNumber - Bank account number
   * @param bankAccount.type - Account type (checking, savings, corporate, etc.)
   * @param bankAccount.checkNumber - Optional check number
   * @param billTo - Optional billing address information
   * @returns Promise resolving to the instrument identifier
   *
   * @example
   * ```typescript
   * const instrument = await instrumentIdService.createBankAccountInstrument({
   *   routingNumber: "021000021",
   *   accountNumber: "1234567890",
   *   type: "checking"
   * }, {
   *   firstName: "John",
   *   lastName: "Doe",
   *   email: "john@example.com"
   * });
   * ```
   */
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

  /**
   * Enroll a card for network token with simplified parameters
   *
   * Network token enrollment creates a token with the card network (Visa, Mastercard, etc.)
   * that can be used instead of the PAN for better security and authorization rates.
   * Tokens are not invalidated when cards are lost or expire.
   *
   * @param card - Card information for enrollment
   * @param card.number - Primary Account Number (PAN)
   * @param card.expirationMonth - Two-digit expiration month (01-12)
   * @param card.expirationYear - Four-digit expiration year (YYYY)
   * @param billTo - Optional billing address (may be required by some card networks)
   * @param options - Additional enrollment options
   * @param options.type - Token type (default: "enrollable card")
   * @returns Promise resolving to the enrolled instrument with network token details
   *
   * @example
   * ```typescript
   * const enrolled = await instrumentIdService.enrollCardForNetworkToken({
   *   number: "4111111111111111",
   *   expirationMonth: "12",
   *   expirationYear: "2025"
   * }, {
   *   firstName: "John",
   *   lastName: "Doe",
   *   address1: "123 Main St",
   *   locality: "San Francisco",
   *   administrativeArea: "CA",
   *   postalCode: "94102",
   *   country: "US"
   * });
   * ```
   */
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
