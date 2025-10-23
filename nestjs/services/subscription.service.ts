import { Injectable } from "@nestjs/common";
import { CyberSourceService } from "../cybersource.service";
import { BaseCyberSourceService } from "./base.service";
import {
  SubscriptionCreateDto,
  SubscriptionUpdateDto,
  SubscriptionResponseDto,
  SubscriptionListResponseDto,
  SubscriptionPaginationOptionsDto,
  SubscriptionActivateDto,
  FollowOnSubscriptionDto,
} from "../dto/subscription.dto";

@Injectable()
export class SubscriptionService extends BaseCyberSourceService {
  constructor(cyberSourceService: CyberSourceService) {
    super(cyberSourceService, SubscriptionService.name);
  }

  /**
   * Create a new subscription
   * @param createSubscriptionDto Subscription data
   * @returns Promise<SubscriptionResponseDto>
   */
  async createSubscription(
    createSubscriptionDto: SubscriptionCreateDto
  ): Promise<SubscriptionResponseDto> {
    return this.executeApiCall(
      "Creating subscription",
      () =>
        this.cyberSourceService.rbs.createSubscription(createSubscriptionDto),
      this.sanitizeRequestForLogging({ createSubscriptionDto })
    );
  }

  /**
   * Get all subscriptions
   * @param pagination Pagination options
   * @returns Promise<SubscriptionListResponseDto>
   */
  async getAllSubscriptions(
    pagination?: SubscriptionPaginationOptionsDto
  ): Promise<SubscriptionListResponseDto> {
    return this.executeApiCall(
      "Retrieving subscriptions",
      () => this.cyberSourceService.rbs.getAllSubscriptions(pagination),
      { pagination }
    );
  }

  /**
   * Retrieve a subscription by ID
   * @param subscriptionId Subscription ID
   * @returns Promise<SubscriptionResponseDto>
   */
  async getSubscription(
    subscriptionId: string
  ): Promise<SubscriptionResponseDto> {
    return this.executeApiCall(
      "Retrieving subscription",
      () => this.cyberSourceService.rbs.getSubscription(subscriptionId),
      { subscriptionId }
    );
  }

  /**
   * Update a subscription
   * @param subscriptionId Subscription ID
   * @param updateSubscriptionDto Updated subscription data
   * @returns Promise<SubscriptionResponseDto>
   */
  async updateSubscription(
    subscriptionId: string,
    updateSubscriptionDto: SubscriptionUpdateDto
  ): Promise<SubscriptionResponseDto> {
    return this.executeApiCall(
      "Updating subscription",
      () =>
        this.cyberSourceService.rbs.updateSubscription(
          subscriptionId,
          updateSubscriptionDto
        ),
      {
        subscriptionId,
        ...this.sanitizeRequestForLogging({ updateSubscriptionDto }),
      }
    );
  }

  /**
   * Cancel a subscription
   * @param subscriptionId Subscription ID
   * @returns Promise<SubscriptionResponseDto>
   */
  async cancelSubscription(
    subscriptionId: string
  ): Promise<SubscriptionResponseDto> {
    return this.executeApiCall(
      "Canceling subscription",
      () => this.cyberSourceService.rbs.cancelSubscription(subscriptionId),
      { subscriptionId }
    );
  }

  /**
   * Suspend a subscription
   * @param subscriptionId Subscription ID
   * @returns Promise<SubscriptionResponseDto>
   */
  async suspendSubscription(
    subscriptionId: string
  ): Promise<SubscriptionResponseDto> {
    return this.executeApiCall(
      "Suspending subscription",
      () => this.cyberSourceService.rbs.suspendSubscription(subscriptionId),
      { subscriptionId }
    );
  }

  /**
   * Activate a subscription
   * @param subscriptionId Subscription ID
   * @param processSkippedPayments Indicates if skipped payments should be processed from the period when the subscription was suspended. Default: true
   * @returns Promise<SubscriptionResponseDto>
   */
  async activateSubscription(
    subscriptionId: string,
    processSkippedPayments: boolean = true
  ): Promise<SubscriptionResponseDto> {
    return this.executeApiCall(
      "Activating subscription",
      () =>
        this.cyberSourceService.rbs.activateSubscription(
          subscriptionId,
          processSkippedPayments
        ),
      { subscriptionId, processSkippedPayments }
    );
  }

  /**
   * Get subscription code (generates a unique subscription code)
   * @returns Promise<{ code: string }>
   */
  async getSubscriptionCode(): Promise<{ code: string }> {
    return this.executeApiCall(
      "Generating subscription code",
      () => this.cyberSourceService.rbs.getSubscriptionCode(),
      {}
    );
  }

  /**
   * Get follow-on subscription details
   * @param requestId Request ID
   * @returns Promise<SubscriptionResponseDto>
   */
  async getFollowOnSubscription(
    requestId: string
  ): Promise<SubscriptionResponseDto> {
    return this.executeApiCall(
      "Retrieving follow-on subscription",
      () => this.cyberSourceService.rbs.getFollowOnSubscription(requestId),
      { requestId }
    );
  }

  /**
   * Create a follow-on subscription
   * @param requestId Request ID
   * @param followOnSubscriptionDto Follow-on subscription data
   * @returns Promise<SubscriptionResponseDto>
   */
  async createFollowOnSubscription(
    requestId: string,
    followOnSubscriptionDto: FollowOnSubscriptionDto
  ): Promise<SubscriptionResponseDto> {
    return this.executeApiCall(
      "Creating follow-on subscription",
      () =>
        this.cyberSourceService.rbs.createFollowOnSubscription(
          requestId,
          followOnSubscriptionDto
        ),
      {
        requestId,
        ...this.sanitizeRequestForLogging({ followOnSubscriptionDto }),
      }
    );
  }
}
