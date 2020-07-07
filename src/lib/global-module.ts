import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { ConfigOptions } from '../options';
import { ConfigFacade } from './facade';
import { ConfigExtractor } from './extractor';
import { ConfigParser } from './parser';
import { ConfigFactory } from './factory';
import { ConfigValidator } from './validator';
import { CONFIG_OPTIONS } from '../tokens';

@Global()
@Module({
  providers: [
    {
      provide: ConfigExtractor,
      useFactory: () => new ConfigExtractor(dotenv.config),
    },
    {
      provide: ConfigParser,
      useClass: ConfigParser,
    },
    {
      provide: ConfigFactory,
      useClass: ConfigFactory,
    },
    {
      provide: ConfigValidator,
      useClass: ConfigValidator,
    },
  ],
})
export class ConfigGlobalModule {
  static forRoot(options: ConfigOptions): DynamicModule {
    const providers: Provider[] = [
      {
        provide: CONFIG_OPTIONS,
        useValue: options,
      },
      {
        provide: ConfigFacade,
        inject: [ConfigExtractor, ConfigParser, ConfigFactory, ConfigValidator],
        useFactory: (
          configExtractor: ConfigExtractor,
          configParser: ConfigParser,
          configFactory: ConfigFactory,
          configValidator: ConfigValidator,
        ) =>
          new ConfigFacade(
            configExtractor,
            configParser,
            configFactory,
            configValidator,
            options.fromFile,
          ),
      },
    ];

    return {
      module: ConfigGlobalModule,
      providers,
      exports: providers,
    };
  }
}
