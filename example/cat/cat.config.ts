import { Config, Env } from '../../src';
import { Boolean, Number, String } from '../../src/types';
import { Transform } from '../../src/transformer';
import { IsDate, IsOptional } from '../../src/validator';

@Config('CAT')
export class CatConfig {
  @Env('NAME')
  @String()
  readonly name: string;

  @Env('WEIGHT')
  @Number()
  readonly weight: number;

  @Env('KNOW_PROGRAMMING')
  @Boolean()
  readonly knowsProgramming: boolean = true;

  @Env('BIRTH_DATE')
  @Transform((value) => new Date(value))
  @IsOptional()
  @IsDate()
  readonly birthDate: Date;
}
