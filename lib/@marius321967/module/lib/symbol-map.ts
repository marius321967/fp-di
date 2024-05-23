import ts from 'typescript';

export type IdentifierMap = { symbol: ts.Symbol; identifier: ts.Identifier }[];

export const createIdentifierMap = (): IdentifierMap => [];

let map = createIdentifierMap();

export const addIdentifier = (
  symbol: ts.Symbol,
  identifier: ts.Identifier,
): IdentifierMap => (map = [...map, { symbol, identifier }]);

export const getIdentifier = (symbol: ts.Symbol): ts.Identifier | null =>
  map.find((entry) => entry.symbol === symbol)?.identifier || null;

export const getIdentifiers = (): IdentifierMap => map;
