import ts from 'typescript';

export type ValueMap = {
  symbol: ts.Symbol;
  valueDeclaration: ts.VariableDeclaration;
}[];

export const createValueMap = (): ValueMap => [];

let map = createValueMap();

export const addValue = (
  symbol: ts.Symbol,
  valueDeclaration: ts.VariableDeclaration,
): ValueMap => (map = [...map, { symbol, valueDeclaration: valueDeclaration }]);

export const getValue = (symbol: ts.Symbol): ts.VariableDeclaration | null =>
  map.find((entry) => entry.symbol === symbol)?.valueDeclaration || null;

export const getValues = (): ValueMap => map;
