import { Module, DynamicModule, Global } from "@nestjs/common";
import { CyberSourceService } from "./cybersource.service";
import {
  CyberSourceConfig,
  CyberSourceModuleOptions,
} from "./cybersource.config";

@Module({})
export class CyberSourceModule {
  static forRoot(config: CyberSourceConfig, isGlobal = false): DynamicModule {
    return {
      module: CyberSourceModule,
      global: isGlobal,
      providers: [
        {
          provide: "CYBERSOURCE_CONFIG",
          useValue: config,
        },
        CyberSourceService,
      ],
      exports: [CyberSourceService],
    };
  }

  static forRootAsync(options: {
    useFactory: (
      ...args: any[]
    ) => CyberSourceConfig | Promise<CyberSourceConfig>;
    inject?: any[];
    isGlobal?: boolean;
  }): DynamicModule {
    return {
      module: CyberSourceModule,
      global: options.isGlobal || false,
      providers: [
        {
          provide: "CYBERSOURCE_CONFIG",
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        CyberSourceService,
      ],
      exports: [CyberSourceService],
    };
  }

  // Helper method to register as global module
  static forRootGlobal(config: CyberSourceConfig): DynamicModule {
    return this.forRoot(config, true);
  }

  static forRootAsyncGlobal(options: {
    useFactory: (
      ...args: any[]
    ) => CyberSourceConfig | Promise<CyberSourceConfig>;
    inject?: any[];
  }): DynamicModule {
    return this.forRootAsync({ ...options, isGlobal: true });
  }
}
