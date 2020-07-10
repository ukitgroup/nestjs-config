/* eslint-disable */
import { LoggerService } from '@nestjs/common';

export class ConfigLogger implements LoggerService {
  log(message: any, context?: string): any {}

  error(message: any, trace?: string, context?: string): any {}

  warn(message: any, context?: string): any {}

  debug(message: any, context?: string): any {}

  verbose(message: any, context?: string): any {}
}
