import { DynamicModule, Module, Provider } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { ConfigOptions } from './options';
import { ConfigFacade } from './lib/facade';
import { ClassType } from './lib/types';
import { ConfigExtractor } from './lib/extractor';
import { ConfigParser } from './lib/parser';
import { ConfigFactory } from './lib/factory';
import { ConfigValidator } from './lib/validator';

const configFacade = new ConfigFacade(
  new ConfigExtractor(dotenv.config),
  new ConfigParser(),
  new ConfigFactory(),
  new ConfigValidator(),
);

@Module({})
export class ConfigModule {
  static forRoot(options: ConfigOptions): DynamicModule {
    configFacade.initialize(options.fromFile);

    let providers: Provider[] = [];
    if (options.configs) {
      providers = options.configs.map(
        (ConfigClass: ClassType): Provider => ({
          provide: ConfigClass,
          useFactory: (): typeof ConfigClass.prototype => {
            return configFacade.createConfig(ConfigClass);
          },
        }),
      );
    }

    return {
      module: ConfigModule,
      providers,
      exports: providers,
    };
  }

  static forFeature(ConfigClasses: ClassType[]): DynamicModule {
    const providers: Provider[] = ConfigClasses.map(
      (ConfigClass: ClassType): Provider => ({
        provide: ConfigClass,
        useFactory: (): typeof ConfigClass.prototype => {
          return configFacade.createConfig(ConfigClass);
        },
      }),
    );

    return {
      module: ConfigModule,
      providers,
      exports: providers,
    };
  }
}
