export interface CustomerCreateDto {
  /**
   * The Id of the Customer Token.
   */
  id?: string;

  /**
   * Object information about the customer
   */
  objectInformation?: {
    /**
     * Name or title of the customer.
     */
    title?: string;
    /**
     * Comments that you can make about the customer.
     */
    comment?: string;
  };

  /**
   * Customer information
   */
  buyerInformation?: {
    /**
     * Your identifier for the customer.
     */
    merchantCustomerID?: string;
    /**
     * Customer's primary email address, including the full domain name.
     */
    email?: string;
  };

  /**
   * Client reference information
   */
  clientReferenceInformation?: {
    /**
     * Client-generated order reference or tracking number.
     */
    code?: string;
  };

  /**
   * Object containing the custom data that the merchant defines.
   */
  merchantDefinedInformation?: Array<{
    /**
     * The number you assign as the name for your merchant-defined data or secure field.
     * Possible Values: data1, data2, data3, data4, sensitive1, sensitive2, sensitive3, sensitive4
     */
    name?: string;
    /**
     * The value you assign for your merchant-defined data field.
     */
    value?: string;
  }>;

  /**
   * Default payment instrument
   */
  defaultPaymentInstrument?: {
    /**
     * The Id of the Customers default Payment Instrument
     */
    id?: string;
  };

  /**
   * Default shipping address
   */
  defaultShippingAddress?: {
    /**
     * The Id of the Customers default Shipping Address
     */
    id?: string;
  };
}

export interface CustomerUpdateDto {
  /**
   * Object information about the customer
   */
  objectInformation?: {
    /**
     * Name or title of the customer.
     */
    title?: string;
    /**
     * Comments that you can make about the customer.
     */
    comment?: string;
  };

  /**
   * Customer information
   */
  buyerInformation?: {
    /**
     * Your identifier for the customer.
     */
    merchantCustomerID?: string;
    /**
     * Customer's primary email address, including the full domain name.
     */
    email?: string;
  };

  /**
   * Client reference information
   */
  clientReferenceInformation?: {
    /**
     * Client-generated order reference or tracking number.
     */
    code?: string;
  };

  /**
   * Object containing the custom data that the merchant defines.
   */
  merchantDefinedInformation?: Array<{
    /**
     * The number you assign as the name for your merchant-defined data or secure field.
     * Possible Values: data1, data2, data3, data4, sensitive1, sensitive2, sensitive3, sensitive4
     */
    name?: string;
    /**
     * The value you assign for your merchant-defined data field.
     */
    value?: string;
  }>;

  /**
   * Default payment instrument
   */
  defaultPaymentInstrument?: {
    /**
     * The Id of the Customers default Payment Instrument
     */
    id?: string;
  };

  /**
   * Default shipping address
   */
  defaultShippingAddress?: {
    /**
     * The Id of the Customers default Shipping Address
     */
    id?: string;
  };
}

export interface CustomerLinksDto {
  self?: {
    href?: string;
  };
  paymentInstruments?: {
    href?: string;
  };
  shippingAddress?: {
    href?: string;
  };
}

export interface PaymentInstrumentSummaryDto {
  _links?: {
    self?: {
      href?: string;
    };
    customer?: {
      href?: string;
    };
  };
  id?: string;
  object?: string;
  default?: boolean;
  state?: string;
  type?: string;
  card?: {
    expirationMonth?: string;
    expirationYear?: string;
    type?: string;
    hash?: string;
  };
  metadata?: {
    creator?: string;
  };
}

export interface ShippingAddressSummaryDto {
  _links?: {
    self?: {
      href?: string;
    };
    customer?: {
      href?: string;
    };
  };
  id?: string;
  default?: boolean;
  shipTo?: {
    firstName?: string;
    lastName?: string;
    company?: string;
    address1?: string;
    address2?: string;
    locality?: string;
    administrativeArea?: string;
    postalCode?: string;
    country?: string;
    email?: string;
    phoneNumber?: string;
  };
  metadata?: {
    creator?: string;
  };
}

export interface CustomerResponseDto {
  /**
   * Resource links
   */
  _links?: CustomerLinksDto;

  /**
   * The Id of the Customer Token.
   */
  id?: string;

  /**
   * Object information about the customer
   */
  objectInformation?: {
    /**
     * Name or title of the customer.
     */
    title?: string;
    /**
     * Comments that you can make about the customer.
     */
    comment?: string;
  };

  /**
   * Customer information
   */
  buyerInformation?: {
    /**
     * Your identifier for the customer.
     */
    merchantCustomerID?: string;
    /**
     * Customer's primary email address, including the full domain name.
     */
    email?: string;
  };

  /**
   * Client reference information
   */
  clientReferenceInformation?: {
    /**
     * Client-generated order reference or tracking number.
     */
    code?: string;
  };

  /**
   * Object containing the custom data that the merchant defines.
   */
  merchantDefinedInformation?: Array<{
    /**
     * The number you assign as the name for your merchant-defined data or secure field.
     * Possible Values: data1, data2, data3, data4, sensitive1, sensitive2, sensitive3, sensitive4
     */
    name?: string;
    /**
     * The value you assign for your merchant-defined data field.
     */
    value?: string;
  }>;

  /**
   * Default payment instrument
   */
  defaultPaymentInstrument?: {
    /**
     * The Id of the Customers default Payment Instrument
     */
    id?: string;
  };

  /**
   * Default shipping address
   */
  defaultShippingAddress?: {
    /**
     * The Id of the Customers default Shipping Address
     */
    id?: string;
  };

  /**
   * Metadata about the customer
   */
  metadata?: {
    /**
     * The creator of the Customer.
     */
    creator?: string;
  };

  /**
   * Additional embedded resources
   */
  _embedded?: {
    defaultPaymentInstrument?: PaymentInstrumentSummaryDto;
    defaultShippingAddress?: ShippingAddressSummaryDto;
  };
}

export interface CustomerListResponseDto {
  /**
   * Links for pagination
   */
  _links?: {
    self?: { href?: string };
    first?: { href?: string };
    prev?: { href?: string };
    next?: { href?: string };
    last?: { href?: string };
  };

  /**
   * The offset parameter supplied in the request.
   */
  offset?: number;

  /**
   * The limit parameter supplied in the request.
   */
  limit?: number;

  /**
   * The number of Customers returned in the array.
   */
  count?: number;

  /**
   * The total number of Customers.
   */
  total?: number;

  /**
   * Embedded customer resources
   */
  _embedded?: {
    customers?: CustomerResponseDto[];
  };
}

export interface CustomerPaginationOptionsDto {
  /**
   * Starting record in zero-based dataset that should be returned as the first object in the array.
   * Default is 0.
   */
  offset?: number;

  /**
   * The maximum number that can be returned in the array starting from the offset record in zero-based dataset.
   * Default is 20, maximum is 100.
   */
  limit?: number;
}
