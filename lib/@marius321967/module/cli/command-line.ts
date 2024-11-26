import { program } from 'commander';
import { FpTsConfig } from './types.js';

export const getCommandLineConfig = (): Partial<FpTsConfig> => {
  program
    .option('-d, --programDir <dir>', 'program directory')
    .allowExcessArguments(false)
    .parse();

  return program.opts();
};
