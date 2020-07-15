import {
  DynamicModule,
  Global,
  LoggerService,
  Module,
  Provider,
} from '@nestjs/common';
import { Type } from '@nestjs/common/interfaces/type.interface';
import { ForwardReference } from '@nestjs/common/interfaces/modules/forward-reference.interface';
import * as dotenv from 'dotenv';
import { ConfigOptions } from '../options';
import { ConfigFacade } from './facade';
import { ConfigStorage } from './storage';
import { ConfigExtractor } from './extractor';
import { ConfigParser } from './parser';
import { ConfigFactory } from './factory';
import { ConfigValidator } from './validator';
import { CONFIG_LOGGER, CONFIG_OPTIONS, RAW_CONFIG } from '../tokens';
import { ConfigLogger } from './logger';
import { ProcessEnv } from './types';

@Global()
@Module({
  providers: [
    {
      provide: ConfigStorage,
      useClass: ConfigStorage,
    },
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
    const imports: Array<
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference
    > = options.imports || [];
    const providers: Provider[] = options.providers || [];

    imports.forEach((module) => {
      if (!module) throw new Error(`Wrong import parameter \`${module}\``);
    });
    providers.forEach((provider) => {
      if (!provider)
        throw new Error(`Wrong provider parameter \`${provider}\``);
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (!providers.find((provider) => provider.provide === CONFIG_LOGGER)) {
      providers.push({
        provide: CONFIG_LOGGER,
        useClass: ConfigLogger,
      });
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (!providers.find((provider) => provider.provide === RAW_CONFIG)) {
      providers.push({
        provide: RAW_CONFIG,
        useValue: {},
      });
    }

    providers.push(
      {
        provide: CONFIG_OPTIONS,
        useValue: options,
      },
      {
        provide: ConfigFacade,
        inject: [
          ConfigStorage,
          ConfigExtractor,
          ConfigParser,
          ConfigFactory,
          ConfigValidator,
          CONFIG_LOGGER,
          RAW_CONFIG,
        ],
        useFactory: (
          configStorage: ConfigStorage,
          configExtractor: ConfigExtractor,
          configParser: ConfigParser,
          configFactory: ConfigFactory,
          configValidator: ConfigValidator,
          logger: LoggerService,
          raw: ProcessEnv,
        ) =>
          new ConfigFacade(
            configStorage,
            configExtractor,
            configParser,
            configFactory,
            configValidator,
            logger,
            { fromFile: options.fromFile, raw },
          ),
      },
    );

    return {
      module: ConfigGlobalModule,
      imports,
      providers,
      exports: providers,
    };
  }
}
