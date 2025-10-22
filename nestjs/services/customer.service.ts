import { Injectable } from "@nestjs/common";
import { CyberSourceService } from "../cybersource.service";
import { BaseCyberSourceService } from "./base.service";
import {
  CustomerCreateDto,
  CustomerUpdateDto,
  CustomerResponseDto,
} from "../dto/customer.dto";
import {
  ShippingAddressCreateDto,
  ShippingAddressUpdateDto,
  ShippingAddressResponseDto,
  ShippingAddressListResponseDto,
  ShippingAddressPaginationOptionsDto,
} from "../dto/shipping-address.dto";

@Injectable()
export class CustomerService extends BaseCyberSourceService {
  constructor(cyberSourceService: CyberSourceService) {
    super(cyberSourceService, CustomerService.name);
  }

  /**
   * Create a new customer
   * @param createCustomerDto Customer data
   * @returns Promise<CustomerResponseDto>
   */
  async createCustomer(
    createCustomerDto: CustomerCreateDto
  ): Promise<CustomerResponseDto> {
    return this.executeApiCall(
      "Creating customer",
      () => this.cyberSourceService.tms.postCustomer(createCustomerDto),
      this.sanitizeRequestForLogging({ createCustomerDto })
    );
  }

  /**
   * Retrieve a customer by ID
   * @param customerId Customer ID
   * @returns Promise<CustomerResponseDto>
   */
  async getCustomer(customerId: string): Promise<CustomerResponseDto> {
    return this.executeApiCall(
      "Retrieving customer",
      () => this.cyberSourceService.tms.getCustomer(customerId),
      { customerId }
    );
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
    return this.executeApiCall(
      "Updating customer",
      () =>
        this.cyberSourceService.tms.patchCustomer(
          customerId,
          updateCustomerDto
        ),
      { customerId, ...this.sanitizeRequestForLogging({ updateCustomerDto }) }
    );
  }

  /**
   * Delete a customer
   * @param customerId Customer ID
   * @returns Promise<void>
   */
  async deleteCustomer(customerId: string): Promise<void> {
    return this.executeVoidApiCall(
      "Deleting customer",
      () => this.cyberSourceService.tms.deleteCustomer(customerId),
      { customerId }
    );
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
    return this.executeApiCall(
      "Creating shipping address for customer",
      () =>
        this.cyberSourceService.tms.postCustomerShippingAddress(
          customerId,
          createShippingAddressDto
        ),
      {
        customerId,
        ...this.sanitizeRequestForLogging({ createShippingAddressDto }),
      }
    );
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
    return this.executeApiCall(
      "Retrieving shipping addresses for customer",
      () =>
        this.cyberSourceService.tms.getCustomerShippingAddressesList(
          customerId,
          pagination
        ),
      { customerId, pagination }
    );
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
    return this.executeApiCall(
      "Retrieving shipping address for customer",
      () =>
        this.cyberSourceService.tms.getCustomerShippingAddress(
          customerId,
          shippingAddressId
        ),
      { customerId, shippingAddressId }
    );
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
    return this.executeApiCall(
      "Updating shipping address for customer",
      () =>
        this.cyberSourceService.tms.patchCustomersShippingAddress(
          customerId,
          shippingAddressId,
          updateShippingAddressDto
        ),
      {
        customerId,
        shippingAddressId,
        ...this.sanitizeRequestForLogging({ updateShippingAddressDto }),
      }
    );
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
    return this.executeVoidApiCall(
      "Deleting shipping address for customer",
      () =>
        this.cyberSourceService.tms.deleteCustomerShippingAddress(
          customerId,
          shippingAddressId
        ),
      { customerId, shippingAddressId }
    );
  }
}
