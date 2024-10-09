import ts, { TypeNode } from 'typescript';
import { BlueprintGetter } from '../../repositories/blueprints';
import { assertIsPresent } from '../../tools';

/** TODO handle functions */
export const isEligibleFillable = (
  declarationNode: ts.VariableDeclaration,
  typeChecker: ts.TypeChecker,
  getBlueprint: BlueprintGetter,
): declarationNode is ts.VariableDeclaration & {initializer: ts.ArrowFunction} => {
  if (
    !declarationNode.initializer ||
    !ts.isArrowFunction(declarationNode.initializer)
  ) {
    return false;
  }

  const functionNode = declarationNode.initializer;

  return !functionNode.parameters.every(
    ({ type }) =>
      !!type && hasMatchingBlueprint(type, typeChecker, getBlueprint),
  );
};

const hasMatchingBlueprint = (
  typeNode: TypeNode,
  typeChecker: ts.TypeChecker,
  getBlueprint: BlueprintGetter,
): boolean => {
  if (ts.isTypeReferenceNode(typeNode)) {
    const symbol = typeChecker.getSymbolAtLocation(typeNode.typeName);
    assertIsPresent(symbol, `No symbol found for type [${typeNode.getText()}]`);

    const blueprint = getBlueprint(symbol);

    return !!blueprint;
  }

  if (ts.isUnionTypeNode(typeNode)) {
    return typeNode.types.some((type) =>
      hasMatchingBlueprint(type, typeChecker, getBlueprint),
    );
  }

  return false;
};
