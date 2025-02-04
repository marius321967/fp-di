import ts from 'typescript';
import { unique } from '../../helpers/structs.js';
import { FunctionFill } from '../../parser/fills/structs.js';
import {
  importBlueprint,
  importFillable,
  importValue,
} from '../ts-factories/import.factories.js';

export const generateFillImports = (
  fill: FunctionFill,
  fillModulePath: string,
): ts.ImportDeclaration[] => {
  const valueImports = unique(fill.values).map((value) =>
    importValue(value, fillModulePath),
  );

  const blueprintImports = fill.blueprints
    ? fill.blueprints.map((blueprint) =>
        importBlueprint(blueprint, fillModulePath),
      )
    : [];

  const fillableImport = importFillable(fill.target, fillModulePath);

  return [fillableImport, ...valueImports, ...blueprintImports];
};
