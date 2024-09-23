import ts from 'typescript';
import { resolveOriginalSymbol } from './symbol-tools';

export type Blueprint = {
  symbol: ts.Symbol;
  identifier: ts.Identifier;
  filename: string;
  exportedAs: string;
};

export type BlueprintMap = Blueprint[];

export type BlueprintAdder = (
  symbol: ts.Symbol,
  identifier: ts.Identifier,
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
    repo1.addBlueprint(item.symbol, item.identifier);
  });

  return repo1;
};

export const createBlueprintRepository = (
  typeChecker: ts.TypeChecker,
  items: BlueprintMap = [],
): BlueprintRepository => {
  const addBlueprint: BlueprintAdder = (symbol, identifier) => {
    items.push({
      symbol: resolveOriginalSymbol(symbol, typeChecker),
      identifier,
      filename: identifier.getSourceFile().fileName,
      exportedAs: symbol.name,
    });
  };

  const getBlueprint: BlueprintGetter = (symbol) => {
    const originalSymbol = resolveOriginalSymbol(symbol, typeChecker);

    return items.find((entry) => entry.symbol === originalSymbol) || null;
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
