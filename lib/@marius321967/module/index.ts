import ts from 'typescript';
import { generateStart } from './lib/generator';
import { parse } from './lib/parser';

export const transform = (filePath: string): void => {
  const program = ts.createProgram([filePath], {});

  const parseResult = parse(program, filePath);
  generateStart(parseResult, {
    entrypointPath: filePath,
    program,
    typeChecker: program.getTypeChecker(),
  });

  // console.log(context);
};
