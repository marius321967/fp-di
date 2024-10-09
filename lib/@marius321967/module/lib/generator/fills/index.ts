import ts from 'typescript';
import { ParseResult } from '../../parser/structs';
import { assertIsPresent } from '../../tools';
import { isEligibleFillable } from './isEligibleFillable';

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
    const result = processFileFill(path, program, parseResult);

    return acc;
  };

export const processFileFill = (
  path: string,
  program: ts.Program,
  parseResult: ParseResult,
): ParseResult => {
  const source = program.getSourceFile(path);
  assertIsPresent(source, `File [${path}] not found in program`);

  source.forEachChild((node) => {
    if (!ts.isVariableStatement(node)) {
      return;
    }

    node.declarationList.declarations
      .filter((declaration) => {
        isEligibleFillable(
          declaration,
          program.getTypeChecker(),
          parseResult.blueprints.getBlueprint,
        );
      })
      .forEach((declaration) => {
        console.log('Eligible fillable', declaration.getText());
      });

    // if node's parameters are all found among Blueprints
    // if node's parameters have candidates among Values
    // then make a fill package with: imports of needed Values, import of function being filled, export of filled function [eg: export notifyUser(emailNotifier)]
    // save it to file named `<>.fill.ts`
  });

  return parseResult;
};
