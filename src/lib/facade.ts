import { ClassType, ConfigStorage, ProcessEnv } from './types';
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
    private readonly fromFile?: string,
  ) {
    const processEnv: ProcessEnv = this.configExtractor.extract(fromFile);
    this.configStorage = this.configParser.parse(processEnv);
  }

  public createConfig(ConfigClass: ClassType): typeof ConfigClass.prototype {
    const config = this.configFactory.createConfig(
      this.configStorage,
      ConfigClass,
    );
    this.configValidator.validate(config);
    return config;
  }
}
