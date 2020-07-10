import { Provider } from '@nestjs/common';
import { Type } from '@nestjs/common/interfaces/type.interface';
import { DynamicModule } from '@nestjs/common/interfaces/modules/dynamic-module.interface';
import { ForwardReference } from '@nestjs/common/interfaces/modules/forward-reference.interface';
import { ClassType } from './lib/types';

export type ConfigOptions = {
  fromFile?: string;

  configs?: ClassType[];

  imports?: Array<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference
  >;
  providers?: Provider[];
};
