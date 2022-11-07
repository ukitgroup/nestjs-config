/* eslint-disable max-classes-per-file */
import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigModule, UnscopedConfig, Env } from '../src';
import { String } from '../src/types';

describe('UnscopedConfig', () => {
  @UnscopedConfig()
  class TestUnscopedConfig {
    @Env('SOME_UNSCOPED_VARIABLE')
    @String()
    stringVar: string;
  }

  @Module({
    imports: [ConfigModule.forRoot({ configs: [TestUnscopedConfig] })],
  })
  class AppModule {}

  beforeAll(() => {
    Object.assign(process.env, {
      SOME_UNSCOPED_VARIABLE: 'stringVarOfSomeVariableOutOfModuleScope',
    });
  });

  it('should successfully map envs out of module scope', async () => {
    const app = await NestFactory.createApplicationContext(AppModule, {
      bufferLogs: true,
    });

    const testConfig = app.get<TestUnscopedConfig>(TestUnscopedConfig);

    expect(testConfig).toMatchObject({
      stringVar: 'stringVarOfSomeVariableOutOfModuleScope',
    });

    await app.close();
  });
});
