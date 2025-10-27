export interface ShippingAddressCreateDto {
  /**
   * The Id of the Shipping Address Token.
   * Min length: 1, Max length: 32
   */
  id?: string;

  /**
   * Flag that indicates whether customer shipping address is the default.
   * Possible Values:
   * - `true`: Shipping Address is customer's default.
   * - `false`: Shipping Address is not customer's default.
   */
  default?: boolean;

  /**
   * Shipping information
   */
  shipTo?: {
    /**
     * First name of the recipient
     * Max length: 60
     */
    firstName?: string;
    /**
     * Last name of the recipient
     * Max length: 60
     */
    lastName?: string;
    /**
     * Company associated with the shipping address
     * Max length: 60
     */
    company?: string;
    /**
     * First line of the shipping address
     * Max length: 60
     */
    address1?: string;
    /**
     * Second line of the shipping address
     * Max length: 60
     */
    address2?: string;
    /**
     * City of the shipping address
     * Max length: 50
     */
    locality?: string;
    /**
     * State or province of the shipping address. Use 2 character State, Province, and Territory Codes for the United States and Canada
     * Max length: 20
     */
    administrativeArea?: string;
    /**
     * Postal code for the shipping address. The postal code must consist of 5 to 9 digits
     * Max length: 10
     *
     * When the billing country is the U.S., the 9-digit postal code must follow this format:
     * [5 digits][dash][4 digits]
     *
     * Example 12345-6789
     *
     * When the billing country is Canada, the 6-digit postal code must follow this format:
     * [alpha][numeric][alpha][space][numeric][alpha][numeric]
     *
     * Example A1B 2C3
     *
     * **American Express Direct**
     * Before sending the postal code to the processor, all nonalphanumeric characters are removed and, if the
     * remaining value is longer than nine characters, truncates the value starting from the right side.
     */
    postalCode?: string;
    /**
     * Country of the shipping address. Use the two-character ISO Standard Country Codes
     * Max length: 2
     */
    country?: string;
    /**
     * Email associated with the shipping address
     * Max length: 320
     */
    email?: string;
    /**
     * Phone number associated with the shipping address
     * Max length: 15
     */
    phoneNumber?: string;
  };
}

export interface ShippingAddressUpdateDto {
  /**
   * The Id of the Shipping Address Token.
   * Min length: 1, Max length: 32
   */
  id?: string;

  /**
   * Flag that indicates whether customer shipping address is the default.
   * Possible Values:
   * - `true`: Shipping Address is customer's default.
   * - `false`: Shipping Address is not customer's default.
   */
  default?: boolean;

  /**
   * Shipping information
   */
  shipTo?: {
    /**
     * First name of the recipient
     * Max length: 60
     */
    firstName?: string;
    /**
     * Last name of the recipient
     * Max length: 60
     */
    lastName?: string;
    /**
     * Company associated with the shipping address
     * Max length: 60
     */
    company?: string;
    /**
     * First line of the shipping address
     * Max length: 60
     */
    address1?: string;
    /**
     * Second line of the shipping address
     * Max length: 60
     */
    address2?: string;
    /**
     * City of the shipping address
     * Max length: 50
     */
    locality?: string;
    /**
     * State or province of the shipping address. Use 2 character State, Province, and Territory Codes for the United States and Canada
     * Max length: 20
     */
    administrativeArea?: string;
    /**
     * Postal code for the shipping address. The postal code must consist of 5 to 9 digits
     * Max length: 10
     *
     * When the billing country is the U.S., the 9-digit postal code must follow this format:
     * [5 digits][dash][4 digits]
     *
     * Example 12345-6789
     *
     * When the billing country is Canada, the 6-digit postal code must follow this format:
     * [alpha][numeric][alpha][space][numeric][alpha][numeric]
     *
     * Example A1B 2C3
     *
     * **American Express Direct**
     * Before sending the postal code to the processor, all nonalphanumeric characters are removed and, if the
     * remaining value is longer than nine characters, truncates the value starting from the right side.
     */
    postalCode?: string;
    /**
     * Country of the shipping address. Use the two-character ISO Standard Country Codes
     * Max length: 2
     */
    country?: string;
    /**
     * Email associated with the shipping address
     * Max length: 320
     */
    email?: string;
    /**
     * Phone number associated with the shipping address
     * Max length: 15
     */
    phoneNumber?: string;
  };
}

export interface ShippingAddressLinksDto {
  self?: {
    href?: string;
  };
  customer?: {
    href?: string;
  };
}

export interface ShippingAddressResponseDto {
  /**
   * Resource links
   */
  _links?: ShippingAddressLinksDto;

  /**
   * The Id of the Shipping Address Token
   * Min length: 1, Max length: 32
   */
  id?: string;

  /**
   * Flag that indicates whether customer shipping address is the default.
   * Possible Values:
   * - `true`: Shipping Address is customer's default.
   * - `false`: Shipping Address is not customer's default.
   */
  default?: boolean;

  /**
   * Shipping information
   */
  shipTo?: {
    /**
     * First name of the recipient
     * Max length: 60
     */
    firstName?: string;
    /**
     * Last name of the recipient
     * Max length: 60
     */
    lastName?: string;
    /**
     * Company associated with the shipping address
     * Max length: 60
     */
    company?: string;
    /**
     * First line of the shipping address
     * Max length: 60
     */
    address1?: string;
    /**
     * Second line of the shipping address
     * Max length: 60
     */
    address2?: string;
    /**
     * City of the shipping address
     * Max length: 50
     */
    locality?: string;
    /**
     * State or province of the shipping address. Use 2 character State, Province, and Territory Codes for the United States and Canada
     * Max length: 20
     */
    administrativeArea?: string;
    /**
     * Postal code for the shipping address. The postal code must consist of 5 to 9 digits
     * Max length: 10
     *
     * When the billing country is the U.S., the 9-digit postal code must follow this format:
     * [5 digits][dash][4 digits]
     *
     * Example 12345-6789
     *
     * When the billing country is Canada, the 6-digit postal code must follow this format:
     * [alpha][numeric][alpha][space][numeric][alpha][numeric]
     *
     * Example A1B 2C3
     *
     * **American Express Direct**
     * Before sending the postal code to the processor, all nonalphanumeric characters are removed and, if the
     * remaining value is longer than nine characters, truncates the value starting from the right side.
     */
    postalCode?: string;
    /**
     * Country of the shipping address. Use the two-character ISO Standard Country Codes
     * Max length: 2
     */
    country?: string;
    /**
     * Email associated with the shipping address
     * Max length: 320
     */
    email?: string;
    /**
     * Phone number associated with the shipping address
     * Max length: 15
     */
    phoneNumber?: string;
  };

  /**
   * Metadata about the shipping address
   */
  metadata?: {
    /**
     * The creator of the Shipping Address.
     */
    creator?: string;
  };
}

export interface ShippingAddressListResponseDto {
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
   * The number of Shipping Addresses returned in the array.
   */
  count?: number;

  /**
   * The total number of Shipping Addresses associated with the Customer.
   */
  total?: number;

  /**
   * Embedded shipping address resources
   */
  _embedded?: {
    shippingAddresses?: ShippingAddressResponseDto[];
  };
}

export interface ShippingAddressPaginationOptionsDto {
  /**
   * Starting record in zero-based dataset that should be returned as the first object in the array.
   * Default is 0, Minimum: 0
   */
  offset?: number;

  /**
   * The maximum number that can be returned in the array starting from the offset record in zero-based dataset.
   * Default is 20, Minimum: 1, Maximum: 100
   */
  limit?: number;
}
