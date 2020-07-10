import { ConfigExtractor } from './extractor';

describe('ConfigExtractor', () => {
  const fileConfigExtractor = jest.fn();
  const configExtractor = new ConfigExtractor(fileConfigExtractor);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should extract env variables from file', () => {
    const fromFile = '.env.test';
    const name = 'name';
    const value = 'value';

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    fileConfigExtractor.mockImplementationOnce(() => {
      process.env[name] = value;
    });

    expect(configExtractor.extract({ fromFile })[name]).toMatch(value);
    expect(fileConfigExtractor).toHaveBeenCalledWith({ path: fromFile });

    delete process.env[name];
  });

  it('should return process.env and raw', () => {
    const name1 = 'name1';
    const value1 = 'value1';
    const name2 = 'name2';
    const value2 = 'value2';

    process.env[name1] = value1;

    const result = configExtractor.extract({ raw: { [name2]: value2 } });
    expect(result[name1]).toMatch(value1);
    expect(result[name2]).toMatch(value2);
    expect(fileConfigExtractor).not.toHaveBeenCalled();

    delete process.env[name1];
  });

  it('should return process.env variables if nothing provided', () => {
    const name = 'name';
    const value = 'value';

    process.env[name] = value;

    expect(configExtractor.extract({})[name]).toMatch(value);
    expect(fileConfigExtractor).not.toHaveBeenCalled();

    delete process.env[name];
  });
});
