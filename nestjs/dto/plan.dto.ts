/**
 * Data Transfer Objects for RBS (Recurring Billing Subscriptions) Plans
 * Based on CyberSource API v1 specification
 */

export interface PlanCreateDto {
  /**
   * Client reference information
   */
  clientReferenceInformation?: {
    /**
     * Brief description of the order or any comment you wish to add to the order.
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
   * Plan information (REQUIRED)
   */
  planInformation: {
    /**
     * Plan code is an optional field, If not provided system generates and assign one
     */
    code?: string;
    /**
     * Plan name (REQUIRED)
     */
    name: string;
    /**
     * Plan description
     */
    description?: string;
    /**
     * Plan status. Valid values: DRAFT, ACTIVE (default)
     */
    status?: "DRAFT" | "ACTIVE";
    /**
     * Billing Frequency (REQUIRED)
     */
    billingPeriod: {
      /**
       * Example:
       * - If length=1 & unit=month then charge every month
       * - If length=7 & unit=day then charge every 7th day
       */
      length: string;
      /**
       * Calendar unit values.
       * - D - day
       * - M - month
       * - W - week
       * - Y - year
       */
      unit: "D" | "M" | "W" | "Y";
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
   * Order information (REQUIRED)
   */
  orderInformation: {
    /**
     * Amount details (REQUIRED)
     */
    amountDetails: {
      /**
       * Currency used for the order. Use the three-character ISO Standard Currency Codes (REQUIRED)
       */
      currency: string;
      /**
       * Billing amount for the billing period (REQUIRED)
       */
      billingAmount: string;
      /**
       * Subscription setup fee
       */
      setupFee?: string;
    };
  };
}

export interface PlanUpdateDto {
  /**
   * Plan information for updates
   */
  planInformation?: {
    /**
     * Plan code is an optional field, If not provided system generates and assign one
     */
    code?: string;
    /**
     * Plan name
     */
    name?: string;
    /**
     * Plan description
     */
    description?: string;
    /**
     * Plan status. Valid values: DRAFT, ACTIVE, INACTIVE
     * Note: Updating to DRAFT is not allowed from ACTIVE and INACTIVE status
     */
    status?: "DRAFT" | "ACTIVE" | "INACTIVE";
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
   * Processing information
   */
  processingInformation?: {
    subscriptionBillingOptions?: {
      /**
       * Valid Values:
       * - ALL - Change applied to all Subscriptions (Existing + New)
       * - NEW - Change applied to New Subscriptions only
       */
      applyTo?: "ALL" | "NEW";
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

export interface PlanResponseDto {
  /**
   * Resource links
   */
  _links?: {
    self?: {
      href?: string;
      method?: string;
    };
  };

  /**
   * Plan ID
   */
  id?: string;

  /**
   * Submission time in UTC
   */
  submitTimeUtc?: string;

  /**
   * Transaction status
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
     * Plan status
     */
    status?: string;
    /**
     * Plan name
     */
    name?: string;
    /**
     * Plan description
     */
    description?: string;
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
  };
}

export interface PlanListResponseDto {
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
   * Total number of plans created
   */
  totalCount?: number;

  /**
   * Array of plans
   */
  plans?: Array<{
    /**
     * Resource links
     */
    _links?: {
      self?: {
        href?: string;
        method?: string;
      };
    };

    /**
     * Plan ID
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
       * Plan status
       */
      status?: string;
      /**
       * Plan name
       */
      name?: string;
      /**
       * Plan description
       */
      description?: string;
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
    };
  }>;
}

export interface PlanPaginationOptionsDto {
  /**
   * Page offset number
   */
  offset?: number;

  /**
   * Number of items to be returned. Default - 20, Max - 100
   */
  limit?: number;

  /**
   * Filter by Plan Code
   */
  code?: string;

  /**
   * Filter by Plan Status
   */
  status?: string;

  /**
   * Filter by Plan Name. (First sub string or full string) **[Not Recommended]**
   */
  name?: string;
}
