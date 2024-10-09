import { generateFills } from './lib/generator/fills';
import { generateStart } from './lib/generator/generateStart';
import { parseProgram } from './lib/parser';
import { prepareProgram } from './lib/tools';

export const transform = (programDir: string): void => {
  const { program, programFiles, programEntrypointPath } =
    prepareProgram(programDir);

  const parseResult = parseProgram(
    programFiles,
    programEntrypointPath,
    program,
  );

  generateStart(parseResult, {
    entrypointPath: programEntrypointPath,
    program,
    typeChecker: program.getTypeChecker(),
  });

  generateFills(parseResult, program, programFiles);
};
