import ts from 'typescript';
import { resolveOriginalSymbol } from '../symbol';

export type ValueMapEntry = {
  typeSymbol: ts.Symbol;
  valueDeclaration: ts.VariableDeclaration;
  exportIdentifier: ts.Identifier;
  exportedAs: string;
  filename: string;
};

export type ValueMap = ValueMapEntry[];

export type ValueAdder = (
  typeSymbol: ts.Symbol,
  valueDeclaration: ts.VariableDeclaration,
) => void;

/**
 * Resolve value by given type
 * @param typeSymbol Does not have to be original, can be alias
 */
export type ValueGetter = (typeSymbol: ts.Symbol) => ValueMapEntry | null;
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
    repo1.addValue(item.typeSymbol, item.valueDeclaration);
  });

  return repo1;
};

export const createValueRepository = (
  typeChecker: ts.TypeChecker,
  items: ValueMap = [],
): ValueRepository => {
  const addValue: ValueAdder = (typeSymbol, valueDeclaration) =>
    items.push(buildValueMapEntry(typeSymbol, typeChecker, valueDeclaration));

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

export const buildValueMapEntry = (
  typeSymbol: ts.Symbol,
  typeChecker: ts.TypeChecker,
  valueDeclaration: ts.VariableDeclaration,
): ValueMapEntry => {
  const originalTypeSymbol = resolveOriginalSymbol(typeSymbol, typeChecker);
  const exportIdentifier = valueDeclaration.name;

  if (!ts.isIdentifier(exportIdentifier)) {
    throw new Error(
      `Binding pattern value declarations not yet supported (eg., [${exportIdentifier.getText()}])`,
    );
  }

  return {
    typeSymbol: originalTypeSymbol,
    valueDeclaration,
    filename: valueDeclaration.getSourceFile().fileName,
    exportedAs: exportIdentifier.getText(),
    exportIdentifier,
  };
};
