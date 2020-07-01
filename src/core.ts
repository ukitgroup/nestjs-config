import * as dotenv from 'dotenv';
import { plainToClass } from './transformer';
import { validateSync, ValidationError } from './validator';
import { ENV_CONFIG_NAME_SYMBOL } from './symbols';
import { ConfigClass, ConfigOptions } from './options';

const globalConfig = {};

export function init(options: ConfigOptions): void {
  if (options.fromFile && options.fromProcess) {
    throw new Error('Single source expected');
  }

  let config = {};
  if (options.fromFile) {
    config = dotenv.config({ path: options.fromFile }).parsed;
  } else if (options.fromProcess) {
    config = process.env;
  } else {
    // TODO: warning
  }

  Object.entries(config).forEach(([variable, value]: [string, string]) => {
    const split = variable.split('__');
    if (split.length === 1) {
      globalConfig[variable] = value;
    } else {
      const moduleName = split[0];
      if (!globalConfig[moduleName]) globalConfig[moduleName] = {};
      globalConfig[moduleName][split[1]] = value;
    }
  });
}

export function make(configClass: ConfigClass): typeof configClass.prototype {
  let name = configClass[ENV_CONFIG_NAME_SYMBOL];
  if (!name) {
    // TODO: warning
    name = configClass.name;
  }
  if (!globalConfig[name]) return new configClass();

  const moduleConfig = plainToClass(configClass, globalConfig[name]);

  const validationErrors: ValidationError[] = validateSync(moduleConfig);
  if (validationErrors.length > 0) {
    throw new Error(JSON.stringify(validationErrors));
  }

  return moduleConfig;
}
