import path from 'path';
import ts from 'typescript';
import { assertIsPresent } from '../../helpers/assert';
import { ParseResult } from '../../parser/structs';
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

    const pathBasename = path.basename(modulePath, '.ts');
    const fillPath = `${pathBasename}.fill.ts`;

    filledFunctions
      .map((filledFunction) => generateFillSyntax(filledFunction, fillPath))
      .forEach((fillSyntax) => {
        console.log(`[${fillPath}]:`);

        const printer = ts.createPrinter();
        const sourceText = printer.printList(
          ts.ListFormat.MultiLine,
          ts.factory.createNodeArray([
            ...fillSyntax.importNodes,
            fillSyntax.functionExportNode,
          ]),
          ts.createSourceFile('', '', ts.ScriptTarget.Latest),
        );

        console.log(sourceText);
      });

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
  });

  return parseResult;
};
