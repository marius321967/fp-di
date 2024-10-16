import ts from 'typescript';
import { FillFileSyntax, FillSyntax } from './structs';

export const extractImportIdentifiers = (
  importNode: ts.ImportDeclaration,
): ts.Identifier[] => {
  if (!importNode.importClause) {
    return [];
  }

  const importBindings1 = importNode.importClause.namedBindings;

  if (!importBindings1 || !ts.isNamedImports(importBindings1)) {
    return [];
  }

  return importBindings1.elements.map((element) => element.name);
};

/** @returns True if both statements import same set of values from same path */
export const importNodeMatcher =
  (importNode1: ts.ImportDeclaration) =>
  (importNode2: ts.ImportDeclaration): boolean => {
    if (
      (importNode1.moduleSpecifier as ts.StringLiteral).text !==
      (importNode1.moduleSpecifier as ts.StringLiteral).text
    ) {
      return false;
    }

    const identifiers1 = extractImportIdentifiers(importNode1);
    const identifiers2 = extractImportIdentifiers(importNode2);

    if (identifiers1.length > 1 || identifiers2.length > 1) {
      throw new Error(
        'Fill syntax import filter only handles ImportDeclaration with single named import. This is a library bug.',
      );
    }

    return identifiers1[0].text === identifiers2[0].text;
  };

export const addFillToFile = (
  fillFile: FillFileSyntax,
  fill: FillSyntax,
): FillFileSyntax => {
  const filteredImports = fill.importNodes.filter(
    (importNode) => !fillFile.importNodes.some(importNodeMatcher(importNode)),
  );

  return {
    fillExportNodes: [...fillFile.fillExportNodes, fill.fillExportNode],
    importNodes: [...fillFile.importNodes, ...filteredImports],
  };
};
