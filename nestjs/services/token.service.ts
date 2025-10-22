import { Injectable } from "@nestjs/common";
import { CyberSourceService } from "../cybersource.service";
import { BaseCyberSourceService } from "./base.service";
import { CreateTokenDto, CreateCustomerDto } from "../dto/payment.dto";
import {
  TokenResponse,
  CustomerResponse,
  CyberSourceErrorResponse,
} from "../dto/response.dto";
import { CyberSourceResult } from "./payment.service";

@Injectable()
export class TokenService extends BaseCyberSourceService {
  constructor(cyberSourceService: CyberSourceService) {
    super(cyberSourceService, TokenService.name);
  }

  /**
   * Create a payment token for card information
   */
  async createToken(
    request: CreateTokenDto
  ): Promise<CyberSourceResult<TokenResponse>> {
    try {
      this.logger.log("Creating payment token");

      const response = await this.cyberSourceService.tms.postPaymentInstrument(
        request
      );

      this.logger.log("Token created successfully", {
        id: response.data.id,
      });

      return {
        success: true,
        data: response.data as TokenResponse,
      };
    } catch (error: any) {
      this.logger.error("Token creation failed", {
        error: error.message,
      });

      return {
        success: false,
        error: this.parseTokenError(error),
      };
    }
  }

  /**
   * Create a customer profile (delegating to CustomerService for consistency)
   * @deprecated Use CustomerService.createCustomer instead
   */
  async createCustomer(
    request: CreateCustomerDto
  ): Promise<CyberSourceResult<CustomerResponse>> {
    try {
      this.logger.log("Creating customer profile");

      const response = await this.cyberSourceService.tms.postCustomer(request);

      this.logger.log("Customer created successfully", {
        id: response.data.id,
      });

      return {
        success: true,
        data: response.data as CustomerResponse,
      };
    } catch (error: any) {
      this.logger.error("Customer creation failed", {
        error: error.message,
      });

      return {
        success: false,
        error: this.parseTokenError(error),
      };
    }
  }

  /**
   * Get customer by ID (delegating to CustomerService for consistency)
   * @deprecated Use CustomerService.getCustomer instead
   */
  async getCustomer(
    customerId: string
  ): Promise<CyberSourceResult<CustomerResponse>> {
    try {
      this.logger.log("Retrieving customer", { customerId });

      const response = await this.cyberSourceService.tms.getCustomer(
        customerId
      );

      this.logger.log("Customer retrieved successfully", {
        id: response.data.id,
      });

      return {
        success: true,
        data: response.data as CustomerResponse,
      };
    } catch (error: any) {
      this.logger.error("Customer retrieval failed", {
        customerId,
        error: error.message,
      });

      return {
        success: false,
        error: this.parseTokenError(error),
      };
    }
  }

  /**
   * Update customer information (delegating to CustomerService for consistency)
   * @deprecated Use CustomerService.updateCustomer instead
   */
  async updateCustomer(
    customerId: string,
    request: Partial<CreateCustomerDto>
  ): Promise<CyberSourceResult<CustomerResponse>> {
    try {
      this.logger.log("Updating customer", { customerId });

      const response = await this.cyberSourceService.tms.patchCustomer(
        customerId,
        request
      );

      this.logger.log("Customer updated successfully", {
        id: response.data.id,
      });

      return {
        success: true,
        data: response.data as CustomerResponse,
      };
    } catch (error: any) {
      this.logger.error("Customer update failed", {
        customerId,
        error: error.message,
      });

      return {
        success: false,
        error: this.parseTokenError(error),
      };
    }
  }

  /**
   * Delete customer (delegating to CustomerService for consistency)
   * @deprecated Use CustomerService.deleteCustomer instead
   */
  async deleteCustomer(customerId: string): Promise<CyberSourceResult<void>> {
    try {
      this.logger.log("Deleting customer", { customerId });

      await this.cyberSourceService.tms.deleteCustomer(customerId);

      this.logger.log("Customer deleted successfully", {
        id: customerId,
      });

      return {
        success: true,
      };
    } catch (error: any) {
      this.logger.error("Customer deletion failed", {
        customerId,
        error: error.message,
      });

      return {
        success: false,
        error: this.parseTokenError(error),
      };
    }
  }

  /**
   * Get payment instrument (token) details
   */
  async getPaymentInstrument(
    customerId: string,
    paymentInstrumentId: string
  ): Promise<CyberSourceResult<TokenResponse>> {
    try {
      this.logger.log("Retrieving payment instrument", {
        customerId,
        paymentInstrumentId,
      });

      const response = await this.cyberSourceService.tms.getPaymentInstrument(
        customerId,
        paymentInstrumentId
      );

      this.logger.log("Payment instrument retrieved successfully", {
        id: response.data.id,
      });

      return {
        success: true,
        data: response.data as TokenResponse,
      };
    } catch (error: any) {
      this.logger.error("Payment instrument retrieval failed", {
        customerId,
        paymentInstrumentId,
        error: error.message,
      });

      return {
        success: false,
        error: this.parseTokenError(error),
      };
    }
  }

  /**
   * Create payment instrument for existing customer
   */
  async createPaymentInstrument(
    customerId: string,
    request: CreateTokenDto
  ): Promise<CyberSourceResult<TokenResponse>> {
    try {
      this.logger.log("Creating payment instrument for customer", {
        customerId,
      });

      const response = await this.cyberSourceService.tms.postPaymentInstrument(
        customerId,
        request
      );

      this.logger.log("Payment instrument created successfully", {
        id: response.data.id,
      });

      return {
        success: true,
        data: response.data as TokenResponse,
      };
    } catch (error: any) {
      this.logger.error("Payment instrument creation failed", {
        customerId,
        error: error.message,
      });

      return {
        success: false,
        error: this.parseTokenError(error),
      };
    }
  }

  /**
   * Delete payment instrument
   */
  async deletePaymentInstrument(
    customerId: string,
    paymentInstrumentId: string
  ): Promise<CyberSourceResult<void>> {
    try {
      this.logger.log("Deleting payment instrument", {
        customerId,
        paymentInstrumentId,
      });

      await this.cyberSourceService.tms.deletePaymentInstrument(
        customerId,
        paymentInstrumentId
      );

      this.logger.log("Payment instrument deleted successfully", {
        customerId,
        paymentInstrumentId,
      });

      return {
        success: true,
      };
    } catch (error: any) {
      this.logger.error("Payment instrument deletion failed", {
        customerId,
        paymentInstrumentId,
        error: error.message,
      });

      return {
        success: false,
        error: this.parseTokenError(error),
      };
    }
  }

  private parseTokenError(error: any): CyberSourceErrorResponse {
    if (error.response?.data) {
      return error.response.data;
    }

    return {
      submitTimeUtc: new Date().toISOString(),
      status: "ERROR",
      reason: "SYSTEM_ERROR",
      message: error.message || "An unexpected error occurred",
    };
  }
}
