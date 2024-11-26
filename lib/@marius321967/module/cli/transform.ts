import { generateAssets } from '../lib/generator/generateAssets';
import { parseProgram } from '../lib/parser';
import { prepareProgram } from '../lib/tools';
import { FpTsConfig } from './config';

export const transform = (config: FpTsConfig): void => {
  console.debug('[FPTS] Transforming program with config', config);

  const preparedProgram = prepareProgram(config.programDir);

  const parseResult = parseProgram(preparedProgram);

  generateAssets(parseResult, preparedProgram);
};
