import { Module, DynamicModule } from "@nestjs/common";
import { CyberSourceService } from "./cybersource.service";
import { CyberSourceConfig } from "./cybersource.config";

@Module({})
export class CyberSourceModule {
  static forRoot(config: CyberSourceConfig): DynamicModule {
    return {
      module: CyberSourceModule,
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
  }): DynamicModule {
    return {
      module: CyberSourceModule,
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
}
