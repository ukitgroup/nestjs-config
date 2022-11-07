export declare type ClassType = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: any[]): {};
};

export type ConfigStorage = {
  [name: string | symbol]:
    | string
    | {
        [name: string]: string | number | boolean;
      };
};

export type ProcessEnv = NodeJS.ProcessEnv;

export type ConfigSource = {
  fromFile?: string;
  raw?: ProcessEnv;
};
