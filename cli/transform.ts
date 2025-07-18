import { generateAssets } from '../lib/generator/generateAssets.js';
import { parseProgram } from '../lib/parser/index.js';
import { prepareProgram } from '../lib/tools.js';
import { FpTsConfig } from './types.js';

export const transform = (config: FpTsConfig): Promise<void> => {
  console.debug('[FPTS] Transforming program with config', config);

  const preparedProgram = prepareProgram(config.programDir);

  const parseResult = parseProgram(preparedProgram);

  return generateAssets(parseResult, preparedProgram);
};
