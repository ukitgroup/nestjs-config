import { Controller, Post } from '@nestjs/common';
import { CatService } from './cat.service';

@Controller()
export class CatController {
  constructor(private readonly catService: CatService) {}

  @Post('meow')
  meow(): void {
    this.catService.meow();
  }
}
