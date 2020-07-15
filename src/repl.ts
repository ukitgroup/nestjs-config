import repl, { REPLServer, ReplOptions } from 'repl';
import { NestFactory } from '@nestjs/core';
import { INestApplicationContext } from '@nestjs/common';
import { Type } from '@nestjs/common/interfaces/type.interface';
import { DynamicModule } from '@nestjs/common/interfaces/modules/dynamic-module.interface';
import { ForwardReference } from '@nestjs/common/interfaces/modules/forward-reference.interface';
import { ConfigFacade } from './lib/facade';
import { RAW_CONFIG } from './tokens';

export class ConfigREPL {
  constructor(private readonly _repl: typeof repl) {}

  startWithAppContext(
    applicationContext: INestApplicationContext,
    options?: ReplOptions,
  ): REPLServer {
    const configFacade = applicationContext.get<ConfigFacade>(ConfigFacade);
    const configs = configFacade.getAllGeneratedConfigs();
    const rawConfig = configFacade.getRawConfig();

    const server = this._repl.start({
      prompt: 'config > ',
      input: process.stdin,
      output: process.stdout,
      terminal: true,
      preview: true,
      ...(options || {}),
    });

    Object.assign(server.context, configs);
    server.context[RAW_CONFIG] = rawConfig;

    return server;
  }

  async startWithAppModule(
    AppModule:
      | Type<any> // eslint-disable-line @typescript-eslint/no-explicit-any
      | DynamicModule
      | Promise<DynamicModule>
      | ForwardReference,
    options?: ReplOptions,
  ): Promise<REPLServer> {
    const applicationContext = await NestFactory.createApplicationContext(
      AppModule,
    );

    return this.startWithAppContext(applicationContext, options);
  }
}

export const configREPL = new ConfigREPL(repl);
