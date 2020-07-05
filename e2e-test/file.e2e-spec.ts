/* eslint-disable max-classes-per-file */
import * as path from 'path';
import * as fs from 'fs';
import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigModule } from '../src';
import { TestConfig } from './fixtures/test.config';
import { TestModule } from './fixtures/test.module';

describe('File', () => {
  it('override from file', async () => {
    const envFilePath = path.join(
      __dirname,
      'fixtures',
      `.env.test_${Math.random().toString()}`,
    );
    fs.writeFileSync(
      envFilePath,
      `TEST__STRING_VAR=stringVar
      TEST__STRING_VAR_WITH_DEFAULT=stringVarWithDefault
      TEST__INT_VAR=1
      TEST__INT_VAR_WITH_DEFAULT=7
      TEST__NUMBER_VAR=1.1
      TEST__NUMBER_VAR_WITH_DEFAULT=7.7
      TEST__BOOL_VAR=true
      TEST__BOOL_VAR_WITH_DEFAULT=true`,
    );

    @Module({
      imports: [ConfigModule.forRoot({ fromFile: envFilePath }), TestModule],
    })
    class AppModule {}

    const app = await NestFactory.createApplicationContext(AppModule);
    const config = app.get<TestConfig>(TestConfig);
    expect(config).toMatchObject({
      stringVar: 'stringVar',
      stringVarWithDefault: 'stringVarWithDefault',
      intVar: 1,
      intVarWithDefault: 7,
      numberVar: 1.1,
      numberVarWithDefault: 7.7,
      boolVar: true,
      boolVarWithDefault: true,
    });

    await app.close();
    fs.unlinkSync(envFilePath);
  });
});
