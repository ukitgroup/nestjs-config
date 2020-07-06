import { ConfigFacade } from './facade';
import { ConfigExtractor } from './extractor';
import { Config, Env } from '../decorator';

describe('ConfigFacade', () => {
  const configExtractor = { extract: jest.fn() };
  const configParser = { parse: jest.fn() };
  const configFactory = { createConfig: jest.fn() };
  const configValidator = { validate: jest.fn() };

  const configFacade = new ConfigFacade(
    (configExtractor as unknown) as ConfigExtractor,
    configParser,
    configFactory,
    configValidator,
  );

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

    configFacade.initialize();

    expect(configFacade.createConfig(TestConfig)).toMatchObject(expectedConfig);

    expect(configExtractor.extract).toHaveBeenCalledWith(undefined);
    expect(configParser.parse).toHaveBeenCalledWith(configStorage);
    expect(configFactory.createConfig).toHaveBeenCalledWith(
      configStorage,
      TestConfig,
    );
    expect(configValidator.validate).toHaveBeenCalledWith(expectedConfig);
  });
});
