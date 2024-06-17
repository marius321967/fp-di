import ts from 'typescript';

export type ValueMapEntry = {
  symbol: ts.Symbol;
  filename: string;
  valueDeclaration: ts.VariableDeclaration;
};

export type ValueMap = ValueMapEntry[];

export type ValueAdder = (
  symbol: ts.Symbol,
  valueDeclaration: ts.VariableDeclaration,
) => ValueMap;
export type ValueGetter = (symbol: ts.Symbol) => ts.VariableDeclaration | null;
export type ValueListGetter = () => ValueMap;

export type ValueRepository = {
  addValue: ValueAdder;
  getValue: ValueGetter;
  getValues: ValueListGetter;
};

export const combineValueRepositories = (
  repo1: ValueRepository,
  repo2: ValueRepository,
): ValueRepository =>
  createValueRepository([...repo1.getValues(), ...repo2.getValues()]);

export const createValueRepository = (
  items: ValueMap = [],
): ValueRepository => {
  const addValue: ValueAdder = (symbol, valueDeclaration) =>
    (items = [
      ...items,
      {
        symbol,
        filename: valueDeclaration.getSourceFile().fileName,
        valueDeclaration,
      },
    ]);

  const getValue: ValueGetter = (symbol) =>
    items.find((entry) => entry.symbol === symbol)?.valueDeclaration || null;

  const getValues: ValueListGetter = () => items;

  return {
    addValue,
    getValue,
    getValues,
  };
};
