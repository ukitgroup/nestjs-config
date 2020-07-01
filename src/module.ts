import { DynamicModule, Module, Provider } from '@nestjs/common';
import { ConfigClass, ConfigOptions } from './options';
import * as core from './core';

@Module({})
export class ConfigModule {
  static forRoot(options: ConfigOptions): DynamicModule {
    core.init(options);

    let providers: Provider[] = [];
    if (options.configs) {
      providers = options.configs.map(
        (configClass: ConfigClass): Provider => ({
          provide: configClass,
          useFactory: () => core.make(configClass),
        }),
      );
    }
    return {
      module: ConfigModule,
      providers,
      exports: providers,
    };
  }

  static forFeature(configClasses: ConfigClass[]): DynamicModule {
    const providers: Provider[] = configClasses.map(
      (configClass: ConfigClass): Provider => ({
        provide: configClass,
        useFactory: () => core.make(configClass),
      }),
    );
    return {
      module: ConfigModule,
      providers,
      exports: providers,
    };
  }
}
