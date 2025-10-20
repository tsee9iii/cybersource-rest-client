import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CyberSourceModule } from "@tsee9ii/cybersource-nestjs";

/**
 * Example NestJS module showing how to configure CyberSource
 * with environment variables for secure credential management
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CyberSourceModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        merchantId: configService.get("CYBERSOURCE_MERCHANT_ID"),
        apiKey: configService.get("CYBERSOURCE_API_KEY"),
        sharedSecretKey: configService.get("CYBERSOURCE_SHARED_SECRET"),
        sandbox: configService.get("NODE_ENV") !== "production",
      }),
    }),
  ],
})
export class ExampleModule {}
