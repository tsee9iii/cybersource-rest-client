/**
 * Data Transfer Objects for RBS (Recurring Billing Subscriptions) Plans
 */

export interface PlanCreateDto {
  /**
   * Client reference information
   */
  clientReferenceInformation?: {
    /**
     * Brief description of the plan or any comment you wish to add to the plan.
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
   * Plan information
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
     */
    status?: "DRAFT" | "ACTIVE" | "INACTIVE";
    /**
     * Billing cycle information
     */
    billingCycles?: {
      /**
       * Billing cycle type. Valid values: WEEKLY, MONTHLY, QUARTERLY, SEMI_ANNUALLY, ANNUALLY
       */
      frequency?:
        | "WEEKLY"
        | "MONTHLY"
        | "QUARTERLY"
        | "SEMI_ANNUALLY"
        | "ANNUALLY";
      /**
       * Number of cycles
       */
      totalCycles?: number;
    };
  };

  /**
   * Billing information
   */
  billingInformation?: {
    /**
     * Amount to be charged
     */
    amount?: string;
    /**
     * Currency code
     */
    currency?: string;
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

export interface PlanUpdateDto {
  /**
   * Plan information for updates
   */
  planInformation?: {
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
     */
    status?: "DRAFT" | "ACTIVE" | "INACTIVE";
    /**
     * Billing cycle information
     */
    billingCycles?: {
      /**
       * Billing cycle type
       */
      frequency?:
        | "WEEKLY"
        | "MONTHLY"
        | "QUARTERLY"
        | "SEMI_ANNUALLY"
        | "ANNUALLY";
      /**
       * Number of cycles
       */
      totalCycles?: number;
    };
  };

  /**
   * Billing information
   */
  billingInformation?: {
    /**
     * Amount to be charged
     */
    amount?: string;
    /**
     * Currency code
     */
    currency?: string;
  };
}

export interface PlanResponseDto {
  /**
   * Resource links
   */
  _links?: {
    self?: {
      href?: string;
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
     * Plan name
     */
    name?: string;
    /**
     * Plan description
     */
    description?: string;
    /**
     * Plan status
     */
    status?: string;
    /**
     * Billing cycle information
     */
    billingCycles?: {
      frequency?: string;
      totalCycles?: number;
    };
  };

  /**
   * Billing information
   */
  billingInformation?: {
    amount?: string;
    currency?: string;
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
   * Plan status
   */
  status?: string;
}

export interface PlanListResponseDto {
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
   * The number of plans returned in the array
   */
  count?: number;

  /**
   * The total number of plans
   */
  total?: number;

  /**
   * Embedded plan resources
   */
  _embedded?: {
    plans?: PlanResponseDto[];
  };
}

export interface PlanPaginationOptionsDto {
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
