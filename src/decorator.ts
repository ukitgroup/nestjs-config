import { Expose } from './transformer';
import { ENV_CONFIG_NAME_SYMBOL, UNSCOPED_CONFIG_SYMBOL } from './lib/symbols';

export function Config(name: string): ClassDecorator {
  return (target: Function): void => {
    // eslint-disable-next-line no-param-reassign
    target[ENV_CONFIG_NAME_SYMBOL] = name;
  };
}

export function UnscopedConfig(): ClassDecorator {
  return (target: Function): void => {
    // eslint-disable-next-line no-param-reassign
    target[UNSCOPED_CONFIG_SYMBOL] = true;
  };
}

export function Env(name: string): PropertyDecorator {
  return Expose({ name });
}
