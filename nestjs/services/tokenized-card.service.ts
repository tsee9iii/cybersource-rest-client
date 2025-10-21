import { Injectable, Logger } from "@nestjs/common";
import { CyberSourceService } from "../cybersource.service";
import {
  TokenizedCardRequest,
  TokenizedCardResponse,
} from "../interfaces/payment-instrument.interfaces";

@Injectable()
export class TokenizedCardService {
  private readonly logger = new Logger(TokenizedCardService.name);

  constructor(private readonly cyberSourceService: CyberSourceService) {}

  /**
   * Create a tokenized card (network token)
   * @param tokenizedCardData Tokenized card data
   * @returns Promise<TokenizedCardResponse>
   */
  async createTokenizedCard(
    tokenizedCardData: TokenizedCardRequest
  ): Promise<TokenizedCardResponse> {
    try {
      this.logger.log("Creating tokenized card (network token)");

      const response = await this.cyberSourceService.tms.postTokenizedCard(
        tokenizedCardData
      );

      this.logger.log(
        `Tokenized card created successfully with ID: ${response.data?.id}`
      );
      return response.data;
    } catch (error) {
      this.logger.error("Error creating tokenized card:", error);
      throw error;
    }
  }

  /**
   * Retrieve a specific tokenized card
   * @param tokenizedCardId Tokenized card ID
   * @returns Promise<TokenizedCardResponse>
   */
  async getTokenizedCard(
    tokenizedCardId: string
  ): Promise<TokenizedCardResponse> {
    try {
      this.logger.log(`Retrieving tokenized card: ${tokenizedCardId}`);

      const response = await this.cyberSourceService.tms.getTokenizedCard(
        tokenizedCardId
      );

      this.logger.log(
        `Tokenized card retrieved successfully: ${tokenizedCardId}`
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `Error retrieving tokenized card ${tokenizedCardId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Delete a tokenized card
   * @param tokenizedCardId Tokenized card ID
   * @returns Promise<void>
   */
  async deleteTokenizedCard(tokenizedCardId: string): Promise<void> {
    try {
      this.logger.log(`Deleting tokenized card: ${tokenizedCardId}`);

      await this.cyberSourceService.tms.deleteTokenizedCard(tokenizedCardId);

      this.logger.log(
        `Tokenized card deleted successfully: ${tokenizedCardId}`
      );
    } catch (error) {
      this.logger.error(
        `Error deleting tokenized card ${tokenizedCardId}:`,
        error
      );
      throw error;
    }
  }
}
