/**
 * Data Transfer Objects for RBS (Recurring Billing Subscriptions) Subscriptions
 * Based on CyberSource API v1 specification
 */

export interface SubscriptionCreateDto {
  /**
   * Client reference information
   */
  clientReferenceInformation?: {
    /**
     * Merchant-generated order reference or tracking number (Deprecated: This field is ignored)
     */
    code?: string;
    /**
     * Brief description of the order or any comment you wish to add to the order (Deprecated: This field is ignored)
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
     * The name of the Connection Method client (Deprecated: This field is ignored)
     */
    applicationName?: string;
    /**
     * Version of the CyberSource application or integration used (Deprecated: This field is ignored)
     */
    applicationVersion?: string;
    /**
     * The entity that is responsible for running the transaction (Deprecated: This field is ignored)
     */
    applicationUser?: string;
  };

  /**
   * Processing information
   */
  processingInformation?: {
    /**
     * Commerce Indicator is a way to identify the type of transaction.
     * Valid values: MOTO, RECURRING, INTERNET
     */
    commerceIndicator?: "MOTO" | "RECURRING" | "INTERNET";
    authorizationOptions?: {
      initiator?: {
        /**
         * This field indicates whether the transaction is a merchant-initiated transaction or customer-initiated transaction.
         * Valid values: customer, merchant
         */
        type?: "customer" | "merchant";
      };
    };
  };

  /**
   * Plan information (for independent subscriptions without linking to a plan)
   */
  planInformation?: {
    /**
     * Billing Frequency
     */
    billingPeriod?: {
      /**
       * Example:
       * - If length=1 & unit=month then charge every month
       * - If length=7 & unit=day then charge every 7th day
       */
      length?: string;
      /**
       * Calendar unit values.
       * - D - day
       * - M - month
       * - W - week
       * - Y - year
       */
      unit?: "D" | "M" | "W" | "Y";
    };
    /**
     * Number of times customer is going to be billed
     */
    billingCycles?: {
      /**
       * Describe total number of billing cycles
       */
      total?: string;
    };
  };

  /**
   * Subscription information (REQUIRED)
   */
  subscriptionInformation: {
    /**
     * Subscription code is an optional field, If not provided system generates and assign one
     */
    code?: string;
    /**
     * Plan Id. Use Plan Id from Create Plan Service.
     */
    planId?: string;
    /**
     * Subscription Name (REQUIRED)
     */
    name: string;
    /**
     * Start date of the Subscription (REQUIRED)
     * Start date must be in UTC. Format: YYYY-MM-DDThh:mm:ssZ
     * The T separates the date and the time. The Z indicates UTC.
     * Example: 2022-08-11T22:47:57Z equals August 11, 2022, at 22:47:57 (10:47:57 p.m.)
     */
    startDate: string;
    /**
     * Network transaction identifier that was returned in the payment response field
     * _processorInformation.transactionId_ in the reply message for the original subscription-initializing payment.
     */
    originalTransactionId?: string;
    /**
     * Amount of the original subscription-initializing payment.
     * Required when using a Diners or Discover card.
     */
    originalTransactionAuthorizedAmount?: string;
  };

  /**
   * Payment information (REQUIRED)
   */
  paymentInformation: {
    /**
     * Customer payment information (REQUIRED)
     */
    customer: {
      /**
       * Unique identifier for the Customer token used in the transaction (REQUIRED)
       */
      id: string;
    };
  };

  /**
   * Order information
   */
  orderInformation?: {
    /**
     * Amount details
     */
    amountDetails?: {
      /**
       * Currency used for the order. Use the three-character ISO Standard Currency Codes
       */
      currency?: string;
      /**
       * Billing amount for the billing period
       */
      billingAmount?: string;
      /**
       * Subscription setup fee
       */
      setupFee?: string;
    };
  };
}

export interface SubscriptionUpdateDto {
  /**
   * Client reference information
   */
  clientReferenceInformation?: {
    /**
     * Merchant-generated order reference or tracking number (Deprecated: This field is ignored)
     */
    code?: string;
    /**
     * Brief description of the order or any comment you wish to add to the order (Deprecated: This field is ignored)
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
     * The name of the Connection Method client (Deprecated: This field is ignored)
     */
    applicationName?: string;
    /**
     * Version of the CyberSource application or integration used (Deprecated: This field is ignored)
     */
    applicationVersion?: string;
    /**
     * The entity that is responsible for running the transaction (Deprecated: This field is ignored)
     */
    applicationUser?: string;
  };

  /**
   * Processing information
   */
  processingInformation?: {
    /**
     * Commerce Indicator is a way to identify the type of transaction.
     * Valid values: MOTO, RECURRING, INTERNET
     */
    commerceIndicator?: "MOTO" | "RECURRING" | "INTERNET";
    authorizationOptions?: {
      initiator?: {
        /**
         * This field indicates whether the transaction is a merchant-initiated transaction or customer-initiated transaction.
         * Valid values: customer, merchant
         */
        type?: "customer" | "merchant";
      };
    };
  };

  /**
   * Plan information
   */
  planInformation?: {
    /**
     * Number of times customer is going to be billed
     */
    billingCycles?: {
      /**
       * Describe total number of billing cycles
       */
      total?: string;
    };
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
     * Plan Id. Use Plan Id from Create Plan Service.
     */
    planId?: string;
    /**
     * Subscription Name
     */
    name?: string;
    /**
     * Start date of the Subscription
     * Start date must be in UTC. Format: YYYY-MM-DDThh:mm:ssZ
     */
    startDate?: string;
  };

  /**
   * Order information
   */
  orderInformation?: {
    /**
     * Amount details
     */
    amountDetails?: {
      /**
       * Billing amount for the billing period
       */
      billingAmount?: string;
      /**
       * Subscription setup fee
       */
      setupFee?: string;
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
      method?: string;
    };
    update?: {
      href?: string;
      method?: string;
    };
    cancel?: {
      href?: string;
      method?: string;
    };
    suspend?: {
      href?: string;
      method?: string;
    };
    activate?: {
      href?: string;
      method?: string;
    };
  };

  /**
   * Subscription ID
   */
  id?: string;

  /**
   * Submission time in UTC
   */
  submitTimeUtc?: string;

  /**
   * Transaction status
   * Possible values: COMPLETED, PENDING_REVIEW, DECLINED, INVALID_REQUEST
   */
  status?: string;

  /**
   * Plan information
   */
  planInformation?: {
    /**
     * Plan code
     */
    code?: string;
    /**
     * Plan name
     */
    name?: string;
    /**
     * Billing Frequency
     */
    billingPeriod?: {
      /**
       * Length of billing period
       */
      length?: string;
      /**
       * Calendar unit values (D, M, W, Y)
       */
      unit?: string;
    };
    /**
     * Number of billing cycles
     */
    billingCycles?: {
      /**
       * Total number of billing cycles
       */
      total?: string;
      /**
       * Current billing cycle
       */
      current?: string;
    };
  };

  /**
   * Subscription information
   */
  subscriptionInformation?: {
    /**
     * Subscription code
     */
    code?: string;
    /**
     * Plan Id
     */
    planId?: string;
    /**
     * Subscription Name
     */
    name?: string;
    /**
     * Start date of the Subscription
     */
    startDate?: string;
    /**
     * Subscription Status
     * Possible values: PENDING, ACTIVE, FAILED, COMPLETED, DELINQUENT, SUSPENDED, CANCELLED
     */
    status?:
      | "PENDING"
      | "ACTIVE"
      | "FAILED"
      | "COMPLETED"
      | "DELINQUENT"
      | "SUSPENDED"
      | "CANCELLED";
  };

  /**
   * Payment information
   */
  paymentInformation?: {
    customer?: {
      /**
       * Unique identifier for the Customer token
       */
      id?: string;
    };
  };

  /**
   * Order information
   */
  orderInformation?: {
    /**
     * Amount details
     */
    amountDetails?: {
      /**
       * Currency code
       */
      currency?: string;
      /**
       * Billing amount for the billing period
       */
      billingAmount?: string;
      /**
       * Subscription setup fee
       */
      setupFee?: string;
    };
    /**
     * Bill to information
     */
    billTo?: {
      /**
       * Customer's first name
       */
      firstName?: string;
      /**
       * Customer's last name
       */
      lastName?: string;
    };
  };

  /**
   * Reactivation information (present for suspended subscriptions)
   */
  reactivationInformation?: {
    /**
     * Number of payments that should have occurred while the subscription was in a suspended status
     */
    skippedPaymentsCount?: string;
    /**
     * Total amount that will be charged upon reactivation if processSkippedPayments is set to true
     */
    skippedPaymentsTotalAmount?: string;
  };
}

export interface SubscriptionListResponseDto {
  /**
   * Links for pagination
   */
  _links?: {
    self?: { href?: string; method?: string };
    next?: { href?: string; method?: string };
    previous?: { href?: string; method?: string };
  };

  /**
   * Submission time in UTC
   */
  submitTimeUtc?: string;

  /**
   * Total number of subscriptions created
   */
  totalCount?: number;

  /**
   * Array of subscriptions
   */
  subscriptions?: Array<{
    /**
     * Resource links
     */
    _links?: {
      self?: {
        href?: string;
        method?: string;
      };
      cancel?: {
        href?: string;
        method?: string;
      };
      suspend?: {
        href?: string;
        method?: string;
      };
      activate?: {
        href?: string;
        method?: string;
      };
    };

    /**
     * Subscription ID
     */
    id?: string;

    /**
     * Plan information
     */
    planInformation?: {
      /**
       * Plan code
       */
      code?: string;
      /**
       * Plan name
       */
      name?: string;
      /**
       * Billing Frequency
       */
      billingPeriod?: {
        /**
         * Length of billing period
         */
        length?: string;
        /**
         * Calendar unit values (D, M, W, Y)
         */
        unit?: string;
      };
      /**
       * Number of billing cycles
       */
      billingCycles?: {
        /**
         * Total number of billing cycles
         */
        total?: string;
        /**
         * Current billing cycle
         */
        current?: string;
      };
    };

    /**
     * Subscription information
     */
    subscriptionInformation?: {
      /**
       * Subscription code
       */
      code?: string;
      /**
       * Plan Id
       */
      planId?: string;
      /**
       * Subscription Name
       */
      name?: string;
      /**
       * Start date of the Subscription
       */
      startDate?: string;
      /**
       * Subscription Status
       */
      status?:
        | "PENDING"
        | "ACTIVE"
        | "FAILED"
        | "COMPLETED"
        | "DELINQUENT"
        | "SUSPENDED"
        | "CANCELLED";
    };

    /**
     * Payment information
     */
    paymentInformation?: {
      customer?: {
        /**
         * Unique identifier for the Customer token
         */
        id?: string;
      };
    };

    /**
     * Order information
     */
    orderInformation?: {
      /**
       * Amount details
       */
      amountDetails?: {
        /**
         * Currency code
         */
        currency?: string;
        /**
         * Billing amount for the billing period
         */
        billingAmount?: string;
        /**
         * Subscription setup fee
         */
        setupFee?: string;
      };
      /**
       * Bill to information
       */
      billTo?: {
        /**
         * Customer's first name
         */
        firstName?: string;
        /**
         * Customer's last name
         */
        lastName?: string;
      };
    };
  }>;
}

export interface SubscriptionPaginationOptionsDto {
  /**
   * Page offset number
   */
  offset?: number;

  /**
   * Number of items to be returned. Default - 20, Max - 100
   */
  limit?: number;

  /**
   * Filter by Subscription Code
   */
  code?: string;

  /**
   * Filter by Subscription Status
   */
  status?: string;
}

export interface SubscriptionActivateDto {
  /**
   * Indicates if skipped payments should be processed from the period when the subscription was suspended.
   * By default, this is set to true.
   */
  processSkippedPayments?: boolean;
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
