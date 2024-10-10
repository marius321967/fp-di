import ts from 'typescript';
import { ParseResult } from '../../parser/structs';
import { assertIsPresent } from '../../tools';
import { isEligibleFillable } from './isEligibleFillable';
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

    const filledFunctions = node.declarationList.declarations
      .filter((declaration) =>
        isEligibleFillable(
          declaration,
          program.getTypeChecker(),
          parseResult.blueprints.getBlueprint,
        ),
      )
      .map((declaration) => ({
        ...processEligibleFillable(
          declaration.initializer as any,
          program.getTypeChecker(),
          parseResult.values.getValue,
        ),
        name: declaration.name,
      }));

    filledFunctions.forEach((filledFunction) => {
      console.log(
        `Fillable function: ${filledFunction.name.getText()}; params:`,
      );
      filledFunction.parameterValues.forEach((value) => {
        console.log(
          `  ${value.filename}:${value.exportedAs}: ${value.typeSymbol.name}`,
        );
      });
    });

    // if node's parameters are all found among Blueprints
    // if node's parameters have candidates among Values
    // then make a fill package with: imports of needed Values, import of function being filled, export of filled function [eg: export notifyUser(emailNotifier)]
    // save it to file named `<>.fill.ts`
  });

  return parseResult;
};
