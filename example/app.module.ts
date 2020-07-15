import { Module } from '@nestjs/common';
import { ConfigModule } from '../src';
import { CatModule } from './cat/cat.module';
import { AppConfig } from './app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      fromFile: process.env.NODE_ENV === 'production' ? undefined : '.env',
      configs: [AppConfig],
    }),
    CatModule,
  ],
})
export class AppModule {}
