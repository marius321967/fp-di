import ts from 'typescript';
import { unique } from '../../helpers/structs';
import { importBlueprint, importFillable, importValue } from '../../imports';
import { FunctionFill } from '../../parser/fills/structs';

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
