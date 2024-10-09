import ts from 'typescript';
import { generateFills } from './lib/generator/fills';
import { generateStart } from './lib/generator/generateStart';
import { parseProgram } from './lib/parser';
import { getParsedConfig } from './lib/tools';

export const transform = (programDir: string): void => {
  const config = getParsedConfig(programDir, programDir + '/tsconfig.json');

  const programFiles = config.fileNames;

  const programEntrypointPath = programDir + '/test-program.ts';
  const program = ts.createProgram([programEntrypointPath], config.options);

  const diagnostics = ts.getPreEmitDiagnostics(program);

  if (diagnostics.length > 0) {
    throw new Error('Program has syntax errors');
  }

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

  generateFills(parseResult, program);
};
