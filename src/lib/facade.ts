import { LoggerService } from '@nestjs/common';
import { ClassType, ConfigSource, ConfigStorage, ProcessEnv } from './types';
import { ConfigExtractor } from './extractor';
import { ConfigParser } from './parser';
import { ConfigFactory } from './factory';
import { ConfigValidator } from './validator';

export class ConfigFacade {
  private readonly configStorage: ConfigStorage;

  constructor(
    private readonly configExtractor: ConfigExtractor,
    private readonly configParser: ConfigParser,
    private readonly configFactory: ConfigFactory,
    private readonly configValidator: ConfigValidator,
    private readonly logger: LoggerService,
    private readonly source: ConfigSource,
  ) {
    const processEnv: ProcessEnv = this.configExtractor.extract(source);
    this.configStorage = this.configParser.parse(processEnv);
  }

  public createConfig(ConfigClass: ClassType): typeof ConfigClass.prototype {
    const config = this.configFactory.createConfig(
      this.configStorage,
      ConfigClass,
    );
    try {
      this.configValidator.validate(config);
    } catch (err) {
      this.logger.error({ message: err.message }, 'Config validation error');
      throw err;
    }
    return config;
  }
}
