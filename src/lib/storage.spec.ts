import { ConfigStorage } from './storage';
import { RAW_CONFIG } from '../tokens';

describe('ConfigStorage', () => {
  let configStorage: ConfigStorage;

  beforeEach(() => {
    configStorage = new ConfigStorage();
  });

  it('get/set envs', () => {
    const envs = { envVar: 'value' };
    configStorage.envs = envs;
    expect(configStorage.envs).toEqual(envs);
  });

  it('get/set RAW_CONFIG', () => {
    const rawConfig = { envVar: 'value' };
    configStorage[RAW_CONFIG] = rawConfig;
    expect(configStorage[RAW_CONFIG]).toEqual(rawConfig);
  });

  it('get/set parsed', () => {
    const parsed = { envModule: { envVar: 'value' } };
    configStorage.parsed = parsed;
    expect(configStorage.parsed).toEqual(parsed);
  });

  describe('config', () => {
    it('get/set config', () => {
      class TestConfig {
        env = 'value';
      }
      const testConfig = new TestConfig();

      configStorage.addConfig(testConfig);
      expect(configStorage.getConfig(TestConfig)).toEqual(testConfig);
    });

    it('getAllConfigs', () => {
      class TestConfig1 {
        env = 'value';
      }
      const testConfig1 = new TestConfig1();

      class TestConfig2 {
        env = 'value';
      }
      const testConfig2 = new TestConfig2();

      configStorage.addConfig(testConfig1);
      configStorage.addConfig(testConfig2);
      expect(configStorage.getAllConfigs()).toEqual({
        [TestConfig1.name]: testConfig1,
        [TestConfig2.name]: testConfig2,
      });
    });
  });
});
