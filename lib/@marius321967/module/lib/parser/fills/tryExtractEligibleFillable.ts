import ts, { TypeNode } from 'typescript';
import {
  canExtractAcceptedTypes,
  toAcceptedTypes,
} from '../../generator/fills/toAcceptedTypes';
import { excludeNull, excludeUndefined } from '../../helpers/structs';
import { getSymbolAtLocation } from '../../helpers/symbols';
import { BlueprintGetter } from '../../repositories/blueprints';
import { Blueprints } from '../../types';
import { EligibleFillable } from './structs';

/** TODO handle function x() {} */
export const tryExtractEligibleFillable = (
  declarationNode: ts.VariableDeclaration,
  typeChecker: ts.TypeChecker,
  getBlueprint: BlueprintGetter,
): EligibleFillable | null => {
  if (
    !declarationNode.initializer ||
    !ts.isArrowFunction(declarationNode.initializer)
  ) {
    return null;
  }

  const functionNode = declarationNode.initializer;

  const parameterBlueprints = matchParametersBlueprints(
    functionNode.parameters,
    typeChecker,
    getBlueprint,
  );

  if (!parameterBlueprints || !functionNode.type) {
    return null;
  }

  const blueprints = tryExtractBlueprints(
    functionNode.type,
    typeChecker,
    getBlueprint,
  );

  if (!blueprints) {
    return null;
  }

  return {
    declarationNode,
    initializerNode: functionNode,
    blueprints,
    parameterBlueprints: parameterBlueprints,
  };
};

/**
 * @returns Blueprints extracted for each parameters item. Length always matches parameters.
 * Null if not all parameters have matching blueprints.
 */
const matchParametersBlueprints = (
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
const tryExtractBlueprints = (
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
