import fs from 'fs';
import ts from 'typescript';
import { assertIsPresent } from '../../helpers/assert';
import { ParseResult } from '../../parser/structs';
import { printFile } from '../printFile';
import { addFillToFile } from './addFillToFile';
import { generateFillModulePath } from './generateFillModulePath';
import { generateFillSyntax } from './generateFillSyntax';
import { eligibleFillableFilter } from './isEligibleFillable';
import { processEligibleFillable } from './processEligibleFillable';
import { FillFileSyntax } from './structs';

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
): void => {
  const source = program.getSourceFile(modulePath);
  assertIsPresent(source, `File [${modulePath}] not found in program`);

  const fillPath = generateFillModulePath(modulePath);
  let fillFileSyntax: FillFileSyntax = { fillExportNodes: [], importNodes: [] };

  source.forEachChild((node) => {
    if (!ts.isVariableStatement(node)) {
      return;
    }

    // TODO: eliminate imports of same value (in meta step, not later in syntax)
    const filledFunctions = node.declarationList.declarations
      .filter(
        eligibleFillableFilter(
          program.getTypeChecker(),
          parseResult.blueprints.getBlueprint,
        ),
      )
      .map((declaration) =>
        processEligibleFillable(
          declaration,
          program.getTypeChecker(),
          parseResult.values.getValue,
        ),
      )
      .map((filledFunction) => generateFillSyntax(filledFunction, fillPath))
      .forEach((fillSyntax) => {
        fillFileSyntax = addFillToFile(fillFileSyntax, fillSyntax);
      });
  });

  if (fillFileSyntax.fillExportNodes.length > 0) {
    const sourceText = printFile([
      ...fillFileSyntax.importNodes,
      ...fillFileSyntax.fillExportNodes,
    ]);

    fs.writeFileSync(fillPath, sourceText);
  }
};
