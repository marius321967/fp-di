import ts from 'typescript';
import { importValue } from '../../imports';
import { createSingleExportStatement } from '../node-builders';
import { FilledFunction, FillSyntax } from './structs';

export const generateFillSyntax = (
  fill: FilledFunction,
  modulePath: string,
): FillSyntax => {
  const functionExportNode = createSingleExportStatement(
    getNameForFill(fill.exportedAs),
    createFillInitializer(fill),
  );

  const importNodes = fill.parameterValues.map((value) =>
    importValue(value, modulePath),
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
