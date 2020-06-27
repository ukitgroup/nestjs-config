import { DynamicModule, Module } from '@nestjs/common';
import * as core from './core';

@Module({})
export class ConfigModule {
  static forRoot(options): DynamicModule {
    core.init(options);
    return { module: ConfigModule };
  }

  static forFeature(ConfigClass): DynamicModule {
    const provider = {
      provide: ConfigClass,
      useFactory: () => core.make(ConfigClass),
    };
    return {
      module: ConfigModule,
      providers: [provider],
      exports: [provider],
    };
  }
}
