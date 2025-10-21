export interface CyberSourceConfig {
  /**
   * CyberSource Merchant ID
   */
  merchantId: string;

  /**
   * CyberSource API Key
   */
  apiKey: string;

  /**
   * CyberSource Shared Secret Key
   */
  sharedSecretKey: string;

  /**
   * Base URL for CyberSource API
   * @default 'https://apitest.cybersource.com' (sandbox)
   * @example 'https://api.cybersource.com' (production)
   */
  basePath?: string;

  /**
   * API timeout in milliseconds
   * @default 30000
   */
  timeout?: number;

  /**
   * Whether to use sandbox environment
   * @default true
   */
  sandbox?: boolean;
}

export interface CyberSourceModuleOptions {
  config?: CyberSourceConfig;
  useFactory?: (
    ...args: any[]
  ) => CyberSourceConfig | Promise<CyberSourceConfig>;
  inject?: any[];
  /**
   * Whether to register the module globally
   * @default false
   */
  isGlobal?: boolean;
}
