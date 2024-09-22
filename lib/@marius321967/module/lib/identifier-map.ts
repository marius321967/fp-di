import ts from 'typescript';
import { resolveOriginalSymbol } from './symbol-tools';

export type IdentifierMapEntry = {
  symbol: ts.Symbol;
  filename: string;
  identifier: ts.Identifier;
};

export type IdentifierMap = IdentifierMapEntry[];

export type IdentifierAdder = (
  symbol: ts.Symbol,
  identifier: ts.Identifier,
) => void;

export type IdentifierGetter = (symbol: ts.Symbol) => ts.Identifier | null;

export type IdentifierListGetter = () => IdentifierMap;

export type IdentifierRepository = {
  addIdentifier: IdentifierAdder;
  getIdentifier: IdentifierGetter;
  getIdentifiers: IdentifierListGetter;
  // for debug
  items: IdentifierMap;
};

// TODO: remove duplicates (not likely to occur but still semantically needed)
export const combineIdentifierRepositories = (
  repo1: IdentifierRepository,
  repo2: IdentifierRepository,
): IdentifierRepository => {
  repo2.items.forEach((item) => {
    repo1.addIdentifier(item.symbol, item.identifier);
  });

  return repo1;
};

export const createIdentifierRepository = (
  typeChecker: ts.TypeChecker,
  items: IdentifierMap = [],
): IdentifierRepository => {
  const addIdentifier: IdentifierAdder = (symbol, identifier) => {
    items.push({
      symbol: resolveOriginalSymbol(symbol, typeChecker),
      filename: identifier.getSourceFile().fileName,
      identifier,
    });
  };

  const getIdentifier: IdentifierGetter = (symbol) => {
    const originalSymbol = resolveOriginalSymbol(symbol, typeChecker);

    return (
      items.find((entry) => entry.symbol === originalSymbol)?.identifier || null
    );
  };

  const getIdentifiers: IdentifierListGetter = () => items;

  return {
    addIdentifier,
    getIdentifier,
    getIdentifiers,
    // for debug
    items,
  };
};
