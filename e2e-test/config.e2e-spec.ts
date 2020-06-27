/* eslint-disable max-classes-per-file */
import * as path from 'path';
import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigModule, Env, ModuleConfig } from '../src';
import { ToInteger } from '../src/transformer';
import { IsInt } from '../src/validator';

describe('Config', () => {
  describe('single module config', () => {
    @ModuleConfig('TEST')
    class TestConfig {
      @Env('FIELD')
      @ToInteger()
      @IsInt()
      field = 0;
    }

    @Module({
      imports: [ConfigModule.forFeature(TestConfig)],
    })
    class TestModule {}

    it('default', async () => {
      @Module({
        imports: [
          ConfigModule.forRoot({
            path: path.join(__dirname, './fixtures/.env.default'),
          }),
          TestModule,
        ],
      })
      class AppModule {}

      const app = await NestFactory.createApplicationContext(AppModule);
      const config = app.get<TestConfig>(TestConfig);
      expect(config.field).toBe(0);
      await app.close();
    });

    it('override', async () => {
      @Module({
        imports: [
          ConfigModule.forRoot({
            path: path.join(__dirname, './fixtures/.env.test'),
          }),
          TestModule,
        ],
      })
      class AppModule {}

      const app = await NestFactory.createApplicationContext(AppModule);
      const config = app.get<TestConfig>(TestConfig);
      expect(config.field).toBe(7);
      await app.close();
    });
  });
});
