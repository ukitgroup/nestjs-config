import { ConfigSource, ProcessEnv } from './types';

export class ConfigExtractor {
  constructor(private readonly fileConfigExtractor: Function) {}

  public extract(source: ConfigSource): ProcessEnv {
    const { fromFile, raw = {} } = source;
    if (fromFile) {
      this.fileConfigExtractor({ path: fromFile });
    }

    return { ...process.env, ...raw };
  }
}
