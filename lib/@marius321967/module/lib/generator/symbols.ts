import ts from 'typescript';
import { resolveOriginalSymbol } from '../symbol';
import { assertIsPresent } from '../tools';

const extractTypeReferences = (
  typeNode: ts.TypeNode,
): ts.TypeReferenceNode[] => {
  if (ts.isTypeReferenceNode(typeNode)) {
    return [typeNode];
  }

  if (ts.isUnionTypeNode(typeNode)) {
    return typeNode.types.filter(ts.isTypeReferenceNode);
  }

  throw new Error(
    `Only TypeReferenceNode, UnionType supported [${typeNode.getText()}]`,
  );
};

/** @returns Single symbol in case of TypeReferenceNode, multiple possible symbols in case of UnionTypeNode */
export const resolveTypeNodeSymbols = (
  typeNode: ts.TypeNode,
  typeChecker: ts.TypeChecker,
): ts.Symbol[] => {
  const typeReferences = extractTypeReferences(typeNode);

  return typeReferences.map((typeReference) => {
    const symbol = typeChecker.getSymbolAtLocation(typeReference.typeName);

    assertIsPresent(
      symbol,
      `Symbol not found by TypeChecker for identifier [${typeNode.getText()}]`,
    );

    return resolveOriginalSymbol(symbol, typeChecker);
  });
};
