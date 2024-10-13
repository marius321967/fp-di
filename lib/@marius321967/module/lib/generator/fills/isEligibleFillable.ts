import ts, { TypeNode } from 'typescript';
import { BlueprintGetter } from '../../repositories/blueprints';
import { canExtractAcceptedTypes, toAcceptedTypes } from './toAcceptedTypes';

/** TODO handle functions */
export const isEligibleFillable = (
  declarationNode: ts.VariableDeclaration,
  typeChecker: ts.TypeChecker,
  getBlueprint: BlueprintGetter,
): declarationNode is Omit<ts.VariableDeclaration, 'initializer'> & {
  initializer: ts.ArrowFunction;
} => {
  if (
    !declarationNode.initializer ||
    !ts.isArrowFunction(declarationNode.initializer)
  ) {
    return false;
  }

  const functionNode = declarationNode.initializer;

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

  const typeReferences = toAcceptedTypes(typeNode);

  return typeReferences.some((type) =>
    hasMatchingBlueprint(type, typeChecker, getBlueprint),
  );
};
