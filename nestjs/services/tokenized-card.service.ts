import { Injectable } from "@nestjs/common";
import { CyberSourceService } from "../cybersource.service";
import { BaseCyberSourceService } from "./base.service";
import {
  TokenizedCardRequest,
  TokenizedCardResponse,
} from "../interfaces/payment-instrument.interfaces";

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
}
