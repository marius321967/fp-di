import ts from 'typescript';
import { resolveOriginalSymbol } from '../helpers/symbols.js';
import { ModuleMember } from '../types.js';

export type Value = TypelessValue & {
  typeSymbols: ts.Symbol[];
};

/** Value that does not bind to specific Blueprints */
export type TypelessValue = {
  member: ModuleMember<unknown>;
};

export type ValueMap = Value[];

// TODO: determine where original symbol should be resolve (inside or outside this fn), then if needed
// forbid TypeAlias flag symbols
export type ValueAdder = (
  typeSymbols: ts.Symbol[],
  member: ModuleMember<unknown>,
) => void;

/**
 * Resolve value by given type
 * @param typeSymbol Does not have to be original, can be alias
 */
export type ValueGetter = (typeSymbol: ts.Symbol) => Value | null;
export type ValueListGetter = () => ValueMap;

export type ValueRepository = {
  addValue: ValueAdder;
  getValue: ValueGetter;
  getValues: ValueListGetter;
  // for debug
  items: ValueMap;
};

export const combineValueRepositories = (
  repo1: ValueRepository,
  repo2: ValueRepository,
): ValueRepository => {
  repo2.getValues().forEach((item) => {
    repo1.addValue(item.typeSymbols, item.member);
  });

  return repo1;
};

export const createValueRepository = (
  typeChecker: ts.TypeChecker,
  items: ValueMap = [],
): ValueRepository => {
  const addValue: ValueAdder = (typeSymbols, member) =>
    items.push(buildValueMapEntry(typeSymbols, typeChecker, member));

  const getValue: ValueGetter = (typeSymbol) => {
    const originalSymbol = resolveOriginalSymbol(typeSymbol, typeChecker);

    return (
      items.find((entry) => entry.typeSymbols.includes(originalSymbol)) || null
    );
  };

  const getValues: ValueListGetter = () => items;

  return {
    addValue,
    getValue,
    getValues,
    // for debug
    items,
  };
};

const buildValueMapEntry = (
  typeSymbols: ts.Symbol[],
  typeChecker: ts.TypeChecker,
  member: ModuleMember<unknown>,
): Value => ({
  typeSymbols: typeSymbols.map((typeSymbol) =>
    resolveOriginalSymbol(typeSymbol, typeChecker),
  ),
  member,
});
