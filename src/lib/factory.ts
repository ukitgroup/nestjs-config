import { ClassType, ParsedConfig } from './types';
import { ENV_CONFIG_NAME_SYMBOL } from './symbols';
import { plainToClass } from '../transformer';

export class ConfigFactory {
  public createConfig(
    parsedConfig: ParsedConfig,
    ConfigClass: ClassType,
  ): typeof ConfigClass.prototype {
    let name = ConfigClass[ENV_CONFIG_NAME_SYMBOL];
    if (!name) {
      // TODO: warning
      name = ConfigClass.name;
    }
    if (!parsedConfig[name]) return new ConfigClass();

    return plainToClass(ConfigClass, parsedConfig[name]);
  }
}
