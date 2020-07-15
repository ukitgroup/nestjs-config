import { LoggerService } from '@nestjs/common';
import { ClassType, ConfigSource } from './types';
import { ConfigStorage } from './storage';
import { ConfigExtractor } from './extractor';
import { ConfigParser } from './parser';
import { ConfigFactory } from './factory';
import { ConfigValidator } from './validator';
import { RAW_CONFIG } from '../tokens';

export class ConfigFacade {
  constructor(
    private readonly configStorage: ConfigStorage,
    private readonly configExtractor: ConfigExtractor,
    private readonly configParser: ConfigParser,
    private readonly configFactory: ConfigFactory,
    private readonly configValidator: ConfigValidator,
    private readonly logger: LoggerService,
    private readonly source: ConfigSource,
  ) {
    this.configStorage[RAW_CONFIG] = source.raw || {};
    this.configStorage.envs = this.configExtractor.extract(source);
    this.configStorage.parsed = this.configParser.parse(
      this.configStorage.envs,
    );
  }

  public createConfig(ConfigClass: ClassType): typeof ConfigClass.prototype {
    let config = this.configStorage.getConfig(ConfigClass);
    if (config) return config;

    config = this.configFactory.createConfig(
      this.configStorage.parsed,
      ConfigClass,
    );

    try {
      this.configValidator.validate(config);
    } catch (err) {
      this.logger.error({ message: err.message }, 'Config validation error');
      throw err;
    }

    this.configStorage.addConfig(config);

    return config;
  }
}
