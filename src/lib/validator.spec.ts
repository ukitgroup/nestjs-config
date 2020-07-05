import { ConfigValidator } from './validator';
import { Config, Env } from '../decorator';
import { Boolean, Integer, Number, String } from '../types';

describe('ConfigValidator', () => {
  const configValidator = new ConfigValidator();

  describe('String', () => {
    const envConfigName = 'TEST';
    const variableName = 'variable';
    const envVariableName = 'VARIABLE';
    const value = 'value';

    @Config(envConfigName)
    class TestConfig {
      @Env(envVariableName)
      @String()
      [variableName] = value;
    }

    it('should throw error', () => {
      const testConfig = new TestConfig();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      testConfig[variableName] = 5;
      expect(() => configValidator.validate(testConfig)).toThrowError();
    });

    it('should return nothing', () => {
      expect(configValidator.validate(new TestConfig())).toBeUndefined();
    });
  });

  describe('Number', () => {
    const envConfigName = 'TEST';
    const variableName = 'variable';
    const envVariableName = 'VARIABLE';
    const value = 0.1;

    @Config(envConfigName)
    class TestConfig {
      @Env(envVariableName)
      @Number()
      [variableName] = value;
    }

    it('should throw error', () => {
      const testConfig = new TestConfig();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      testConfig[variableName] = 'abc';
      expect(() => configValidator.validate(testConfig)).toThrowError();
    });

    it('should return nothing', () => {
      expect(configValidator.validate(new TestConfig())).toBeUndefined();
    });
  });

  describe('Integer', () => {
    const envConfigName = 'TEST';
    const variableName = 'variable';
    const envVariableName = 'VARIABLE';
    const value = 3;

    @Config(envConfigName)
    class TestConfig {
      @Env(envVariableName)
      @Integer()
      [variableName] = value;
    }

    it('should throw error', () => {
      const testConfig = new TestConfig();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      testConfig[variableName] = 1.1;
      expect(() => configValidator.validate(testConfig)).toThrowError();
    });

    it('should return nothing', () => {
      expect(configValidator.validate(new TestConfig())).toBeUndefined();
    });
  });

  describe('Boolean', () => {
    const envConfigName = 'TEST';
    const variableName = 'variable';
    const envVariableName = 'VARIABLE';
    const value = true;

    @Config(envConfigName)
    class TestConfig {
      @Env(envVariableName)
      @Boolean()
      [variableName] = value;
    }

    it('should throw error', () => {
      const testConfig = new TestConfig();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      testConfig[variableName] = 1;
      expect(() => configValidator.validate(testConfig)).toThrowError();
    });

    it('should return nothing', () => {
      expect(configValidator.validate(new TestConfig())).toBeUndefined();
    });
  });
});
