import { Module } from '@nestjs/common';
import { ConfigModule } from '../src';
import { CatModule } from './cat/cat.module';

@Module({
  imports: [ConfigModule.forRoot({}), CatModule],
})
export class AppModule {}
