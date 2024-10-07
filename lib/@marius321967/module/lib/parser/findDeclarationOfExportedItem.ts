import ts from 'typescript';
import { resolveOriginalSymbol } from '../symbol';
import { assertIsPresent } from '../tools';

export const findDeclarationOfExportedItem = (
  node: ts.ExportSpecifier,
  typeChecker: ts.TypeChecker,
): ts.Declaration => {
  const symbol = typeChecker.getSymbolAtLocation(
    node.propertyName || node.name,
  );

  assertIsPresent(
    symbol,
    `Symbol not found for export specifier [${node.name}]`,
  );

  const originalSymbol = resolveOriginalSymbol(symbol, typeChecker);

  assertIsPresent(
    originalSymbol.declarations,
    `No declarations found for symbol [${originalSymbol.name}]`,
  );

  const declarationNode = originalSymbol.declarations[0];

  assertIsPresent(
    declarationNode,
    `No declaration found for original symbol [${originalSymbol.name}]`,
  );

  return declarationNode;
};
