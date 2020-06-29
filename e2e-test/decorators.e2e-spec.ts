/* eslint-disable max-classes-per-file */
import * as path from 'path';
import * as fs from 'fs';
import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Config, ConfigModule, Env } from '../src';
import { TestModule } from './fixtures/test.module';

describe('Config', () => {
  @Config('TEST')
  class TestConfig {
    @Env('STRING_VAR')
    stringVar: string;

    @Env('STRING_VAR_WITH_DEFAULT')
    stringVarWithDefault = 'default';

    @Env('NOT_STRING_VAR')
    notStringVar: number;

    @Env('NOT_STRING_VAR_WITH_DEFAULT')
    notStringVarWithDefault = 0;
  }

  let envFilePath: string;
  beforeEach(() => {
    envFilePath = path.join(
      __dirname,
      'fixtures',
      `.env.test_${Math.random().toString()}`,
    );
    fs.writeFileSync(envFilePath, '');
  });

  afterEach(() => {
    fs.unlinkSync(envFilePath);
  });

  it('default', async () => {
    @Module({
      imports: [
        ConfigModule.forRoot({ path: envFilePath }),
        TestModule.forFeature(TestConfig),
      ],
    })
    class AppModule {}

    const app = await NestFactory.createApplicationContext(AppModule);
    const config = app.get<TestConfig>(TestConfig);
    expect(config).toMatchObject({
      stringVarWithDefault: 'default',
      notStringVarWithDefault: 0,
    });
    await app.close();
  });

  it('override', async () => {
    fs.writeFileSync(
      envFilePath,
      `TEST__STRING_VAR=stringVar
      TEST__STRING_VAR_WITH_DEFAULT=stringVarWithDefault
      TEST__NOT_STRING_VAR=notStringVar
      TEST__NOT_STRING_VAR_WITH_DEFAULT=notStringVarWithDefault`,
    );

    @Module({
      imports: [
        ConfigModule.forRoot({ path: envFilePath }),
        TestModule.forFeature(TestConfig),
      ],
    })
    class AppModule {}

    const app = await NestFactory.createApplicationContext(AppModule);
    const config = app.get<TestConfig>(TestConfig);
    expect(config).toMatchObject({
      stringVar: 'stringVar',
      stringVarWithDefault: 'stringVarWithDefault',
      notStringVar: 'notStringVar',
      notStringVarWithDefault: 'notStringVarWithDefault',
    });
    await app.close();
  });
});
