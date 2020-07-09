import { Inject, Injectable } from '@nestjs/common';
import { CatConfig } from './cat.config';

@Injectable()
export class CatService {
  constructor(@Inject(CatConfig) private readonly config: CatConfig) {}

  meow(): void {
    if (typeof this.config.name !== 'string' || this.config.name !== 'vasya')
      throw new Error('name');
    if (typeof this.config.weight !== 'number' || this.config.weight !== 5)
      throw new Error('weight');
    if (
      typeof this.config.knowsProgramming !== 'boolean' ||
      this.config.knowsProgramming !== false
    )
      throw new Error('knowsProgramming');
    if (
      typeof this.config.birthDate !== 'object' ||
      this.config.birthDate !== new Date('2020-07-09T18:30:00')
    )
      throw new Error('birthDate');
  }
}
