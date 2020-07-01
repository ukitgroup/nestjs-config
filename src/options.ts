export type ConfigClass = {
  new (): Object;
};

export type ConfigOptions = {
  fromProcess?: boolean;
  fromFile?: string;

  configs?: ConfigClass[];
};
