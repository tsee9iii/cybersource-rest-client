import { Injectable } from "@nestjs/common";
import { CyberSourceService } from "../cybersource.service";
import { BaseCyberSourceService } from "./base.service";
import {
  TokenizedCardRequest,
  TokenizedCardResponse,
} from "../interfaces/payment-instrument.interfaces";
import {
  TokenizedCardCreateDto,
  TokenizedCardResponseDto,
  TokenizedCardQueryDto,
} from "../dto";

@Injectable()
export class TokenizedCardService extends BaseCyberSourceService {
  constructor(cyberSourceService: CyberSourceService) {
    super(cyberSourceService, TokenizedCardService.name);
  }

  /**
   * Create a tokenized card (network token)
   * @param tokenizedCardData Tokenized card data
   * @returns Promise<TokenizedCardResponse>
   */
  async createTokenizedCard(
    tokenizedCardData: TokenizedCardRequest
  ): Promise<TokenizedCardResponse> {
    return this.executeApiCall(
      "Creating tokenized card (network token)",
      () => this.cyberSourceService.tms.postTokenizedCard(tokenizedCardData),
      this.sanitizeRequestForLogging({ tokenizedCardData })
    );
  }

  /**
   * Retrieve a specific tokenized card
   * @param tokenizedCardId Tokenized card ID
   * @returns Promise<TokenizedCardResponse>
   */
  async getTokenizedCard(
    tokenizedCardId: string
  ): Promise<TokenizedCardResponse> {
    return this.executeApiCall(
      "Retrieving tokenized card",
      () => this.cyberSourceService.tms.getTokenizedCard(tokenizedCardId),
      { tokenizedCardId }
    );
  }

  /**
   * Delete a tokenized card
   * @param tokenizedCardId Tokenized card ID
   * @returns Promise<void>
   */
  async deleteTokenizedCard(tokenizedCardId: string): Promise<void> {
    return this.executeVoidApiCall(
      "Deleting tokenized card",
      () => this.cyberSourceService.tms.deleteTokenizedCard(tokenizedCardId),
      { tokenizedCardId }
    );
  }

  // DTO-based methods

  /**
   * Create a tokenized card (network token) using DTO
   * @param createDto Tokenized card creation data
   * @returns Promise<TokenizedCardResponseDto>
   */
  async createTokenizedCardV2(
    createDto: TokenizedCardCreateDto
  ): Promise<TokenizedCardResponseDto> {
    return this.executeApiCall(
      "Creating tokenized card (network token) - DTO",
      () => this.cyberSourceService.tms.postTokenizedCard(createDto),
      this.sanitizeRequestForLogging({ createDto })
    );
  }

  /**
   * Retrieve a specific tokenized card using DTO
   * @param tokenizedCardId Tokenized card ID
   * @param query Optional query parameters (reserved for future use)
   * @returns Promise<TokenizedCardResponseDto>
   */
  async getTokenizedCardV2(
    tokenizedCardId: string,
    query?: TokenizedCardQueryDto
  ): Promise<TokenizedCardResponseDto> {
    return this.executeApiCall(
      "Retrieving tokenized card - DTO",
      () => this.cyberSourceService.tms.getTokenizedCard(tokenizedCardId),
      this.sanitizeRequestForLogging({ tokenizedCardId, query })
    );
  }

  /**
   * Delete a tokenized card using DTO patterns
   * @param tokenizedCardId Tokenized card ID
   * @returns Promise<void>
   */
  async deleteTokenizedCardV2(tokenizedCardId: string): Promise<void> {
    return this.executeVoidApiCall(
      "Deleting tokenized card - DTO",
      () => this.cyberSourceService.tms.deleteTokenizedCard(tokenizedCardId),
      this.sanitizeRequestForLogging({ tokenizedCardId })
    );
  }

  // Helper methods for common use cases

  /**
   * Create a network token from card information (PAN)
   *
   * This is the most common way to create network tokens. The card PAN is sent to
   * the card network (Visa, Mastercard, Amex) which returns a network token that
   * can be used for recurring payments without storing the actual card number.
   *
   * @param card - Card details including PAN, expiration, and card type
   * @param card.number - Primary Account Number (PAN) - the actual card number
   * @param card.expirationMonth - Two-digit expiration month (01-12)
   * @param card.expirationYear - Four-digit expiration year (YYYY)
   * @param card.type - Optional card network type (visa, mastercard, americanexpress)
   * @param options - Additional creation options
   * @param options.createInstrumentIdentifier - Whether to create an instrument identifier (default: true)
   * @param options.consumerId - Optional consumer/wallet identifier (max 24 chars for VTS)
   * @returns Promise resolving to the created tokenized card with network token details
   *
   * @example
   * ```typescript
   * const networkToken = await tokenizedCardService.createTokenFromCard({
   *   number: "4111111111111111",
   *   expirationMonth: "12",
   *   expirationYear: "2025",
   *   type: "visa"
   * }, {
   *   createInstrumentIdentifier: true,
   *   consumerId: "customer-wallet-123"
   * });
   * ```
   */
  async createTokenFromCard(
    card: {
      number: string;
      expirationMonth: string;
      expirationYear: string;
      type?: "visa" | "mastercard" | "americanexpress";
    },
    options?: {
      createInstrumentIdentifier?: boolean;
      consumerId?: string;
    }
  ): Promise<TokenizedCardResponseDto> {
    const createDto: TokenizedCardCreateDto = {
      source: "ONFILE",
      card: {
        number: card.number,
        expirationMonth: card.expirationMonth,
        expirationYear: card.expirationYear,
        type: card.type ? this.mapCardTypeToCode(card.type) : undefined,
      },
      createInstrumentIdentifier: options?.createInstrumentIdentifier ?? true,
      consumerId: options?.consumerId,
    };

    return this.createTokenizedCardV2(createDto);
  }

  /**
   * Create a network token from issuer account reference ID
   *
   * This method is used when the issuer has already provided an account reference ID.
   * This is common in scenarios where the card is already on file with the issuer,
   * or when working with issuer-specific tokenization programs.
   *
   * @param accountReferenceId - Unique identifier provided by the issuer for the account
   * @param cardType - Card network type (visa, mastercard, americanexpress)
   * @param options - Additional creation options
   * @param options.createInstrumentIdentifier - Whether to create an instrument identifier (default: true)
   * @param options.consumerId - Optional consumer/wallet identifier (max 24 chars for VTS)
   * @returns Promise resolving to the created tokenized card with network token details
   *
   * @example
   * ```typescript
   * const networkToken = await tokenizedCardService.createTokenFromIssuerReference(
   *   "c0e9dde7a241ec5e9e50cfd823a51c01",
   *   "visa",
   *   { createInstrumentIdentifier: true }
   * );
   * ```
   */
  async createTokenFromIssuerReference(
    accountReferenceId: string,
    cardType: "visa" | "mastercard" | "americanexpress",
    options?: {
      createInstrumentIdentifier?: boolean;
      consumerId?: string;
    }
  ): Promise<TokenizedCardResponseDto> {
    const createDto: TokenizedCardCreateDto = {
      source: "ISSUER",
      accountReferenceId,
      card: {
        type: this.mapCardTypeToCode(cardType),
      },
      createInstrumentIdentifier: options?.createInstrumentIdentifier ?? true,
      consumerId: options?.consumerId,
    };

    return this.createTokenizedCardV2(createDto);
  }

  /**
   * Create a network token from an existing network token (token-on-token)
   *
   * This method allows you to create a new network token from an existing network token
   * (sometimes called a "digital PAN"). This is useful when you need to provision a
   * network token to a new device or create a token for a different token requestor.
   *
   * @param existingToken - Existing network token details
   * @param existingToken.number - The existing network token number (digital PAN)
   * @param existingToken.expirationMonth - Two-digit expiration month (01-12)
   * @param existingToken.expirationYear - Four-digit expiration year (YYYY)
   * @param options - Additional creation options
   * @param options.createInstrumentIdentifier - Whether to create an instrument identifier (default: true)
   * @param options.consumerId - Optional consumer/wallet identifier (max 24 chars for VTS)
   * @returns Promise resolving to the created tokenized card with new network token details
   *
   * @example
   * ```typescript
   * const newNetworkToken = await tokenizedCardService.createTokenFromExistingToken({
   *   number: "4895370017256311", // existing network token
   *   expirationMonth: "12",
   *   expirationYear: "2031"
   * }, {
   *   createInstrumentIdentifier: true
   * });
   * ```
   */
  async createTokenFromExistingToken(
    existingToken: {
      number: string;
      expirationMonth: string;
      expirationYear: string;
    },
    options?: {
      createInstrumentIdentifier?: boolean;
      consumerId?: string;
    }
  ): Promise<TokenizedCardResponseDto> {
    const createDto: TokenizedCardCreateDto = {
      source: "TOKEN",
      card: {
        number: existingToken.number,
        expirationMonth: existingToken.expirationMonth,
        expirationYear: existingToken.expirationYear,
      },
      createInstrumentIdentifier: options?.createInstrumentIdentifier ?? true,
      consumerId: options?.consumerId,
    };

    return this.createTokenizedCardV2(createDto);
  }

  /**
   * Map friendly card type names to CyberSource codes
   * @param cardType Friendly card type name
   * @returns CyberSource card type code
   */
  private mapCardTypeToCode(
    cardType: "visa" | "mastercard" | "americanexpress"
  ): string {
    const typeMap: Record<string, string> = {
      visa: "001",
      mastercard: "002",
      americanexpress: "003",
    };

    return typeMap[cardType] || cardType;
  }
}
