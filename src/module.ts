import { DynamicModule, Module, Provider } from '@nestjs/common';
import { ConfigOptions } from './options';
import { ConfigFacade } from './lib/facade';
import { ClassType } from './lib/types';

const configFacade = new ConfigFacade();

@Module({})
export class ConfigModule {
  static forRoot(options: ConfigOptions): DynamicModule {
    configFacade.initialize(options);

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
