import { Config, Env } from '../src';
import { Integer } from '../src/types';

@Config('APP')
export class AppConfig {
  @Env('HTTP_PORT')
  @Integer()
  readonly httpPort: number = 3000;

  @Env('HTTP_TIMEOUT')
  @Integer()
  readonly httpTimeout: number = 10000;
}
