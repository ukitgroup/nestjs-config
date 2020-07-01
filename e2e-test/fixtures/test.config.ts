import { Config, Env } from '../../src';
import { Boolean, Integer, Number, String } from '../../src/types';

@Config('TEST')
export class TestConfig {
  @Env('STRING_VAR')
  @String()
  stringVar: string;

  @Env('STRING_VAR_WITH_DEFAULT')
  @String()
  stringVarWithDefault = 'default';

  @Env('INT_VAR')
  @Integer()
  intVar: number;

  @Env('INT_VAR_WITH_DEFAULT')
  @Integer()
  intVarWithDefault = 0;

  @Env('NUMBER_VAR')
  @Number()
  numberVar: number;

  @Env('NUMBER_VAR_WITH_DEFAULT')
  @Number()
  numberVarWithDefault = 3.33;

  @Env('BOOL_VAR')
  @Boolean()
  boolVar: boolean;

  @Env('BOOL_VAR_WITH_DEFAULT')
  @Boolean()
  boolVarWithDefault = false;
}
