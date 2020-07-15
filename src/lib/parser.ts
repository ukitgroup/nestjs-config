import { ParsedConfig, ProcessEnv } from './types';

export const ENV_MODULE_SEPARATOR = '__';

export class ConfigParser {
  public parse(processEnv: ProcessEnv): ParsedConfig {
    const parsedConfig: ParsedConfig = {};
    Object.entries(processEnv).forEach(
      ([variable, value]: [string, string]) => {
        const split = variable.split(ENV_MODULE_SEPARATOR);
        if (split.length === 1) {
          return;
        }
        const moduleName = split[0];
        parsedConfig[moduleName] = parsedConfig[moduleName] || {};
        // interpret empty string as undefined
        parsedConfig[moduleName][split[1]] = value || undefined;
      },
    );
    return parsedConfig;
  }
}
