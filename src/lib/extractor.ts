import { ProcessEnv } from './types';

export class ConfigExtractor {
  constructor(private readonly fileConfigExtractor: Function) {}

  public extract(fromFile?: string): ProcessEnv {
    if (fromFile) {
      this.fileConfigExtractor({ path: fromFile });
    }

    return { ...process.env };
  }
}
