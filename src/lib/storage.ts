import { RAW_CONFIG } from '../tokens';
import { ClassType, ParsedConfig, ProcessEnv } from './types';

export class ConfigStorage {
  private _envs: ProcessEnv;

  private _RAW_CONFIG: ProcessEnv;

  private _parsed: ParsedConfig;

  private configs: {
    [name: string]: {};
  } = {};

  set envs(processEnv: ProcessEnv) {
    this._envs = processEnv;
  }

  get envs(): ProcessEnv {
    return this._envs;
  }

  set [RAW_CONFIG](rawConfig: ProcessEnv) {
    this._RAW_CONFIG = rawConfig;
  }

  get [RAW_CONFIG](): ProcessEnv {
    return this._RAW_CONFIG;
  }

  set parsed(parsedConfig: ParsedConfig) {
    this._parsed = parsedConfig;
  }

  get parsed(): ParsedConfig {
    return this._parsed;
  }

  addConfig(config: {}): void {
    this.configs[config.constructor.name] = config;
  }

  getConfig(ConfigClass: ClassType): typeof ConfigClass.prototype | undefined {
    return this.configs[ConfigClass.name];
  }

  getAllConfigs(): { [name: string]: {} } {
    return this.configs;
  }
}
