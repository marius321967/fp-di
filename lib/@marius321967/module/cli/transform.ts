import { generateAssets } from '../lib/generator/generateAssets.js';
import { parseProgram } from '../lib/parser/index.js';
import { prepareProgram } from '../lib/tools.js';
import { FpTsConfig } from './config.js';

export const transform = (config: FpTsConfig): void => {
  console.debug('[FPTS] Transforming program with config', config);

  const preparedProgram = prepareProgram(config.programDir);

  const parseResult = parseProgram(preparedProgram);

  generateAssets(parseResult, preparedProgram);
};
