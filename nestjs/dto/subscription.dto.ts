/**
 * Data Transfer Objects for RBS (Recurring Billing Subscriptions) Subscriptions
 */

export interface SubscriptionCreateDto {
  /**
   * Client reference information
   */
  clientReferenceInformation?: {
    /**
     * Brief description of the subscription or any comment you wish to add to the subscription.
     */
    comments?: string;
    partner?: {
      /**
       * Identifier for the developer that helped integrate a partner solution to CyberSource.
       */
      developerId?: string;
      /**
       * Identifier for the partner that is integrated to CyberSource.
       */
      solutionId?: string;
    };
    /**
     * The name of the Connection Method client
     */
    applicationName?: string;
    /**
     * Version of the CyberSource application or integration used
     */
    applicationVersion?: string;
    /**
     * The entity that is responsible for running the transaction
     */
    applicationUser?: string;
  };

  /**
   * Subscription information
   */
  subscriptionInformation?: {
    /**
     * Subscription code is an optional field, If not provided system generates and assign one
     */
    code?: string;
    /**
     * Subscription name
     */
    name?: string;
    /**
     * Subscription description
     */
    description?: string;
    /**
     * Start date for the subscription in ISO 8601 format
     */
    startDate?: string;
    /**
     * End date for the subscription in ISO 8601 format
     */
    endDate?: string;
    /**
     * Plan ID to associate with this subscription
     */
    planId?: string;
  };

  /**
   * Payment information
   */
  paymentInformation?: {
    /**
     * Customer payment instrument token
     */
    customer?: {
      /**
       * Customer ID
       */
      id?: string;
    };
    /**
     * Payment instrument token
     */
    paymentInstrument?: {
      /**
       * Payment instrument ID
       */
      id?: string;
    };
  };

  /**
   * Processing information
   */
  processingInformation?: {
    /**
     * Business application
     */
    businessApplication?: string;
    /**
     * Commerce indicator
     */
    commerceIndicator?: string;
  };
}

export interface SubscriptionUpdateDto {
  /**
   * Subscription information for updates
   */
  subscriptionInformation?: {
    /**
     * Subscription name
     */
    name?: string;
    /**
     * Subscription description
     */
    description?: string;
    /**
     * Start date for the subscription in ISO 8601 format
     */
    startDate?: string;
    /**
     * End date for the subscription in ISO 8601 format
     */
    endDate?: string;
    /**
     * Plan ID to associate with this subscription
     */
    planId?: string;
  };

  /**
   * Payment information
   */
  paymentInformation?: {
    /**
     * Customer payment instrument token
     */
    customer?: {
      /**
       * Customer ID
       */
      id?: string;
    };
    /**
     * Payment instrument token
     */
    paymentInstrument?: {
      /**
       * Payment instrument ID
       */
      id?: string;
    };
  };
}

export interface SubscriptionResponseDto {
  /**
   * Resource links
   */
  _links?: {
    self?: {
      href?: string;
    };
    plan?: {
      href?: string;
    };
    customer?: {
      href?: string;
    };
  };

  /**
   * Subscription ID
   */
  id?: string;

  /**
   * Subscription information
   */
  subscriptionInformation?: {
    /**
     * Subscription code
     */
    code?: string;
    /**
     * Subscription name
     */
    name?: string;
    /**
     * Subscription description
     */
    description?: string;
    /**
     * Start date for the subscription
     */
    startDate?: string;
    /**
     * End date for the subscription
     */
    endDate?: string;
    /**
     * Plan ID associated with this subscription
     */
    planId?: string;
  };

  /**
   * Payment information
   */
  paymentInformation?: {
    customer?: {
      id?: string;
    };
    paymentInstrument?: {
      id?: string;
    };
  };

  /**
   * Processing information
   */
  processingInformation?: {
    businessApplication?: string;
    commerceIndicator?: string;
  };

  /**
   * Submission time
   */
  submitTimeUtc?: string;

  /**
   * Subscription status
   */
  status?: string;

  /**
   * Plan information
   */
  planInformation?: {
    code?: string;
    name?: string;
    description?: string;
    status?: string;
    billingCycles?: {
      frequency?: string;
      totalCycles?: number;
    };
  };
}

export interface SubscriptionListResponseDto {
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
   * The offset parameter supplied in the request
   */
  offset?: number;

  /**
   * The limit parameter supplied in the request
   */
  limit?: number;

  /**
   * The number of subscriptions returned in the array
   */
  count?: number;

  /**
   * The total number of subscriptions
   */
  total?: number;

  /**
   * Embedded subscription resources
   */
  _embedded?: {
    subscriptions?: SubscriptionResponseDto[];
  };
}

export interface SubscriptionPaginationOptionsDto {
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

export interface FollowOnSubscriptionDto {
  /**
   * Client reference information
   */
  clientReferenceInformation?: {
    comments?: string;
  };

  /**
   * Subscription information for follow-on subscription
   */
  subscriptionInformation?: {
    code?: string;
    name?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    planId?: string;
  };
}
