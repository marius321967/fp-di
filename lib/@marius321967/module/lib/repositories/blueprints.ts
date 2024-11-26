import ts from 'typescript';
import {
  getSymbolAtLocation,
  resolveOriginalSymbol,
} from '../helpers/symbols.js';

export type Blueprint = {
  originalSymbol: ts.Symbol;
  exportIdentifier: ts.Identifier;
  exportedAs: string;
  /** TODO specify whether abstract path, relative from project root, etc. */
  filename: string;
};

export type BlueprintMap = Blueprint[];

export type BlueprintAdder = (node: ts.TypeAliasDeclaration) => void;

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
    repo1.items.push(item); // non-final solution - items not supposed to be accessible
  });

  return repo1;
};

export const createBlueprintRepository = (
  typeChecker: ts.TypeChecker,
  items: BlueprintMap = [],
): BlueprintRepository => {
  const addBlueprint: BlueprintAdder = (symbol) => {
    items.push(buildBlueprint(symbol, typeChecker));
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

const buildBlueprint = (
  node: ts.TypeAliasDeclaration,
  typeChecker: ts.TypeChecker,
): Blueprint => {
  const symbol = getSymbolAtLocation(node.name, typeChecker);
  const originalSymbol = resolveOriginalSymbol(symbol, typeChecker);
  const exportIdentifier = node.name;
  const exportedAs = node.name.text;

  return {
    originalSymbol,
    exportIdentifier,
    exportedAs,
    filename: node.getSourceFile().fileName,
  };
};
