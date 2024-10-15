import ts from 'typescript';
import { importValue } from '../../imports';
import { createSingleExportStatement } from '../node-builders';
import { FilledFunction, FillSyntax } from './structs';

/**
 * Generate AST nodes for a fill file
 * @returns Export statement of function fill; import statements for function being filled and fill Values
 */
export const generateFillSyntax = (
  fill: FilledFunction,
  fillModulePath: string,
): FillSyntax => {
  const functionExportNode = createSingleExportStatement(
    getNameForFill(fill.exportedAs),
    createFillInitializer(fill),
  );

  const importNodes = fill.parameterValues.map((value) =>
    importValue(value, fillModulePath),
  );

  return {
    functionExportNode,
    importNodes,
  };
};

export const createFillInitializer = ({
  exportIdentifier,
  parameterValues,
}: FilledFunction): ts.CallExpression =>
  ts.factory.createCallExpression(
    exportIdentifier,
    undefined,
    parameterValues.map((value) => value.exportIdentifier),
  );

export const getNameForFill = (targetName: string): string =>
  `fill_${targetName}`;
