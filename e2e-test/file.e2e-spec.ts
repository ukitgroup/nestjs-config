/* eslint-disable max-classes-per-file */
import * as path from 'path';
import * as fs from 'fs';
import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigModule } from '../src';
import { FirstConfig } from './fixtures/first.config';
import { SecondConfig } from './fixtures/second.config';
import { TestModule } from './fixtures/test.module';
import { CONFIG_LOGGER } from '../src/tokens';

describe('File', () => {
  it('override from file', async () => {
    const envFilePath = path.join(
      __dirname,
      'fixtures',
      `.env.test_${Math.random().toString()}`,
    );
    fs.writeFileSync(
      envFilePath,
      `FIRST__STRING_VAR=stringVar
      FIRST__STRING_VAR_WITH_DEFAULT=stringVarWithDefault
      FIRST__INT_VAR=1
      FIRST__INT_VAR_WITH_DEFAULT=7
      FIRST__NUMBER_VAR=1.1
      FIRST__NUMBER_VAR_WITH_DEFAULT=7.7
      FIRST__BOOL_VAR=true
      FIRST__BOOL_VAR_WITH_DEFAULT=
      SECOND__VARIABLE=new`,
    );

    @Module({
      imports: [
        ConfigModule.forRoot({
          fromFile: envFilePath,
          providers: [
            {
              provide: CONFIG_LOGGER,
              useValue: console,
            },
          ],
        }),
        TestModule,
      ],
    })
    class AppModule {}

    const app = await NestFactory.createApplicationContext(AppModule);

    const firstConfig = app.get<FirstConfig>(FirstConfig);
    const secondConfig = app.get<SecondConfig>(SecondConfig);

    expect(firstConfig).toMatchObject({
      stringVar: 'stringVar',
      stringVarWithDefault: 'stringVarWithDefault',
      intVar: 1,
      intVarWithDefault: 7,
      numberVar: 1.1,
      numberVarWithDefault: 7.7,
      boolVar: true,
      boolVarWithDefault: false,
    });
    expect(secondConfig).toMatchObject({
      variable: 'new',
    });

    await app.close();
    fs.unlinkSync(envFilePath);
  });
});
