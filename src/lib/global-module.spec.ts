import { DynamicModule, LoggerService, Module, Provider } from '@nestjs/common';
import { ConfigGlobalModule } from './global-module';
import { ConfigOptions } from '../options';
import { CONFIG_LOGGER, CONFIG_OPTIONS, RAW_CONFIG } from '../tokens';
import { ConfigLogger } from './logger';
import { ConfigStorage } from './storage';
import { ConfigExtractor } from './extractor';
import { ConfigParser } from './parser';
import { ConfigFactory } from './factory';
import { ConfigValidator } from './validator';
import { ConfigFacade } from './facade';
import { Config, Env } from '../decorator';

describe('ConfigGlobalModule', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('empty options', async () => {
    const options: ConfigOptions = {};
    const configGlobalModule: DynamicModule = ConfigGlobalModule.forRoot(
      options,
    );

    const providers: Provider[] = [
      {
        provide: CONFIG_LOGGER,
        useClass: ConfigLogger,
      },
      {
        provide: RAW_CONFIG,
        useValue: {},
      },
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
        useFactory: expect.any(Function),
      },
    ];

    expect(configGlobalModule).toEqual({
      module: ConfigGlobalModule,
      imports: [],
      providers,
      exports: providers,
    });
  });

  it('wrong import', () => {
    expect(() => ConfigGlobalModule.forRoot({ imports: [null] })).toThrowError(
      'Wrong import parameter `null`',
    );
  });

  it('wrong provider', () => {
    expect(() =>
      ConfigGlobalModule.forRoot({ providers: [null] }),
    ).toThrowError('Wrong provider parameter `null`');
  });

  it('with options', () => {
    const fromFile = '.env.test';

    @Config('TEST')
    class TestConfig {
      @Env('CLASS_NAME')
      className = 'classValue';
    }

    const myTestConfigToken = 'MY_TEST_CONFIG';
    const myTestConfig = { rawName: 'rawValue' };
    const myTestConfigProvider: Provider = {
      provide: myTestConfigToken,
      useValue: myTestConfig,
    };
    @Module({
      providers: [myTestConfigProvider],
      exports: [myTestConfigProvider],
    })
    class RawTest {}

    const customLogger: LoggerService = console;

    const rawConfigProvider: Provider = {
      provide: RAW_CONFIG,
      inject: [myTestConfigToken],
      useFactory: (raw: typeof myTestConfig) => raw,
    };
    const loggerProvider: Provider = {
      provide: CONFIG_LOGGER,
      useValue: customLogger,
    };

    const options: ConfigOptions = {
      fromFile,

      configs: [TestConfig],

      imports: [RawTest],
      providers: [rawConfigProvider, loggerProvider],
    };
    const configGlobalModule: DynamicModule = ConfigGlobalModule.forRoot(
      options,
    );

    const optionsProvider: Provider = {
      provide: CONFIG_OPTIONS,
      useValue: options,
    };

    const providers: Provider[] = [
      rawConfigProvider,
      loggerProvider,
      optionsProvider,
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
        useFactory: expect.any(Function),
      },
    ];

    expect(configGlobalModule).toEqual({
      module: ConfigGlobalModule,
      imports: [RawTest],
      providers,
      exports: providers,
    });
  });
});
