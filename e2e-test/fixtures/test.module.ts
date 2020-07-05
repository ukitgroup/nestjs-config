import { Module } from '@nestjs/common';
import { ConfigModule } from '../../src';
import { TestConfig } from './test.config';

@Module({
  imports: [ConfigModule.forFeature([TestConfig])],
})
export class TestModule {}
