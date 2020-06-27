import * as dotenv from 'dotenv';
import { plainToClass } from './transformer';
import { validateSync, ValidationError } from './validator';

const config = {};

export function init(options): void {
  const dotenvParseOutput = dotenv.config({ path: options.path }).parsed;
  Object.entries(dotenvParseOutput).forEach(
    ([variable, value]: [string, string]) => {
      const split = variable.split('__');
      const moduleName = split[0];
      if (!config[moduleName]) config[moduleName] = {};
      config[moduleName][split[1]] = value;
    },
  );
}

export function make(ConfigClass): typeof ConfigClass.prototype {
  const name = ConfigClass[Symbol.for('name')];
  if (!config[name]) return new ConfigClass();

  const moduleConfig = plainToClass(ConfigClass, config[name]);

  const validationErrors: ValidationError[] = validateSync(moduleConfig);
  if (validationErrors.length > 0) {
    throw new Error(JSON.stringify(validationErrors));
  }

  return moduleConfig;
}
