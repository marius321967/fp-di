import ts from 'typescript';

export const resolveOriginalSymbol = (
  localSymbol: ts.Symbol,
  typeChecker: ts.TypeChecker,
): ts.Symbol =>
  (localSymbol.flags & ts.SymbolFlags.Alias) !== 0
    ? typeChecker.getAliasedSymbol(localSymbol)
    : localSymbol;
