/**
 * Quick module instantiation test
 */
import { CyberSourceModule } from "./cybersource.module";

async function testModuleInstantiation() {
  try {
    console.log("🧪 Testing CyberSource Module instantiation...");

    // Test basic module configuration
    const mockConfig = {
      merchantId: "test-merchant-id",
      apiKey: "test-api-key",
      sharedSecretKey: "test-shared-secret",
      sandbox: true,
    };

    // Test forRoot method
    const moduleConfig = CyberSourceModule.forRoot(mockConfig);
    console.log("✅ forRoot method works");
    console.log(`✅ Module exports ${moduleConfig.exports?.length} services`);
    console.log(
      `✅ Module provides ${moduleConfig.providers?.length} providers`
    );

    // Test forRootAsync method
    const asyncModuleConfig = CyberSourceModule.forRootAsync({
      useFactory: () => mockConfig,
      inject: [],
    });
    console.log("✅ forRootAsync method works");

    // Test helper methods
    const globalModuleConfig = CyberSourceModule.forRootGlobal(mockConfig);
    console.log("✅ forRootGlobal method works");

    const asyncGlobalModuleConfig = CyberSourceModule.forRootAsyncGlobal({
      useFactory: () => mockConfig,
      inject: [],
    });
    console.log("✅ forRootAsyncGlobal method works");

    console.log("\n🎉 All module configuration methods are working!");
    return true;
  } catch (error: any) {
    console.error("❌ Module instantiation failed:", error.message);
    return false;
  }
}

testModuleInstantiation();
