import { ClassType, ConfigStorage } from './types';
import { ENV_CONFIG_NAME_SYMBOL } from './symbols';
import { plainToClass } from '../transformer';

export class ConfigFactory {
  public createConfig(
    configStorage: ConfigStorage,
    ConfigClass: ClassType,
  ): typeof ConfigClass.prototype {
    let name = ConfigClass[ENV_CONFIG_NAME_SYMBOL];
    if (!name) {
      // TODO: warning
      name = ConfigClass.name;
    }
    if (!configStorage[name]) return new ConfigClass();

    return plainToClass(ConfigClass, configStorage[name]);
  }
}
