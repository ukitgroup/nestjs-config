import * as dotenv from 'dotenv';
import { ProcessEnv } from './types';

export class ConfigExtractor {
  public extract(fromFile?: string): ProcessEnv {
    if (fromFile) {
      dotenv.config({ path: fromFile });
    }

    return { ...process.env };
  }
}
