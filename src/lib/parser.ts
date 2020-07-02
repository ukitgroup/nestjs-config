import { ConfigStorage, ProcessEnv } from './types';

export const ENV_MODULE_SEPARATOR = '__';

export class ConfigParser {
  public parse(processEnv: ProcessEnv): ConfigStorage {
    const configStorage: ConfigStorage = {};
    Object.entries(processEnv).forEach(
      ([variable, value]: [string, string]) => {
        const split = variable.split(ENV_MODULE_SEPARATOR);
        if (split.length === 1) {
          return;
        }
        const moduleName = split[0];
        if (!configStorage[moduleName]) {
          configStorage[moduleName] = {};
        }
        configStorage[moduleName][split[1]] = value;
      },
    );
    return configStorage;
  }
}
