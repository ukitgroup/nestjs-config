import { LoggerService } from '@nestjs/common';
import { ConfigFacade } from './facade';
import { Config, Env } from '../decorator';
import { Integer } from '../types';
import { ConfigStorage } from './storage';
import { ConfigExtractor } from './extractor';
import { ConfigParser } from './parser';
import { ConfigFactory } from './factory';
import { ConfigValidator } from './validator';
import { ConfigLogger } from './logger';

describe('ConfigFacade', () => {
  let configStorage: ConfigStorage;
  let configExtractor: jest.Mocked<Partial<ConfigExtractor>>;
  let configParser: jest.Mocked<ConfigParser>;
  let configFactory: jest.Mocked<ConfigFactory>;
  let configValidator: jest.Mocked<ConfigValidator>;
  let logger: jest.Mocked<Partial<ConfigLogger>>;
  let configStorageSpies: {
    envsGetter: jest.SpyInstance;
    envsSetter: jest.SpyInstance;
    rawConfigGetter: jest.SpyInstance;
    rawConfigSetter: jest.SpyInstance;
    parsedGetter: jest.SpyInstance;
    parsedSetter: jest.SpyInstance;
    addConfig: jest.SpyInstance;
    getConfig: jest.SpyInstance;
  };

  beforeEach(() => {
    configStorage = new ConfigStorage();
    configExtractor = { extract: jest.fn() };
    configParser = { parse: jest.fn() };
    configFactory = { createConfig: jest.fn() };
    configValidator = { validate: jest.fn() };
    logger = { error: jest.fn() };
    configStorageSpies = {
      envsGetter: jest.spyOn(configStorage, 'envs', 'get'),
      envsSetter: jest.spyOn(configStorage, 'envs', 'set'),
      rawConfigGetter: jest.spyOn(configStorage, 'RAW_CONFIG', 'get'),
      rawConfigSetter: jest.spyOn(configStorage, 'RAW_CONFIG', 'set'),
      parsedGetter: jest.spyOn(configStorage, 'parsed', 'get'),
      parsedSetter: jest.spyOn(configStorage, 'parsed', 'set'),
      addConfig: jest.spyOn(configStorage, 'addConfig'),
      getConfig: jest.spyOn(configStorage, 'getConfig'),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create config with default values', () => {
    const variableName = 'name';
    const variableValue = 'value';

    @Config('TEST')
    class TestConfig {
      @Env('VARIABLE')
      [variableName] = variableValue;
    }

    const expectedConfig = {
      [variableName]: variableValue,
    };

    configExtractor.extract.mockReturnValueOnce({});
    configParser.parse.mockReturnValueOnce({});
    configFactory.createConfig.mockReturnValueOnce(new TestConfig());

    const configSource = {};

    const configFacade = new ConfigFacade(
      configStorage,
      (configExtractor as unknown) as ConfigExtractor,
      configParser,
      configFactory,
      configValidator,
      (logger as unknown) as LoggerService,
      configSource,
    );

    expect(configFacade.createConfig(TestConfig)).toMatchObject(expectedConfig);

    expect(configStorageSpies.rawConfigSetter).toHaveBeenCalledWith({});
    expect(configExtractor.extract).toHaveBeenCalledWith(configSource);
    expect(configStorageSpies.envsSetter).toHaveBeenCalledWith({});
    expect(configParser.parse).toHaveBeenCalledWith({});
    expect(configStorageSpies.parsedSetter).toHaveBeenCalledWith({});
    expect(configStorageSpies.getConfig).toHaveBeenCalledWith(TestConfig);
    expect(configFactory.createConfig).toHaveBeenCalledWith({}, TestConfig);
    expect(configValidator.validate).toHaveBeenCalledWith(expectedConfig);
    expect(logger.error).not.toHaveBeenCalled();
    expect(configStorageSpies.addConfig).toHaveBeenCalledWith(expectedConfig);
  });

  it('should create config and override default values', () => {
    const envModuleName = 'TEST';
    const variableName = 'name';
    const envVariableName = 'VARIABLE';
    const variableValue = 'value';
    const newValue = 'new';

    @Config(envModuleName)
    class TestConfig {
      @Env(envVariableName)
      [variableName] = variableValue;
    }

    const envs = {
      [`${envModuleName}__${envVariableName}`]: newValue,
    };
    const parsed = {
      [envModuleName]: { [envVariableName]: newValue },
    };
    const expectedConfig = {
      [variableName]: newValue,
    };

    configExtractor.extract.mockReturnValueOnce(envs);
    configParser.parse.mockReturnValueOnce(parsed);
    configFactory.createConfig.mockReturnValueOnce(expectedConfig);

    const configSource = { fromFile: '.env.test' };

    const configFacade = new ConfigFacade(
      configStorage,
      (configExtractor as unknown) as ConfigExtractor,
      configParser,
      configFactory,
      configValidator,
      (logger as unknown) as LoggerService,
      configSource,
    );

    expect(configFacade.createConfig(TestConfig)).toMatchObject(expectedConfig);

    expect(configStorageSpies.rawConfigSetter).toHaveBeenCalledWith({});
    expect(configExtractor.extract).toHaveBeenCalledWith(configSource);
    expect(configStorageSpies.envsSetter).toHaveBeenCalledWith(envs);
    expect(configParser.parse).toHaveBeenCalledWith(envs);
    expect(configStorageSpies.parsedSetter).toHaveBeenCalledWith(parsed);
    expect(configStorageSpies.getConfig).toHaveBeenCalledWith(TestConfig);
    expect(configFactory.createConfig).toHaveBeenCalledWith(parsed, TestConfig);
    expect(configValidator.validate).toHaveBeenCalledWith(expectedConfig);
    expect(logger.error).not.toHaveBeenCalled();
    expect(configStorageSpies.addConfig).toHaveBeenCalledWith(expectedConfig);
  });

  it('should throw error if validation fails', () => {
    const envModuleName = 'TEST';
    const variableName = 'name';
    const envVariableName = 'VARIABLE';
    const variableValue = 7;
    const newValue = 'new';

    @Config(envModuleName)
    class TestConfig {
      @Env(envVariableName)
      @Integer()
      [variableName] = variableValue;
    }

    const envs = {
      [`${envModuleName}__${envVariableName}`]: newValue,
    };
    const parsed = {
      [envModuleName]: { [envVariableName]: newValue },
    };
    const expectedConfig = {
      [variableName]: newValue,
    };

    const errorMessage = 'error message';

    configExtractor.extract.mockReturnValueOnce(envs);
    configParser.parse.mockReturnValueOnce(parsed);
    configFactory.createConfig.mockReturnValueOnce(expectedConfig);
    configValidator.validate.mockImplementationOnce(() => {
      throw new Error(errorMessage);
    });

    const configSource = { raw: { variable: 'value' } };
    const configFacade = new ConfigFacade(
      configStorage,
      (configExtractor as unknown) as ConfigExtractor,
      configParser,
      configFactory,
      configValidator,
      (logger as unknown) as LoggerService,
      configSource,
    );

    expect(() => configFacade.createConfig(TestConfig)).toThrowError(
      errorMessage,
    );

    expect(configStorageSpies.rawConfigSetter).toHaveBeenCalledWith(
      configSource.raw,
    );
    expect(configExtractor.extract).toHaveBeenCalledWith(configSource);
    expect(configStorageSpies.envsSetter).toHaveBeenCalledWith(envs);
    expect(configParser.parse).toHaveBeenCalledWith(envs);
    expect(configStorageSpies.parsedSetter).toHaveBeenCalledWith(parsed);
    expect(configStorageSpies.getConfig).toHaveBeenCalledWith(TestConfig);
    expect(configFactory.createConfig).toHaveBeenCalledWith(parsed, TestConfig);
    expect(configValidator.validate).toHaveBeenCalledWith(expectedConfig);
    expect(logger.error).toHaveBeenCalled();
    expect(configStorageSpies.addConfig).not.toHaveBeenCalled();
  });

  it('should return already exists config', () => {
    const variableName = 'name';
    const variableValue = 'value';

    @Config('TEST')
    class TestConfig {
      @Env('VARIABLE')
      [variableName] = variableValue;
    }

    const expectedConfig = {
      [variableName]: variableValue,
    };

    configExtractor.extract.mockReturnValueOnce({});
    configParser.parse.mockReturnValueOnce({});
    configFactory.createConfig.mockReturnValueOnce(new TestConfig());

    const configSource = {};

    const configFacade = new ConfigFacade(
      configStorage,
      (configExtractor as unknown) as ConfigExtractor,
      configParser,
      configFactory,
      configValidator,
      (logger as unknown) as LoggerService,
      configSource,
    );

    expect(configFacade.createConfig(TestConfig)).toMatchObject(expectedConfig);
    jest.clearAllMocks();
    expect(configFacade.createConfig(TestConfig)).toMatchObject(expectedConfig);

    expect(configStorageSpies.getConfig).toHaveBeenCalledWith(TestConfig);
    expect(configFactory.createConfig).not.toHaveBeenCalled();
    expect(configValidator.validate).not.toHaveBeenCalled();
    expect(logger.error).not.toHaveBeenCalled();
    expect(configStorageSpies.addConfig).not.toHaveBeenCalled();
  });
});
