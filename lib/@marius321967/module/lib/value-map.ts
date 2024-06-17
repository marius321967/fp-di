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

export type ValueMapTools = {
  addValue: ValueAdder;
  getValue: ValueGetter;
  getValues: ValueListGetter;
};

export const combineValueMaps = (
  items1: ValueMap,
  items2: ValueMap,
): ValueMap =>
  items1.concat(
    items2.filter(
      (item2) => !items1.some((item1) => item1.symbol === item2.symbol),
    ),
  );

export const createValueMap = (items: ValueMap = []): ValueMapTools => {
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
