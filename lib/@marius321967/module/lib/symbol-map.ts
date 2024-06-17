import ts from 'typescript';

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
): SymbolRepository =>
  createSymbolRepository([
    ...repo1.getIdentifiers(),
    ...repo2.getIdentifiers(),
  ]);

export const createSymbolRepository = (
  items: IdentifierMap = [],
): SymbolRepository => {
  const addSymbol: SymbolAdder = (symbol, identifier) => {
    items.push({
      symbol,
      filename: identifier.getSourceFile().fileName,
      identifier,
    });
  };

  const getIdentifier: SymbolGetter = (symbol) =>
    items.find((entry) => entry.symbol === symbol)?.identifier || null;

  const getIdentifiers: SymbolListGetter = () => items;

  return {
    addSymbol,
    getIdentifier,
    getIdentifiers,
    // for debug
    items,
  };
};
