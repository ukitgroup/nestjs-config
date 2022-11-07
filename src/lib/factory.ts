import { ClassType, ConfigStorage } from './types';
import { ENV_CONFIG_NAME_SYMBOL, UNSCOPED_CONFIG_SYMBOL } from './symbols';
import { plainToClass } from '../transformer';

export class ConfigFactory {
  public createConfig(
    configStorage: ConfigStorage,
    ConfigClass: ClassType,
  ): typeof ConfigClass.prototype {
    if (ConfigClass[UNSCOPED_CONFIG_SYMBOL]) {
      return plainToClass(ConfigClass, configStorage[UNSCOPED_CONFIG_SYMBOL], {
        excludeExtraneousValues: true,
      });
    }

    let name = ConfigClass[ENV_CONFIG_NAME_SYMBOL];
    if (!name) {
      // TODO: warning
      name = ConfigClass.name;
    }
    if (!configStorage[name]) return new ConfigClass();

    return plainToClass(ConfigClass, configStorage[name]);
  }
}
