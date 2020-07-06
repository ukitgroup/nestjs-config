import { ConfigExtractor } from './extractor';

describe('ConfigExtractor', () => {
  const fileConfigExtractor = jest.fn();
  const configExtractor = new ConfigExtractor(fileConfigExtractor);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should extract env variables from file', () => {
    const fileName = '.env.test';
    const name = 'name';
    const value = 'value';

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    fileConfigExtractor.mockImplementationOnce(({ path }: { path: string }) => {
      process.env[name] = value;
    });

    expect(configExtractor.extract(fileName)[name]).toMatch(value);
    expect(fileConfigExtractor).toHaveBeenCalledWith({ path: fileName });

    delete process.env[name];
  });

  it('should return process.env variables if file not provided', () => {
    const name = 'name';
    const value = 'value';

    process.env[name] = value;

    expect(configExtractor.extract()[name]).toMatch(value);
    expect(fileConfigExtractor).not.toHaveBeenCalled();

    delete process.env[name];
  });
});
