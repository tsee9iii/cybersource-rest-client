import { Injectable } from "@nestjs/common";
import { CyberSourceService } from "../cybersource.service";
import { BaseCyberSourceService } from "./base.service";
import {
  PlanCreateDto,
  PlanUpdateDto,
  PlanResponseDto,
  PlanListResponseDto,
  PlanPaginationOptionsDto,
} from "../dto/plan.dto";

@Injectable()
export class PlanService extends BaseCyberSourceService {
  constructor(cyberSourceService: CyberSourceService) {
    super(cyberSourceService, PlanService.name);
  }

  /**
   * Create a new plan
   * @param createPlanDto Plan data
   * @returns Promise<PlanResponseDto>
   */
  async createPlan(createPlanDto: PlanCreateDto): Promise<PlanResponseDto> {
    return this.executeApiCall(
      "Creating plan",
      () => this.cyberSourceService.rbs.createPlan(createPlanDto),
      this.sanitizeRequestForLogging({ createPlanDto })
    );
  }

  /**
   * Get all plans
   * @param pagination Pagination options
   * @returns Promise<PlanListResponseDto>
   */
  async getPlans(
    pagination?: PlanPaginationOptionsDto
  ): Promise<PlanListResponseDto> {
    return this.executeApiCall(
      "Retrieving plans",
      () => this.cyberSourceService.rbs.getPlans(pagination),
      { pagination }
    );
  }

  /**
   * Retrieve a plan by ID
   * @param planId Plan ID
   * @returns Promise<PlanResponseDto>
   */
  async getPlan(planId: string): Promise<PlanResponseDto> {
    return this.executeApiCall(
      "Retrieving plan",
      () => this.cyberSourceService.rbs.getPlan(planId),
      { planId }
    );
  }

  /**
   * Update a plan
   * @param planId Plan ID
   * @param updatePlanDto Updated plan data
   * @returns Promise<PlanResponseDto>
   */
  async updatePlan(
    planId: string,
    updatePlanDto: PlanUpdateDto
  ): Promise<PlanResponseDto> {
    return this.executeApiCall(
      "Updating plan",
      () => this.cyberSourceService.rbs.updatePlan(planId, updatePlanDto),
      { planId, ...this.sanitizeRequestForLogging({ updatePlanDto }) }
    );
  }

  /**
   * Delete a plan
   * @param planId Plan ID
   * @returns Promise<void>
   */
  async deletePlan(planId: string): Promise<void> {
    return this.executeVoidApiCall(
      "Deleting plan",
      () => this.cyberSourceService.rbs.deletePlan(planId),
      { planId }
    );
  }

  /**
   * Activate a plan
   * @param planId Plan ID
   * @returns Promise<PlanResponseDto>
   */
  async activatePlan(planId: string): Promise<PlanResponseDto> {
    return this.executeApiCall(
      "Activating plan",
      () => this.cyberSourceService.rbs.activatePlan(planId),
      { planId }
    );
  }

  /**
   * Deactivate a plan
   * @param planId Plan ID
   * @returns Promise<PlanResponseDto>
   */
  async deactivatePlan(planId: string): Promise<PlanResponseDto> {
    return this.executeApiCall(
      "Deactivating plan",
      () => this.cyberSourceService.rbs.deactivatePlan(planId),
      { planId }
    );
  }

  /**
   * Get plan code (generates a unique plan code)
   * @returns Promise<{ code: string }>
   */
  async getPlanCode(): Promise<{ code: string }> {
    return this.executeApiCall(
      "Generating plan code",
      () => this.cyberSourceService.rbs.getPlanCode(),
      {}
    );
  }
}
