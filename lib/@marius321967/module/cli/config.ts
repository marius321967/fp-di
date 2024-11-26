export type FpTsConfig = { programDir: string };

export const getDefaultConfig = (): FpTsConfig => {
  return {
    programDir: './',
  };
};

export const getConfig = async (): Promise<FpTsConfig> => {
  return getDefaultConfig();
};
