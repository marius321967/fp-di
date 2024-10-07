import ts from 'typescript';
import { resolveOriginalSymbol } from '../symbol';

/**
 * TODO: handle union types, return an array
 * @returns Original symbol
 */
export const resolveTypeNodeSymbol = (
  typeNode: ts.TypeNode,
  typeChecker: ts.TypeChecker,
): ts.Symbol => {
  if (!ts.isTypeReferenceNode(typeNode)) {
    throw new Error(
      `Only TypeReferenceNode supported when resolving symbol from type [${typeNode.getText()}]`,
    );
  }

  const symbol = typeChecker.getSymbolAtLocation(typeNode.typeName);

  if (!symbol) {
    throw new Error(
      `Symbol not found by TypeChecker for identifier [${typeNode.getText()}]`,
    );
  }

  return resolveOriginalSymbol(symbol, typeChecker);
};
