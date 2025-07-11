import ts from 'typescript';
import { assertIsPresent } from './assert.js';

/** Throws error if symbol is null */
export const getSymbolAtLocation = (
  node: ts.Node,
  typeChecker: ts.TypeChecker,
): ts.Symbol => {
  const symbol = typeChecker.getSymbolAtLocation(node);

  assertIsPresent(symbol, `Symbol not found for node [${node.getText()}]`);

  return symbol;
};

/** Use as callback in array functions */
export const symbolAtLocationGetter =
  (typeChecker: ts.TypeChecker) =>
  (node: ts.Node): ts.Symbol =>
    getSymbolAtLocation(node, typeChecker);

export const resolveOriginalSymbol = (
  localSymbol: ts.Symbol,
  typeChecker: ts.TypeChecker,
): ts.Symbol =>
  (localSymbol.flags & ts.SymbolFlags.Alias) !== 0
    ? typeChecker.getAliasedSymbol(localSymbol)
    : localSymbol;
