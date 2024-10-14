import { importValue } from '../../imports';
import { FilledFunction, FillSyntax } from './structs';

export const generateFillSyntax = (
  fill: FilledFunction,
  modulePath: string,
): FillSyntax => {
  // TODO: how do we find export?
  const functionExportNode = fill.functionNode;

  const importNodes = fill.parameterValues.map((value) =>
    importValue(value, modulePath),
  );

  return {
    functionExportNode,
    importNodes,
  };
};
