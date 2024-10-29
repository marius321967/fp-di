import ts from 'typescript';
import {
  importBlueprint,
  importFilledFunction,
  importValue,
} from '../../imports';
import {
  createSingleExportStatement,
  createUnionTypeFromBlueprints,
} from '../node-builders';
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
    getNameForFill(fill),
    createFillInitializer(fill),
    createUnionTypeFromBlueprints(fill.blueprints),
  );

  const valueImports = fill.parameterValues.map((value) =>
    importValue(value, fillModulePath),
  );

  const blueprintImports = fill.blueprints.map((blueprint) =>
    importBlueprint(blueprint, fillModulePath),
  );

  const filledFunctionImport = importFilledFunction(fill, fillModulePath);

  return {
    fillExportNode: functionExportNode,
    importNodes: [filledFunctionImport, ...valueImports, ...blueprintImports],
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

export const getNameForFill = (fill: FilledFunction): string =>
  `fill_${fill.exportedAs}`;
