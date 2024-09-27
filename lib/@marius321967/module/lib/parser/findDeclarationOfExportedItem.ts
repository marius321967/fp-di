import ts from 'typescript';
import { resolveOriginalSymbol } from '../symbol-tools';

export const findDeclarationOfExportedItem = (
  node: ts.ExportSpecifier,
  typeChecker: ts.TypeChecker,
): ts.Declaration => {
  const symbol = typeChecker.getSymbolAtLocation(
    node.propertyName || node.name,
  );

  if (!symbol) {
    throw new Error('No symbol found');
  }

  const originalSymbol = resolveOriginalSymbol(symbol, typeChecker);

  if (!originalSymbol.declarations) {
    throw new Error(
      `No declarations found for symbol [${originalSymbol.name}]`,
    );
  }

  const declarationNode = originalSymbol.declarations[0];

  if (!declarationNode) {
    throw new Error(
      `No declaration found for original symbol [${originalSymbol.name}]`,
    );
  }

  return declarationNode;
};
