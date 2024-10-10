import ts from 'typescript';
import { getSymbolAtLocation, resolveOriginalSymbol } from '../helpers/symbols';
import { toAcceptedTypes } from './fills/toAcceptedTypes';

/** @returns Single symbol in case of TypeReferenceNode, multiple possible symbols in case of UnionTypeNode */
export const resolveTypeNodeSymbols = (
  typeNode: ts.TypeNode,
  typeChecker: ts.TypeChecker,
): ts.Symbol[] => {
  const typeReferences = toAcceptedTypes(typeNode);

  return typeReferences.map((typeReference) => {
    const symbol = getSymbolAtLocation(typeReference.typeName, typeChecker);

    return resolveOriginalSymbol(symbol, typeChecker);
  });
};
