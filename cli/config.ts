import { getCommandLineConfig } from './command-line.js';
import { FpTsConfig } from './types.js';

export const getDefaultConfig = (): FpTsConfig => {
  return {
    programDir: './',
  };
};

export const getConfig = async (): Promise<FpTsConfig> => {
  // Get from command line
  // Get from dedicated .json
  // Get from package.json/config

  return {
    ...getDefaultConfig(),
    ...getCommandLineConfig(),
  };
};
