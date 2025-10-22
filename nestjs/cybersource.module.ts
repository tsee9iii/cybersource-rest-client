import { Module, DynamicModule } from "@nestjs/common";
import { CyberSourceService } from "./cybersource.service";
import { CyberSourceConfig } from "./cybersource.config";
import { PaymentService } from "./services/payment.service";
import { TokenService } from "./services/token.service";
import { VerificationService } from "./services/verification.service";
import { CustomerService } from "./services/customer.service";
import { PaymentInstrumentService } from "./services/payment-instrument.service";
import { InstrumentIdentifierService } from "./services/instrument-identifier.service";
import { TokenizedCardService } from "./services/tokenized-card.service";

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
        PaymentService,
        TokenService,
        VerificationService,
        CustomerService,
        PaymentInstrumentService,
        InstrumentIdentifierService,
        TokenizedCardService,
      ],
      exports: [
        CyberSourceService,
        PaymentService,
        TokenService,
        VerificationService,
        CustomerService,
        PaymentInstrumentService,
        InstrumentIdentifierService,
        TokenizedCardService,
      ],
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
        PaymentService,
        TokenService,
        VerificationService,
        CustomerService,
        PaymentInstrumentService,
        InstrumentIdentifierService,
        TokenizedCardService,
      ],
      exports: [
        CyberSourceService,
        PaymentService,
        TokenService,
        VerificationService,
        CustomerService,
        PaymentInstrumentService,
        InstrumentIdentifierService,
        TokenizedCardService,
      ],
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
