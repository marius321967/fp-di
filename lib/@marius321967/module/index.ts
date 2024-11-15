import { generateAssets } from './lib/generator/generateAssets';
import { parseProgram } from './lib/parser';
import { prepareProgram } from './lib/tools';

export const transform = (programDir: string): void => {
  const preparedProgram = prepareProgram(programDir);

  const parseResult = parseProgram(preparedProgram);

  generateAssets(parseResult, preparedProgram);
};
