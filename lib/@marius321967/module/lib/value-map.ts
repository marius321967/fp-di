import ts from 'typescript';
import { resolveOriginalSymbol } from './symbol-tools';

export type ValueMapEntry = {
  symbol: ts.Symbol;
  valueDeclaration: ts.VariableDeclaration;
  filename: string;
  exportedAs: string;
};

export type ValueMap = ValueMapEntry[];

export type ValueAdder = (
  symbol: ts.Symbol,
  valueDeclaration: ts.VariableDeclaration,
) => void;
export type ValueGetter = (symbol: ts.Symbol) => ValueMapEntry | null;
export type ValueListGetter = () => ValueMap;

export type ValueRepository = {
  addValue: ValueAdder;
  getValue: ValueGetter;
  getValues: ValueListGetter;
};

export const combineValueRepositories = (
  repo1: ValueRepository,
  repo2: ValueRepository,
): ValueRepository => {
  repo2.getValues().forEach((item) => {
    repo1.addValue(item.symbol, item.valueDeclaration);
  });

  return repo1;
};

export const createValueRepository = (
  typeChecker: ts.TypeChecker,
  items: ValueMap = [],
): ValueRepository => {
  const addValue: ValueAdder = (symbol, valueDeclaration) => {
    const originalSymbol = resolveOriginalSymbol(symbol, typeChecker);

    items.push({
      symbol: originalSymbol,
      valueDeclaration,
      filename: valueDeclaration.getSourceFile().fileName,
      exportedAs: originalSymbol.name,
    });
  };

  const getValue: ValueGetter = (symbol) => {
    const originalSymbol = resolveOriginalSymbol(symbol, typeChecker);

    return items.find((entry) => entry.symbol === originalSymbol) || null;
  };

  const getValues: ValueListGetter = () => items;

  return {
    addValue,
    getValue,
    getValues,
  };
};
