# RBS (Recurring Billing Subscriptions) Services

This document describes the RBS (Recurring Billing Subscriptions) services available in the CyberSource NestJS package.

## Overview

The RBS services enable you to manage payment plans and subscriptions for recurring payment schedules. The service securely stores customer payment information and personal data within secure Visa data centers, reducing storage risks and PCI DSS scope through the use of Token Management (TMS).

### Key Elements

- **Token**: Stores customer billing, shipping, and payment details
- **Plan**: Stores the billing schedule and pricing information
- **Subscription**: Combines the token and plan, and defines the subscription start date, name, and description

## Available Services

### PlanService

Manages subscription plans that define billing schedules and pricing.

#### Methods

- `createPlan(createPlanDto)` - Create a new plan
- `getPlans(pagination?)` - Get all plans with optional pagination
- `getPlan(planId)` - Retrieve a specific plan by ID
- `updatePlan(planId, updatePlanDto)` - Update an existing plan
- `deletePlan(planId)` - Delete a plan
- `activatePlan(planId)` - Activate a plan
- `deactivatePlan(planId)` - Deactivate a plan
- `getPlanCode()` - Generate a unique plan code

### SubscriptionService

Manages customer subscriptions that combine plans with customer payment information.

#### Methods

- `createSubscription(createSubscriptionDto)` - Create a new subscription
- `getAllSubscriptions(pagination?)` - Get all subscriptions with optional pagination
- `getSubscription(subscriptionId)` - Retrieve a specific subscription by ID
- `updateSubscription(subscriptionId, updateSubscriptionDto)` - Update an existing subscription
- `cancelSubscription(subscriptionId)` - Cancel a subscription
- `suspendSubscription(subscriptionId)` - Suspend a subscription
- `activateSubscription(subscriptionId)` - Activate a subscription
- `getSubscriptionCode()` - Generate a unique subscription code
- `getFollowOnSubscription(requestId)` - Get follow-on subscription details
- `createFollowOnSubscription(requestId, followOnSubscriptionDto)` - Create a follow-on subscription

## Usage Examples

### Basic Setup

```typescript
import {
  CyberSourceModule,
  PlanService,
  SubscriptionService,
} from "@infinitesolutions/cybersource-nestjs";

@Module({
  imports: [
    CyberSourceModule.forRoot({
      merchantId: "your_merchant_id",
      apiKey: "your_api_key",
      sharedSecretKey: "your_shared_secret",
      environment: "sandbox",
    }),
  ],
  controllers: [YourController],
  providers: [],
})
export class YourModule {}
```

### Creating a Plan

```typescript
@Injectable()
export class BillingService {
  constructor(private readonly planService: PlanService) {}

  async createMonthlyPlan() {
    const planData = {
      planInformation: {
        name: "Monthly Subscription",
        description: "Monthly billing plan",
        status: "ACTIVE" as const,
        billingCycles: {
          frequency: "MONTHLY" as const,
          totalCycles: 12,
        },
      },
      billingInformation: {
        amount: "29.99",
        currency: "USD",
      },
    };

    return await this.planService.createPlan(planData);
  }
}
```

### Creating a Subscription

```typescript
@Injectable()
export class SubscriptionManager {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  async createSubscription(customerId: string, planId: string) {
    const subscriptionData = {
      subscriptionInformation: {
        name: "Customer Monthly Subscription",
        description: "Monthly subscription for customer",
        startDate: new Date().toISOString().split("T")[0],
        planId: planId,
      },
      paymentInformation: {
        customer: {
          id: customerId,
        },
      },
    };

    return await this.subscriptionService.createSubscription(subscriptionData);
  }

  async cancelSubscription(subscriptionId: string) {
    return await this.subscriptionService.cancelSubscription(subscriptionId);
  }
}
```

### Managing Subscription Lifecycle

```typescript
@Injectable()
export class SubscriptionLifecycleService {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  async suspendSubscription(subscriptionId: string) {
    // Temporarily suspend billing
    return await this.subscriptionService.suspendSubscription(subscriptionId);
  }

  async reactivateSubscription(subscriptionId: string) {
    // Resume billing
    return await this.subscriptionService.activateSubscription(subscriptionId);
  }

  async permanentlyCancel(subscriptionId: string) {
    // Permanently cancel the subscription
    return await this.subscriptionService.cancelSubscription(subscriptionId);
  }
}
```

## Data Transfer Objects (DTOs)

### Plan DTOs

- `PlanCreateDto` - Data for creating a new plan
- `PlanUpdateDto` - Data for updating an existing plan
- `PlanResponseDto` - Response data from plan operations
- `PlanListResponseDto` - Response data for plan list operations
- `PlanPaginationOptionsDto` - Pagination options for plan queries

### Subscription DTOs

- `SubscriptionCreateDto` - Data for creating a new subscription
- `SubscriptionUpdateDto` - Data for updating an existing subscription
- `SubscriptionResponseDto` - Response data from subscription operations
- `SubscriptionListResponseDto` - Response data for subscription list operations
- `SubscriptionPaginationOptionsDto` - Pagination options for subscription queries
- `FollowOnSubscriptionDto` - Data for creating follow-on subscriptions

## Billing Frequencies

The following billing frequencies are supported:

- `WEEKLY` - Weekly billing
- `MONTHLY` - Monthly billing
- `QUARTERLY` - Quarterly billing (every 3 months)
- `SEMI_ANNUALLY` - Semi-annual billing (every 6 months)
- `ANNUALLY` - Annual billing

## Plan Statuses

- `DRAFT` - Plan is in draft state, not yet active
- `ACTIVE` - Plan is active and can accept new subscriptions
- `INACTIVE` - Plan is inactive and cannot accept new subscriptions

## Error Handling

All RBS services use the standardized error handling from the base service:

```typescript
try {
  const plan = await this.planService.createPlan(planData);
  console.log("Plan created:", plan.id);
} catch (error) {
  // Error is automatically logged by the service
  console.error("Plan creation failed:", error.message);
}
```

## Testing

Test the RBS services using the provided test script:

```bash
# Test RBS services
npm run test:rbs

# Test with real credentials
CYBERSOURCE_MERCHANT_ID=your_merchant_id \
CYBERSOURCE_API_KEY=your_api_key \
CYBERSOURCE_SHARED_SECRET=your_shared_secret \
npm run test:rbs
```

## Requirements

To use RBS services, your CyberSource account must have:

1. **Recurring Billing enabled** - Contact CyberSource to enable this feature
2. **Token Management (TMS) access** - Required for secure storage of customer payment information
3. **Valid API credentials** - Merchant ID, API Key, and Shared Secret Key

## Best Practices

1. **Use Draft Status**: Create plans in `DRAFT` status and test them before activating
2. **Validate Customer Tokens**: Ensure customer payment instruments are valid before creating subscriptions
3. **Handle Failures Gracefully**: Implement proper error handling for payment failures
4. **Monitor Subscription Status**: Regularly check subscription status and handle suspended/cancelled subscriptions
5. **Use Follow-on Subscriptions**: For complex billing scenarios, consider using follow-on subscriptions

## Security Considerations

- Never log sensitive payment information
- Use HTTPS for all API communications
- Store only tokenized payment data, never raw payment information
- Implement proper access controls for subscription management endpoints
- Regularly audit subscription access and modifications

## Support

For additional support with RBS services:

1. Check the CyberSource documentation
2. Contact CyberSource support for account-specific issues
3. Review the test scripts for implementation examples
4. Use the debug logging features for troubleshooting
