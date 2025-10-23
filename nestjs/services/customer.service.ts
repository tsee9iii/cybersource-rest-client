import { Injectable } from "@nestjs/common";
import { CyberSourceService } from "../cybersource.service";
import { BaseCyberSourceService } from "./base.service";
import {
  CustomerCreateDto,
  CustomerUpdateDto,
  CustomerResponseDto,
  CustomerPaginationOptionsDto,
} from "../dto/customer.dto";
import {
  ShippingAddressCreateDto,
  ShippingAddressUpdateDto,
  ShippingAddressResponseDto,
  ShippingAddressListResponseDto,
  ShippingAddressPaginationOptionsDto,
} from "../dto/shipping-address.dto";
import {
  CustomerPaymentInstrumentCreateDto,
  CustomerPaymentInstrumentUpdateDto,
  CustomerPaymentInstrumentResponseDto,
  CustomerPaymentInstrumentListResponseDto,
  CustomerPaymentInstrumentPaginationOptionsDto,
} from "../dto/customer-payment-instrument.dto";

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

  // Payment Instrument Management Methods

  /**
   * Create a payment instrument for a customer
   * @param customerId Customer ID
   * @param createPaymentInstrumentDto Payment instrument data
   * @returns Promise<CustomerPaymentInstrumentResponseDto>
   */
  async createPaymentInstrument(
    customerId: string,
    createPaymentInstrumentDto: CustomerPaymentInstrumentCreateDto
  ): Promise<CustomerPaymentInstrumentResponseDto> {
    return this.executeApiCall(
      "Creating payment instrument for customer",
      () =>
        this.cyberSourceService.tms.postCustomerPaymentInstrument(
          customerId,
          createPaymentInstrumentDto
        ),
      {
        customerId,
        ...this.sanitizeRequestForLogging({ createPaymentInstrumentDto }),
      }
    );
  }

  /**
   * Get all payment instruments for a customer
   * @param customerId Customer ID
   * @param pagination Pagination options
   * @returns Promise<CustomerPaymentInstrumentListResponseDto>
   */
  async getPaymentInstruments(
    customerId: string,
    pagination?: CustomerPaymentInstrumentPaginationOptionsDto
  ): Promise<CustomerPaymentInstrumentListResponseDto> {
    return this.executeApiCall(
      "Retrieving payment instruments for customer",
      () =>
        this.cyberSourceService.tms.getCustomerPaymentInstrumentsList(
          customerId,
          pagination
        ),
      { customerId, pagination }
    );
  }

  /**
   * Get a specific payment instrument for a customer
   * @param customerId Customer ID
   * @param paymentInstrumentId Payment instrument ID
   * @returns Promise<CustomerPaymentInstrumentResponseDto>
   */
  async getPaymentInstrument(
    customerId: string,
    paymentInstrumentId: string
  ): Promise<CustomerPaymentInstrumentResponseDto> {
    return this.executeApiCall(
      "Retrieving payment instrument for customer",
      () =>
        this.cyberSourceService.tms.getCustomerPaymentInstrument(
          customerId,
          paymentInstrumentId
        ),
      { customerId, paymentInstrumentId }
    );
  }

  /**
   * Update a payment instrument for a customer
   * @param customerId Customer ID
   * @param paymentInstrumentId Payment instrument ID
   * @param updatePaymentInstrumentDto Updated payment instrument data
   * @returns Promise<CustomerPaymentInstrumentResponseDto>
   */
  async updatePaymentInstrument(
    customerId: string,
    paymentInstrumentId: string,
    updatePaymentInstrumentDto: CustomerPaymentInstrumentUpdateDto
  ): Promise<CustomerPaymentInstrumentResponseDto> {
    return this.executeApiCall(
      "Updating payment instrument for customer",
      () =>
        this.cyberSourceService.tms.patchCustomerPaymentInstrument(
          customerId,
          paymentInstrumentId,
          updatePaymentInstrumentDto
        ),
      {
        customerId,
        paymentInstrumentId,
        ...this.sanitizeRequestForLogging({ updatePaymentInstrumentDto }),
      }
    );
  }

  /**
   * Delete a payment instrument for a customer
   * @param customerId Customer ID
   * @param paymentInstrumentId Payment instrument ID
   * @returns Promise<void>
   */
  async deletePaymentInstrument(
    customerId: string,
    paymentInstrumentId: string
  ): Promise<void> {
    return this.executeVoidApiCall(
      "Deleting payment instrument for customer",
      () =>
        this.cyberSourceService.tms.deleteCustomerPaymentInstrument(
          customerId,
          paymentInstrumentId
        ),
      { customerId, paymentInstrumentId }
    );
  }
}
