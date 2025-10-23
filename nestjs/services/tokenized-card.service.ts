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
   * Create a network token from card information
   * @param card Card details
   * @param options Creation options
   * @returns Promise<TokenizedCardResponseDto>
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
   * Create a network token from issuer account reference
   * @param accountReferenceId Issuer account reference ID
   * @param cardType Card network type
   * @param options Creation options
   * @returns Promise<TokenizedCardResponseDto>
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
   * Create a network token from an existing network token
   * @param existingToken Existing network token details
   * @param options Creation options
   * @returns Promise<TokenizedCardResponseDto>
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
