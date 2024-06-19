import ts from 'typescript';
import { resolveOriginalSymbol } from './symbol-tools';

export type IdentifierMapEntry = {
  symbol: ts.Symbol;
  filename: string;
  identifier: ts.Identifier;
};

export type IdentifierMap = IdentifierMapEntry[];

export type SymbolAdder = (
  symbol: ts.Symbol,
  identifier: ts.Identifier,
) => void;

export type SymbolGetter = (symbol: ts.Symbol) => ts.Identifier | null;

export type SymbolListGetter = () => IdentifierMap;

export type SymbolRepository = {
  addSymbol: SymbolAdder;
  getIdentifier: SymbolGetter;
  getIdentifiers: SymbolListGetter;
  // for debug
  items: IdentifierMap;
};

// TODO: remove duplicates (not likely to occur but still semantically needed)
export const combineSymbolRepositories = (
  repo1: SymbolRepository,
  repo2: SymbolRepository,
): SymbolRepository => {
  repo2.items.forEach((item) => {
    repo1.addSymbol(item.symbol, item.identifier);
  });

  return repo1;
};

export const createSymbolRepository = (
  typeChecker: ts.TypeChecker,
  items: IdentifierMap = [],
): SymbolRepository => {
  const addSymbol: SymbolAdder = (symbol, identifier) => {
    items.push({
      symbol: resolveOriginalSymbol(symbol, typeChecker),
      filename: identifier.getSourceFile().fileName,
      identifier,
    });
  };

  const getIdentifier: SymbolGetter = (symbol) => {
    const originalSymbol = resolveOriginalSymbol(symbol, typeChecker);

    return (
      items.find((entry) => entry.symbol === originalSymbol)?.identifier || null
    );
  };

  const getIdentifiers: SymbolListGetter = () => items;

  return {
    addSymbol,
    getIdentifier,
    getIdentifiers,
    // for debug
    items,
  };
};
