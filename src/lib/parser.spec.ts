import { ConfigParser, ENV_MODULE_SEPARATOR } from './parser';

describe('ConfigParser', () => {
  const configParser = new ConfigParser();

  it('should return empty object if nothing provided', () => {
    expect(configParser.parse({})).toMatchObject({});
  });

  it('should return empty object if module not provided', () => {
    expect(
      configParser.parse({
        SOME_VARIABLE: 'some value',
      }),
    ).toMatchObject({});
  });

  it('should return values to override module config defaults', () => {
    const moduleName = 'SOME_MODULE';
    const variableName = 'SOME_VARIABLE';
    const value = 'some value';

    expect(
      configParser.parse({
        [`${moduleName}${ENV_MODULE_SEPARATOR}${variableName}`]: value,
      }),
    ).toMatchObject({
      [moduleName]: {
        [variableName]: value,
      },
    });
  });
});
