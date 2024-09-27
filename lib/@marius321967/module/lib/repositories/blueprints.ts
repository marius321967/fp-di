import ts from 'typescript';
import { resolveOriginalSymbol } from '../symbol-tools';

export type Blueprint = {
  originalSymbol: ts.Symbol;
  exportedAs: string;
  /** TODO specify whether abstract path, relative from project root, etc. */
  filename: string;
};

export type BlueprintMap = Blueprint[];

export type BlueprintAdder = (
  symbol: ts.Symbol,
  exportedAs: string,
  filename: string,
) => void;

export type BlueprintGetter = (symbol: ts.Symbol) => Blueprint | null;

export type BlueprintListGetter = () => BlueprintMap;

export type BlueprintRepository = {
  addBlueprint: BlueprintAdder;
  getBlueprint: BlueprintGetter;
  getBlueprints: BlueprintListGetter;
  // for debug
  items: BlueprintMap;
};

// TODO: remove duplicates (not likely to occur but still semantically needed)
export const combineBlueprintRepositories = (
  repo1: BlueprintRepository,
  repo2: BlueprintRepository,
): BlueprintRepository => {
  repo2.items.forEach((item) => {
    repo1.addBlueprint(item.originalSymbol, item.exportedAs, item.filename);
  });

  return repo1;
};

export const createBlueprintRepository = (
  typeChecker: ts.TypeChecker,
  items: BlueprintMap = [],
): BlueprintRepository => {
  const addBlueprint: BlueprintAdder = (symbol, exportedAs, filename) => {
    items.push({
      originalSymbol: resolveOriginalSymbol(symbol, typeChecker),
      exportedAs,
      filename,
    });
  };

  const getBlueprint: BlueprintGetter = (symbol) => {
    const originalSymbol = resolveOriginalSymbol(symbol, typeChecker);

    return (
      items.find((entry) => entry.originalSymbol === originalSymbol) || null
    );
  };

  const getBlueprints: BlueprintListGetter = () => items;

  return {
    addBlueprint,
    getBlueprint,
    getBlueprints,
    // for debug
    items,
  };
};
