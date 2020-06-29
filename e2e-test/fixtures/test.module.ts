import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '../../src';

@Module({})
export class TestModule {
  static forFeature(ConfigClass): DynamicModule {
    return {
      module: TestModule,
      imports: [ConfigModule.forFeature(ConfigClass)],
    };
  }
}
