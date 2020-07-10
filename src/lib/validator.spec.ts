import { ConfigValidator } from './validator';
import { Config, Env } from '../decorator';
import { Boolean, Integer, Number, String } from '../types';

describe('ConfigValidator', () => {
  const configValidator = new ConfigValidator();

  const configName = 'TestConfig';
  const envConfigName = 'TEST';
  const variableName = 'variable';
  const envVariableName = 'VARIABLE';

  describe('String', () => {
    const value = 'value';

    @Config(envConfigName)
    class TestConfig {
      @Env(envVariableName)
      @String()
      [variableName] = value;
    }

    it('should throw error', () => {
      const testConfig = new TestConfig();

      const badValue = 5;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      testConfig[variableName] = badValue;
      expect(() => configValidator.validate(testConfig)).toThrowError(
        `${configName}.${variableName} received \`${badValue}\` errors: {"isString":"variable must be a string"}`,
      );
    });

    it('should return nothing', () => {
      expect(configValidator.validate(new TestConfig())).toBeUndefined();
    });
  });

  describe('Number', () => {
    const value = 0.1;

    @Config(envConfigName)
    class TestConfig {
      @Env(envVariableName)
      @Number()
      [variableName] = value;
    }

    it('should throw error', () => {
      const testConfig = new TestConfig();

      const badValue = 'abc';
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      testConfig[variableName] = badValue;
      expect(() => configValidator.validate(testConfig)).toThrowError(
        `${configName}.${variableName} received \`${badValue}\` errors: {"isNumber":"variable must be a number conforming to the specified constraints"}`,
      );
    });

    it('should return nothing', () => {
      expect(configValidator.validate(new TestConfig())).toBeUndefined();
    });
  });

  describe('Integer', () => {
    const value = 3;

    @Config(envConfigName)
    class TestConfig {
      @Env(envVariableName)
      @Integer()
      [variableName] = value;
    }

    it('should throw error', () => {
      const testConfig = new TestConfig();

      const badValue = 1.1;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      testConfig[variableName] = badValue;
      expect(() => configValidator.validate(testConfig)).toThrowError(
        `${configName}.${variableName} received \`${badValue}\` errors: {"isInt":"variable must be an integer number"}`,
      );
    });

    it('should return nothing', () => {
      expect(configValidator.validate(new TestConfig())).toBeUndefined();
    });
  });

  describe('Boolean', () => {
    const value = true;

    @Config(envConfigName)
    class TestConfig {
      @Env(envVariableName)
      @Boolean()
      [variableName] = value;
    }

    it('should throw error', () => {
      const testConfig = new TestConfig();

      const badValue = 1;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      testConfig[variableName] = badValue;
      expect(() => configValidator.validate(testConfig)).toThrowError(
        `${configName}.${variableName} received \`${badValue}\` errors: {"isBoolean":"variable must be a boolean value"}`,
      );
    });

    it('should return nothing', () => {
      expect(configValidator.validate(new TestConfig())).toBeUndefined();
    });
  });
});
