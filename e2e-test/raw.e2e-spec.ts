import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigModule } from '../src';
import { TestModule } from './fixtures/test.module';
import { FirstConfig } from './fixtures/first.config';
import { SecondConfig } from './fixtures/second.config';
import { RAW_CONFIG } from '../src/tokens';

describe('Raw', () => {
  it('override', async () => {
    @Module({
      imports: [
        ConfigModule.forRoot({
          providers: [
            {
              provide: RAW_CONFIG,
              useValue: {
                FIRST__STRING_VAR: 'stringVar',
                FIRST__STRING_VAR_WITH_DEFAULT: 'stringVarWithDefault',
                FIRST__INT_VAR: '1',
                FIRST__INT_VAR_WITH_DEFAULT: '7',
                FIRST__NUMBER_VAR: '1.1',
                FIRST__NUMBER_VAR_WITH_DEFAULT: '7.7',
                FIRST__BOOL_VAR: 'true',
                FIRST__BOOL_VAR_WITH_DEFAULT: 'true',
              },
            },
          ],
        }),
        TestModule,
      ],
    })
    class AppModule {}

    const app = await NestFactory.createApplicationContext(AppModule, {
      bufferLogs: true,
    });

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
      boolVarWithDefault: true,
    });
    expect(secondConfig).toMatchObject({
      variable: 'value',
    });

    await app.close();
  });
});
