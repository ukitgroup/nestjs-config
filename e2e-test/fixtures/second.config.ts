import { Config, Env } from '../../src';
import { String } from '../../src/types';

@Config('SECOND')
export class SecondConfig {
  @Env('VARIABLE')
  @String()
  variable = 'value';
}
