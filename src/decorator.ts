import { Expose } from '@ukitgroup/class-transformer';

export function ModuleConfig(name: string): (target) => void {
  return (target): void => {
    // eslint-disable-next-line no-param-reassign
    target[Symbol.for('name')] = name;
  };
}

export function Env(name: string): (target, propertyName?: string) => void {
  return Expose({ name });
}
