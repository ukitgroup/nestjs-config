import { ConfigFactory } from './factory';
import { Config, Env, UnscopedConfig } from '../decorator';
import { Boolean, Integer, Number, String } from '../types';
import { UNSCOPED_CONFIG_SYMBOL } from './symbols';

describe('ConfigFactory', () => {
  const configFactory = new ConfigFactory();

  describe('Decorated config', () => {
    const envConfigName = 'TEST';
    const variableName = 'variable';
    const envVariableName = 'VARIABLE';
    const value = 'value';

    @Config(envConfigName)
    class TestConfig {
      @Env(envVariableName)
      [variableName] = value;
    }

    it('should return defaults if storage is empty', () => {
      expect(configFactory.createConfig({}, TestConfig)).toMatchObject({
        [variableName]: value,
      });
    });

    it('should return overridden values if storage is not empty', () => {
      const newValue = 'new value';
      expect(
        configFactory.createConfig(
          { [envConfigName]: { [envVariableName]: newValue } },
          TestConfig,
        ),
      ).toMatchObject({
        [variableName]: newValue,
      });
    });
  });

  describe('Unscoped config', () => {
    const variableName = 'variable';
    const envVariableName = 'UNSCOPED_VARIABLE';
    const value = 'value from env';

    @UnscopedConfig()
    class TestConfig {
      @Env(envVariableName)
      @String()
      [variableName]: string;
    }

    it('should return config with raw mapping without prefix', () => {
      expect(
        configFactory.createConfig(
          {
            [UNSCOPED_CONFIG_SYMBOL]: {
              [envVariableName]: value,
            },
          },
          TestConfig,
        ),
      ).toMatchObject({
        [variableName]: value,
      });
    });

    it('should return config without extraneous envs', () => {
      expect(
        configFactory.createConfig(
          {
            [UNSCOPED_CONFIG_SYMBOL]: {
              [envVariableName]: value,
              EXTRANEOUS_ENV: 'extraneous value',
            },
          },
          TestConfig,
        ),
      ).not.toHaveProperty('EXTRANEOUS_ENV');
    });
  });

  describe('Non-decorated config', () => {
    const variableName = 'variable';
    const value = 'value';

    class TestConfig {
      [variableName] = value;
    }

    it('should return defaults if storage is empty', () => {
      expect(configFactory.createConfig({}, TestConfig)).toMatchObject({
        [variableName]: value,
      });
    });

    it('should return overridden values if storage is not empty', () => {
      const newValue = 'value';
      expect(
        configFactory.createConfig(
          { [TestConfig.name]: { [variableName]: newValue } },
          TestConfig,
        ),
      ).toMatchObject({
        [variableName]: newValue,
      });
    });
  });

  describe('module decorator types', () => {
    it('String', () => {
      const envConfigName = 'TEST';
      const variableName = 'variable';
      const envVariableName = 'VARIABLE';
      const value = 'value';

      @Config(envConfigName)
      class TestConfig {
        @Env(envVariableName)
        @String()
        [variableName]: string;
      }

      expect(
        configFactory.createConfig(
          { [envConfigName]: { [envVariableName]: value } },
          TestConfig,
        ),
      ).toMatchObject({
        [variableName]: value,
      });
    });

    it('Number', () => {
      const envConfigName = 'TEST';
      const variableName = 'variable';
      const envVariableName = 'VARIABLE';
      const value = 5.5;

      @Config(envConfigName)
      class TestConfig {
        @Env(envVariableName)
        @Number()
        [variableName]: number;
      }

      expect(
        configFactory.createConfig(
          { [envConfigName]: { [envVariableName]: value } },
          TestConfig,
        ),
      ).toMatchObject({
        [variableName]: value,
      });
    });

    it('Integer', () => {
      const envConfigName = 'TEST';
      const variableName = 'variable';
      const envVariableName = 'VARIABLE';
      const value = 7;

      @Config(envConfigName)
      class TestConfig {
        @Env(envVariableName)
        @Integer()
        [variableName]: number;
      }

      expect(
        configFactory.createConfig(
          { [envConfigName]: { [envVariableName]: value } },
          TestConfig,
        ),
      ).toMatchObject({
        [variableName]: value,
      });
    });

    it('Boolean', () => {
      const envConfigName = 'TEST';
      const variableName = 'variable';
      const envVariableName = 'VARIABLE';
      const value = true;

      @Config(envConfigName)
      class TestConfig {
        @Env(envVariableName)
        @Boolean()
        [variableName]: boolean;
      }

      expect(
        configFactory.createConfig(
          { [envConfigName]: { [envVariableName]: value } },
          TestConfig,
        ),
      ).toMatchObject({
        [variableName]: value,
      });
    });
  });
});
