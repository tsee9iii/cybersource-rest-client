import { Inject } from "@nestjs/common";

/**
 * Decorator to inject the CyberSource service
 */
export const InjectCyberSource = () => Inject(CyberSourceService);

// Import the service type
import { CyberSourceService } from "../cybersource.service";
