import { Module } from '@nestjs/common';
import { ConfigModule } from '../../src';
import { CatConfig } from './cat.config';
import { CatService } from './cat.service';
import { CatController } from './cat.controller';

@Module({
  imports: [ConfigModule.forFeature([CatConfig])],
  providers: [CatService],
  controllers: [CatController],
})
export class CatModule {}
