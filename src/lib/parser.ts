import { ConfigStorage, ProcessEnv } from './types';
import { UNSCOPED_CONFIG_SYMBOL } from './symbols';

export const ENV_MODULE_SEPARATOR = '__';

export class ConfigParser {
  public parse(processEnv: ProcessEnv): ConfigStorage {
    const configStorage: ConfigStorage = {
      [UNSCOPED_CONFIG_SYMBOL]: processEnv,
    };
    Object.entries(processEnv).forEach(
      ([variable, value]: [string, string]) => {
        const split = variable.split(ENV_MODULE_SEPARATOR);
        if (split.length === 1) {
          return;
        }
        const moduleName = split[0];
        configStorage[moduleName] = configStorage[moduleName] || {};
        // interpret empty string as undefined
        configStorage[moduleName][split[1]] = value || undefined;
      },
    );
    return configStorage;
  }
}
