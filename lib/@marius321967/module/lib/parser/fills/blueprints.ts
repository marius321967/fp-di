import ts, { TypeNode } from 'typescript';
import {
  canExtractAcceptedTypes,
  toAcceptedTypes,
} from '../../generator/fills/toAcceptedTypes';
import { excludeNull, excludeUndefined } from '../../helpers/structs';
import { getSymbolAtLocation } from '../../helpers/symbols';
import { BlueprintGetter } from '../../repositories/blueprints';
import { Blueprints } from '../../types';

/**
 * @returns Blueprints extracted for each parameters item. Length always matches parameters.
 * Null if not all parameters have matching blueprints.
 */
export const matchParametersBlueprints = (
  parameters: ts.NodeArray<ts.ParameterDeclaration>,
  typeChecker: ts.TypeChecker,
  getBlueprint: BlueprintGetter,
): Blueprints[] | null => {
  const parameterBlueprints = parameters
    .map(({ type }) => type)
    .filter(excludeUndefined)
    .map((typeNode) =>
      tryExtractBlueprints(typeNode, typeChecker, getBlueprint),
    );

  return parameterBlueprints.every(excludeNull) ? parameterBlueprints : null;
};

/** @returns Null if no blueprints could be matched. Array never empty. */
export const tryExtractBlueprints = (
  typeNode: TypeNode,
  typeChecker: ts.TypeChecker,
  getBlueprint: BlueprintGetter,
): Blueprints | null => {
  if (!canExtractAcceptedTypes(typeNode)) {
    return null;
  }

  const blueprints = toAcceptedTypes(typeNode)
    .map((typeReferenceNod) => {
      const symbol = getSymbolAtLocation(
        typeReferenceNod.typeName,
        typeChecker,
      );

      return getBlueprint(symbol);
    })
    .filter(excludeNull);

  return blueprints.length ? blueprints : null;
};
