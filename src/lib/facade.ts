import { ClassType, ConfigStorage, ProcessEnv } from './types';
import { ConfigExtractor } from './extractor';
import { ConfigParser } from './parser';
import { ConfigFactory } from './factory';
import { ConfigValidator } from './validator';

export class ConfigFacade {
  constructor(
    private readonly configExtractor: ConfigExtractor,
    private readonly configParser: ConfigParser,
    private readonly configFactory: ConfigFactory,
    private readonly configValidator: ConfigValidator,
  ) {}

  private configStorage: ConfigStorage;

  public initialize(fromFile?: string): void {
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
