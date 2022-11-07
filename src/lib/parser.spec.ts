import { ConfigParser, ENV_MODULE_SEPARATOR } from './parser';
import { UNSCOPED_CONFIG_SYMBOL } from './symbols';

describe('ConfigParser', () => {
  const configParser = new ConfigParser();

  it('should return object only with raw envs if nothing provided', () => {
    expect(configParser.parse({})).toMatchObject({
      [UNSCOPED_CONFIG_SYMBOL]: {},
    });
  });

  it('should return object only with raw envs if module not provided', () => {
    const env = {
      SOME_VARIABLE: 'some value',
    };

    expect(configParser.parse(env)).toMatchObject({
      [UNSCOPED_CONFIG_SYMBOL]: env,
    });
  });

  it('should return values to override module config defaults', () => {
    const moduleName = 'SOME_MODULE';
    const variableName = 'SOME_VARIABLE';
    const value = 'some value';
    const env = {
      [`${moduleName}${ENV_MODULE_SEPARATOR}${variableName}`]: value,
    };

    expect(configParser.parse(env)).toMatchObject({
      [moduleName]: {
        [variableName]: value,
      },
      [UNSCOPED_CONFIG_SYMBOL]: env,
    });
  });

  it('should return empty string value as undefined', () => {
    const moduleName = 'SOME_MODULE';
    const variableName = 'SOME_VARIABLE';
    const value = '';

    expect(
      configParser.parse({
        [`${moduleName}${ENV_MODULE_SEPARATOR}${variableName}`]: value,
      }),
    ).toMatchObject({
      [moduleName]: {
        [variableName]: undefined,
      },
    });
  });
});
