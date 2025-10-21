import { Injectable, Logger } from "@nestjs/common";
import { CyberSourceService } from "../cybersource.service";
import {
  CustomerCreateDto,
  CustomerUpdateDto,
  CustomerResponseDto,
  CustomerListResponseDto,
  CustomerPaginationOptionsDto,
} from "../dto/customer.dto";
import {
  ShippingAddressCreateDto,
  ShippingAddressUpdateDto,
  ShippingAddressResponseDto,
  ShippingAddressListResponseDto,
  ShippingAddressPaginationOptionsDto,
} from "../dto/shipping-address.dto";

@Injectable()
export class CustomerService {
  private readonly logger = new Logger(CustomerService.name);

  constructor(private readonly cyberSourceService: CyberSourceService) {}

  /**
   * Create a new customer
   * @param createCustomerDto Customer data
   * @returns Promise<CustomerResponseDto>
   */
  async createCustomer(
    createCustomerDto: CustomerCreateDto
  ): Promise<CustomerResponseDto> {
    try {
      this.logger.log("Creating customer");
      const response = await this.cyberSourceService.tms.postCustomer(
        createCustomerDto
      );
      this.logger.log(
        `Customer created successfully with ID: ${response.data?.id}`
      );
      return response.data;
    } catch (error) {
      this.logger.error("Error creating customer:", error);
      throw error;
    }
  }

  /**
   * Retrieve a customer by ID
   * @param customerId Customer ID
   * @returns Promise<CustomerResponseDto>
   */
  async getCustomer(customerId: string): Promise<CustomerResponseDto> {
    try {
      this.logger.log(`Retrieving customer: ${customerId}`);
      const response = await this.cyberSourceService.tms.getCustomer(
        customerId
      );
      this.logger.log(`Customer retrieved successfully: ${customerId}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Error retrieving customer ${customerId}:`, error);
      throw error;
    }
  }

  /**
   * Update a customer
   * @param customerId Customer ID
   * @param updateCustomerDto Updated customer data
   * @returns Promise<CustomerResponseDto>
   */
  async updateCustomer(
    customerId: string,
    updateCustomerDto: CustomerUpdateDto
  ): Promise<CustomerResponseDto> {
    try {
      this.logger.log(`Updating customer: ${customerId}`);
      const response = await this.cyberSourceService.tms.patchCustomer(
        customerId,
        updateCustomerDto
      );
      this.logger.log(`Customer updated successfully: ${customerId}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Error updating customer ${customerId}:`, error);
      throw error;
    }
  }

  /**
   * Delete a customer
   * @param customerId Customer ID
   * @returns Promise<void>
   */
  async deleteCustomer(customerId: string): Promise<void> {
    try {
      this.logger.log(`Deleting customer: ${customerId}`);
      await this.cyberSourceService.tms.deleteCustomer(customerId);
      this.logger.log(`Customer deleted successfully: ${customerId}`);
    } catch (error) {
      this.logger.error(`Error deleting customer ${customerId}:`, error);
      throw error;
    }
  }

  /**
   * Create a shipping address for a customer
   * @param customerId Customer ID
   * @param createShippingAddressDto Shipping address data
   * @returns Promise<ShippingAddressResponseDto>
   */
  async createShippingAddress(
    customerId: string,
    createShippingAddressDto: ShippingAddressCreateDto
  ): Promise<ShippingAddressResponseDto> {
    try {
      this.logger.log(`Creating shipping address for customer: ${customerId}`);
      const response =
        await this.cyberSourceService.tms.postCustomerShippingAddress(
          customerId,
          createShippingAddressDto
        );
      this.logger.log(
        `Shipping address created successfully for customer ${customerId} with ID: ${response.data?.id}`
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `Error creating shipping address for customer ${customerId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Get all shipping addresses for a customer
   * @param customerId Customer ID
   * @param pagination Pagination options
   * @returns Promise<ShippingAddressListResponseDto>
   */
  async getShippingAddresses(
    customerId: string,
    pagination?: ShippingAddressPaginationOptionsDto
  ): Promise<ShippingAddressListResponseDto> {
    try {
      this.logger.log(
        `Retrieving shipping addresses for customer: ${customerId}`
      );
      const response =
        await this.cyberSourceService.tms.getCustomerShippingAddressesList(
          customerId,
          pagination
        );
      this.logger.log(
        `Shipping addresses retrieved successfully for customer ${customerId}. Count: ${response.data?.count}`
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `Error retrieving shipping addresses for customer ${customerId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Get a specific shipping address for a customer
   * @param customerId Customer ID
   * @param shippingAddressId Shipping address ID
   * @returns Promise<ShippingAddressResponseDto>
   */
  async getShippingAddress(
    customerId: string,
    shippingAddressId: string
  ): Promise<ShippingAddressResponseDto> {
    try {
      this.logger.log(
        `Retrieving shipping address ${shippingAddressId} for customer: ${customerId}`
      );
      const response =
        await this.cyberSourceService.tms.getCustomerShippingAddress(
          customerId,
          shippingAddressId
        );
      this.logger.log(
        `Shipping address ${shippingAddressId} retrieved successfully for customer ${customerId}`
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `Error retrieving shipping address ${shippingAddressId} for customer ${customerId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Update a shipping address for a customer
   * @param customerId Customer ID
   * @param shippingAddressId Shipping address ID
   * @param updateShippingAddressDto Updated shipping address data
   * @returns Promise<ShippingAddressResponseDto>
   */
  async updateShippingAddress(
    customerId: string,
    shippingAddressId: string,
    updateShippingAddressDto: ShippingAddressUpdateDto
  ): Promise<ShippingAddressResponseDto> {
    try {
      this.logger.log(
        `Updating shipping address ${shippingAddressId} for customer: ${customerId}`
      );
      const response =
        await this.cyberSourceService.tms.patchCustomersShippingAddress(
          customerId,
          shippingAddressId,
          updateShippingAddressDto
        );
      this.logger.log(
        `Shipping address ${shippingAddressId} updated successfully for customer ${customerId}`
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `Error updating shipping address ${shippingAddressId} for customer ${customerId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Delete a shipping address for a customer
   * @param customerId Customer ID
   * @param shippingAddressId Shipping address ID
   * @returns Promise<void>
   */
  async deleteShippingAddress(
    customerId: string,
    shippingAddressId: string
  ): Promise<void> {
    try {
      this.logger.log(
        `Deleting shipping address ${shippingAddressId} for customer: ${customerId}`
      );
      await this.cyberSourceService.tms.deleteCustomerShippingAddress(
        customerId,
        shippingAddressId
      );
      this.logger.log(
        `Shipping address ${shippingAddressId} deleted successfully for customer ${customerId}`
      );
    } catch (error) {
      this.logger.error(
        `Error deleting shipping address ${shippingAddressId} for customer ${customerId}:`,
        error
      );
      throw error;
    }
  }
}
