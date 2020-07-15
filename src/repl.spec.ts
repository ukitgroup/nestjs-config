import repl from 'repl';
import { NestFactory } from '@nestjs/core';
import { NestFactoryStatic } from '@nestjs/core/nest-factory';
import { INestApplicationContext } from '@nestjs/common';
import { ConfigREPL } from './repl';
import { RAW_CONFIG } from './tokens';

jest.mock('@nestjs/core');

describe('ConfigREPL', () => {
  it('startWithAppContext', () => {
    const replMock: jest.Mocked<Partial<typeof repl>> = {
      start: jest.fn(),
    };
    const configREPL = new ConfigREPL(replMock as typeof repl);
    const facadeMock = {
      getAllGeneratedConfigs: jest.fn(),
      getRawConfig: jest.fn(),
    };
    const applicationContext: jest.Mocked<Partial<INestApplicationContext>> = {
      get: jest.fn(),
    };

    applicationContext.get.mockReturnValueOnce(facadeMock);
    facadeMock.getAllGeneratedConfigs.mockReturnValueOnce({});
    facadeMock.getRawConfig.mockReturnValueOnce({});
    const replServer = { context: {} };
    replMock.start.mockReturnValueOnce(replServer as repl.REPLServer);

    expect(
      configREPL.startWithAppContext(
        applicationContext as INestApplicationContext,
      ),
    ).toEqual({
      context: { [RAW_CONFIG]: {} },
    });
  });

  it('startWithAppModule', async () => {
    const replMock: jest.Mocked<Partial<typeof repl>> = {
      start: jest.fn(),
    };
    const configREPL = new ConfigREPL(replMock as typeof repl);
    const facadeMock = {
      getAllGeneratedConfigs: jest.fn(),
      getRawConfig: jest.fn(),
    };
    const applicationContext: jest.Mocked<Partial<INestApplicationContext>> = {
      get: jest.fn(),
    };
    (NestFactory as jest.Mocked<
      NestFactoryStatic
    >).createApplicationContext.mockResolvedValueOnce(
      applicationContext as INestApplicationContext,
    );

    applicationContext.get.mockReturnValueOnce(facadeMock);
    const configs = {
      AppConfig: { variable: 'value' },
      CatConfig: { variable: 'value' },
    };
    facadeMock.getAllGeneratedConfigs.mockReturnValueOnce(configs);
    const rawConfig = { variable: 'value' };
    facadeMock.getRawConfig.mockReturnValueOnce(rawConfig);
    const replServer = { context: {} };
    replMock.start.mockReturnValueOnce(replServer as repl.REPLServer);

    await expect(configREPL.startWithAppModule(undefined)).resolves.toEqual({
      context: { [RAW_CONFIG]: rawConfig, ...configs },
    });
  });
});
