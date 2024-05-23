import ts from 'typescript';

export type ValueMap = { symbol: ts.Symbol; value: unknown }[];

export const createValueMap = (): ValueMap => [];

let map = createValueMap();

export const addValue = (symbol: ts.Symbol, value: unknown): ValueMap =>
  (map = [...map, { symbol, value }]);

export const getValue = (symbol: ts.Symbol): unknown | null =>
  map.find((entry) => entry.symbol === symbol)?.value || null;

export const getValues = (): ValueMap => map;
