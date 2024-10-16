import fs from 'fs';
import ts from 'typescript';
import { assertIsPresent } from '../../helpers/assert';
import { ParseResult } from '../../parser/structs';
import { printFile } from '../printFile';
import { fillParseReducer } from './fillParseReducer';
import { generateFillModulePath } from './generateFillModulePath';
import { generateFillsFile } from './generateFillsFileSyntax';
import { FilledFunction } from './structs';

export const generateFills = (
  parseResult: ParseResult,
  program: ts.Program,
  programFiles: string[],
): void => {
  const fillResults = programFiles.reduce(
    programFillReducer(parseResult, program),
    0,
  );
};

export const programFillReducer =
  (parseResult: ParseResult, program: ts.Program) =>
  (acc: number, path: string): number => {
    const result = processFileFillables(path, program, parseResult);

    return acc;
  };

export const processFileFillables = (
  modulePath: string,
  program: ts.Program,
  parseResult: ParseResult,
): FilledFunction[] => {
  const source = program.getSourceFile(modulePath);
  assertIsPresent(source, `File [${modulePath}] not found in program`);

  const fillPath = generateFillModulePath(modulePath);

  const filledFunctions = source
    .getChildren()
    .map((node) => node.getChildren())
    .reduce((acc, children) => [...acc, ...children], [])
    .reduce(fillParseReducer(program.getTypeChecker(), parseResult), []);

  if (filledFunctions.length > 0) {
    const fillFileSyntax = generateFillsFile(filledFunctions, fillPath);

    const sourceText = printFile([
      ...fillFileSyntax.importNodes,
      ...fillFileSyntax.fillExportNodes,
    ]);

    fs.writeFileSync(fillPath, sourceText);
  }

  return filledFunctions;
};
