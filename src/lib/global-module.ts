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
import { ConfigExtractor } from './extractor';
import { ConfigParser } from './parser';
import { ConfigFactory } from './factory';
import { ConfigValidator } from './validator';
import { CONFIG_LOGGER, CONFIG_OPTIONS } from '../tokens';
import { ConfigLogger } from './logger';

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

    providers.push(
      {
        provide: CONFIG_OPTIONS,
        useValue: options,
      },
      {
        provide: ConfigFacade,
        inject: [
          ConfigExtractor,
          ConfigParser,
          ConfigFactory,
          ConfigValidator,
          CONFIG_LOGGER,
        ],
        useFactory: (
          configExtractor: ConfigExtractor,
          configParser: ConfigParser,
          configFactory: ConfigFactory,
          configValidator: ConfigValidator,
          logger: LoggerService,
        ) =>
          new ConfigFacade(
            configExtractor,
            configParser,
            configFactory,
            configValidator,
            logger,
            options.fromFile,
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
