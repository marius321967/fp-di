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

export type SymbolMapTools = {
  addSymbol: SymbolAdder;
  getIdentifier: SymbolGetter;
  getIdentifiers: SymbolListGetter;
};

// TODO: remove duplicates (not likely to occur but still semantically needed)
export const combineSymbolMaps = (
  items1: IdentifierMap,
  items2: IdentifierMap,
): IdentifierMap => [...items1, ...items2];

export const createSymbolMap = (items: IdentifierMap = []): SymbolMapTools => {
  const addSymbol: SymbolAdder = (symbol, identifier) => {
    items = [
      ...items,
      { symbol, filename: identifier.getSourceFile().fileName, identifier },
    ];
  };

  const getIdentifier: SymbolGetter = (symbol) =>
    items.find((entry) => entry.symbol === symbol)?.identifier || null;

  const getIdentifiers: SymbolListGetter = () => items;

  return {
    addSymbol,
    getIdentifier,
    getIdentifiers,
  };
};
