import ts, { TypeNode } from 'typescript';
import { getSymbolAtLocation } from '../../helpers/symbols';
import { BlueprintGetter } from '../../repositories/blueprints';
import { FunctionLikeNode } from '../../types';
import { canExtractAcceptedTypes, toAcceptedTypes } from './toAcceptedTypes';

export type EligibleFillable = ts.VariableDeclaration & {
  initializer: FunctionLikeNode;
};

export const eligibleFillableFilter =
  (typeChecker: ts.TypeChecker, getBlueprint: BlueprintGetter) =>
  (
    declarationNode: ts.VariableDeclaration,
  ): declarationNode is EligibleFillable =>
    isEligibleFillable(declarationNode, typeChecker, getBlueprint);

/** TODO handle function x() {} */
export const isEligibleFillable = (
  declarationNode: ts.VariableDeclaration,
  typeChecker: ts.TypeChecker,
  getBlueprint: BlueprintGetter,
): declarationNode is EligibleFillable => {
  if (
    !declarationNode.initializer ||
    !ts.isArrowFunction(declarationNode.initializer)
  ) {
    return false;
  }

  const functionNode: FunctionLikeNode = declarationNode.initializer;

  return functionNode.parameters.every(
    ({ type }) =>
      !!type && hasMatchingBlueprint(type, typeChecker, getBlueprint),
  );
};

const hasMatchingBlueprint = (
  typeNode: TypeNode,
  typeChecker: ts.TypeChecker,
  getBlueprint: BlueprintGetter,
): boolean => {
  if (!canExtractAcceptedTypes(typeNode)) {
    return false;
  }

  return toAcceptedTypes(typeNode).some((typeReferenceNod) => {
    const symbol = getSymbolAtLocation(typeReferenceNod.typeName, typeChecker);

    const blueprint = getBlueprint(symbol);

    return !!blueprint;
  });
};
