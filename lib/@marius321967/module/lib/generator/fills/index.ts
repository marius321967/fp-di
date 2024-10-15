import fs from 'fs';
import ts from 'typescript';
import { assertIsPresent } from '../../helpers/assert';
import { ParseResult } from '../../parser/structs';
import { printFile } from '../printFile';
import { generateFillModulePath } from './generateFillModulePath';
import { generateFillSyntax } from './generateFillSyntax';
import { eligibleFillableFilter } from './isEligibleFillable';
import { processEligibleFillable } from './processEligibleFillable';

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
): ParseResult => {
  const source = program.getSourceFile(modulePath);
  assertIsPresent(source, `File [${modulePath}] not found in program`);

  source.forEachChild((node) => {
    if (!ts.isVariableStatement(node)) {
      return;
    }

    const filledFunctions = node.declarationList.declarations
      .filter(
        eligibleFillableFilter(
          program.getTypeChecker(),
          parseResult.blueprints.getBlueprint,
        ),
      )
      .map((declaration) => ({
        ...processEligibleFillable(
          declaration,
          program.getTypeChecker(),
          parseResult.values.getValue,
        ),
        name: declaration.name,
      }));

    const fillPath = generateFillModulePath(modulePath);

    filledFunctions
      .map((filledFunction) => generateFillSyntax(filledFunction, fillPath))
      .map((fillSyntax) =>
        printFile([...fillSyntax.importNodes, fillSyntax.functionExportNode]),
      )
      .forEach((sourceText) => fs.writeFileSync(fillPath, sourceText));
  });

  return parseResult;
};
