import { DynamicModule, Provider } from '@nestjs/common';
import { ConfigModule } from './module';
import { ConfigOptions } from './options';
import { ConfigGlobalModule } from './lib/global-module';
import { CONFIG_LOGGER, CONFIG_OPTIONS, RAW_CONFIG } from './tokens';
import { ConfigLogger } from './lib/logger';
import { ConfigFacade } from './lib/facade';
import { ConfigExtractor } from './lib/extractor';
import { ConfigParser } from './lib/parser';
import { ConfigFactory } from './lib/factory';
import { ConfigValidator } from './lib/validator';
import { Config, Env } from './decorator';

describe('ConfigModule', () => {
  describe('forRoot', () => {
    it('empty options', () => {
      const options: ConfigOptions = {};

      const configGlobalModuleProviders: Provider[] = [
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
      const configGlobalModule: DynamicModule = {
        module: ConfigGlobalModule,
        imports: [],
        providers: configGlobalModuleProviders,
        exports: configGlobalModuleProviders,
      };

      jest
        .spyOn(ConfigGlobalModule, 'forRoot')
        .mockImplementationOnce(() => configGlobalModule);

      const configModule: DynamicModule = ConfigModule.forRoot(options);

      expect(configModule).toEqual({
        module: ConfigModule,
        imports: [ConfigGlobalModule.forRoot(options)],
        providers: [],
        exports: [],
      });
      expect(ConfigGlobalModule.forRoot).toHaveBeenCalledWith(options);
    });

    it('configs', () => {
      @Config('TEST')
      class TestConfig {
        @Env('CLASS_NAME')
        className = 'classValue';
      }

      const options: ConfigOptions = {
        configs: [TestConfig],
      };

      const configGlobalModuleProviders: Provider[] = [
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
      const configGlobalModule: DynamicModule = {
        module: ConfigGlobalModule,
        imports: [],
        providers: configGlobalModuleProviders,
        exports: configGlobalModuleProviders,
      };

      jest
        .spyOn(ConfigGlobalModule, 'forRoot')
        .mockImplementationOnce(() => configGlobalModule);

      const configModule: DynamicModule = ConfigModule.forRoot(options);

      const providers: Provider[] = [
        {
          provide: TestConfig,
          inject: [ConfigFacade],
          useFactory: expect.any(Function),
        },
      ];

      expect(configModule).toEqual({
        module: ConfigModule,
        imports: [ConfigGlobalModule.forRoot(options)],
        providers,
        exports: providers,
      });
      expect(ConfigGlobalModule.forRoot).toHaveBeenCalledWith(options);
    });
  });

  describe('forFeature', () => {
    it('empty array', () => {
      const configModule: DynamicModule = ConfigModule.forFeature([]);
      expect(configModule).toEqual({
        module: ConfigModule,
        providers: [],
        exports: [],
      });
    });

    it('several configs', () => {
      @Config('FIRST_TEST')
      class FirstTestConfig {
        @Env('CLASS_NAME')
        className = 'classValue';
      }
      @Config('SECOND_TEST')
      class SecondTestConfig {
        @Env('CLASS_NAME')
        className = 'classValue';
      }

      const configModule: DynamicModule = ConfigModule.forFeature([
        FirstTestConfig,
        SecondTestConfig,
      ]);

      const providers: Provider[] = [
        {
          provide: FirstTestConfig,
          inject: [ConfigFacade],
          useFactory: expect.any(Function),
        },
        {
          provide: SecondTestConfig,
          inject: [ConfigFacade],
          useFactory: expect.any(Function),
        },
      ];

      expect(configModule).toEqual({
        module: ConfigModule,
        providers,
        exports: providers,
      });
    });
  });
});
