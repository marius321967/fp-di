import ts from 'typescript';
import { resolveOriginalSymbol } from '../helpers/symbols';
import { ModuleMember } from '../types';

export type Value = TypelessValue & {
  typeSymbol: ts.Symbol;
};

/** Value that does not bind to a specific Blueprint */
export type TypelessValue = {
  member: ModuleMember<unknown>;
};

export type ValueMap = Value[];

// TODO: determine where original symbol should be resolve (inside or outside this fn), then if needed
// forbid TypeAlias flag symbols
export type ValueAdder = (
  typeSymbol: ts.Symbol,
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
    repo1.addValue(item.typeSymbol, item.member);
  });

  return repo1;
};

export const createValueRepository = (
  typeChecker: ts.TypeChecker,
  items: ValueMap = [],
): ValueRepository => {
  const addValue: ValueAdder = (typeSymbol, member) =>
    items.push(buildValueMapEntry(typeSymbol, typeChecker, member));

  const getValue: ValueGetter = (typeSymbol) => {
    const originalSymbol = resolveOriginalSymbol(typeSymbol, typeChecker);

    return items.find((entry) => entry.typeSymbol === originalSymbol) || null;
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
  typeSymbol: ts.Symbol,
  typeChecker: ts.TypeChecker,
  member: ModuleMember<unknown>,
): Value => {
  const originalTypeSymbol = resolveOriginalSymbol(typeSymbol, typeChecker);

  return {
    typeSymbol: originalTypeSymbol,
    member,
  };
};
