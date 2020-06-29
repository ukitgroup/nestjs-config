/* eslint-disable max-classes-per-file */
import * as path from 'path';
import * as fs from 'fs';
import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigModule } from '../src';
import { TestModule } from './fixtures/test.module';

describe('Config', () => {
  class TestConfig {
    stringVar: string;

    stringVarWithDefault = 'default';

    notStringVar: number;

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
      `TestConfig__stringVar=stringVar
      TestConfig__stringVarWithDefault=stringVarWithDefault
      TestConfig__notStringVar=notStringVar
      TestConfig__notStringVarWithDefault=notStringVarWithDefault`,
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
