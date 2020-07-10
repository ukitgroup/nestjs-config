import { Module } from '@nestjs/common';
import { ConfigModule } from '../../src';
import { FirstConfig } from './first.config';
import { SecondConfig } from './second.config';

@Module({
  imports: [ConfigModule.forFeature([FirstConfig, SecondConfig])],
})
export class TestModule {}
