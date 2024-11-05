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

  // take program entrypoint function, get fillable from it
  // while not enough Values to fill entrypoint
  //   compile fills (meta only, no file) and update Values
  //   if no fills compiled in this pass, throw error to avoid infinite loop
  // enough fills compiled, write fills to files
  // generate start.ts

  generateStart(parseResult, {
    entrypointPath: programEntrypointPath,
    program,
    typeChecker: program.getTypeChecker(),
  });

  generateFills(parseResult, program, programFiles);
};
