import { LoggerService } from '@nestjs/common';
import { ConfigFacade } from './facade';
import { ConfigExtractor } from './extractor';
import { Config, Env } from '../decorator';
import { Integer } from '../types';

describe('ConfigFacade', () => {
  const configExtractor = { extract: jest.fn() };
  const configParser = { parse: jest.fn() };
  const configFactory = { createConfig: jest.fn() };
  const configValidator = { validate: jest.fn() };
  const logger = { error: jest.fn() };

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

    const configStorage = {};
    const expectedConfig = {
      [variableName]: variableValue,
    };

    configExtractor.extract.mockReturnValueOnce(configStorage);
    configParser.parse.mockReturnValueOnce(configStorage);
    configFactory.createConfig.mockReturnValueOnce(new TestConfig());

    const configFacade = new ConfigFacade(
      (configExtractor as unknown) as ConfigExtractor,
      configParser,
      configFactory,
      configValidator,
      (logger as unknown) as LoggerService,
      undefined,
    );

    expect(configFacade.createConfig(TestConfig)).toMatchObject(expectedConfig);

    expect(configExtractor.extract).toHaveBeenCalledWith(undefined);
    expect(configParser.parse).toHaveBeenCalledWith(configStorage);
    expect(configFactory.createConfig).toHaveBeenCalledWith(
      configStorage,
      TestConfig,
    );
    expect(configValidator.validate).toHaveBeenCalledWith(expectedConfig);
    expect(logger.error).not.toHaveBeenCalled();
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

    const configStorage = {
      [`${envModuleName}__${envVariableName}`]: newValue,
    };
    const expectedConfig = {
      [variableName]: newValue,
    };

    configExtractor.extract.mockReturnValueOnce(configStorage);
    configParser.parse.mockReturnValueOnce(configStorage);
    configFactory.createConfig.mockReturnValueOnce(expectedConfig);

    const configFacade = new ConfigFacade(
      (configExtractor as unknown) as ConfigExtractor,
      configParser,
      configFactory,
      configValidator,
      (logger as unknown) as LoggerService,
      undefined,
    );

    expect(configFacade.createConfig(TestConfig)).toMatchObject(expectedConfig);

    expect(configExtractor.extract).toHaveBeenCalledWith(undefined);
    expect(configParser.parse).toHaveBeenCalledWith(configStorage);
    expect(configFactory.createConfig).toHaveBeenCalledWith(
      configStorage,
      TestConfig,
    );
    expect(configValidator.validate).toHaveBeenCalledWith(expectedConfig);
    expect(logger.error).not.toHaveBeenCalled();
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

    const configStorage = {
      [`${envModuleName}__${envVariableName}`]: newValue,
    };
    const expectedConfig = {
      [variableName]: newValue,
    };

    const errorMessage = 'error message';

    configExtractor.extract.mockReturnValueOnce(configStorage);
    configParser.parse.mockReturnValueOnce(configStorage);
    configFactory.createConfig.mockReturnValueOnce(expectedConfig);
    configValidator.validate.mockImplementationOnce(() => {
      throw new Error(errorMessage);
    });

    const configFacade = new ConfigFacade(
      (configExtractor as unknown) as ConfigExtractor,
      configParser,
      configFactory,
      configValidator,
      (logger as unknown) as LoggerService,
      undefined,
    );

    expect(() => configFacade.createConfig(TestConfig)).toThrowError(
      errorMessage,
    );

    expect(configExtractor.extract).toHaveBeenCalledWith(undefined);
    expect(configParser.parse).toHaveBeenCalledWith(configStorage);
    expect(configFactory.createConfig).toHaveBeenCalledWith(
      configStorage,
      TestConfig,
    );
    expect(configValidator.validate).toHaveBeenCalledWith(expectedConfig);
    expect(logger.error).toHaveBeenCalled();
  });
});
