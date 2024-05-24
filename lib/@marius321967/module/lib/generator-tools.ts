import path from 'path';
import ts from 'typescript';
import { getIdentifier } from './symbol-map';
import { getValue } from './value-map';

export const makeDefaultImportClause = (
  identifier: ts.Identifier,
): ts.ImportClause =>
  ts.factory.createImportClause(false, identifier, undefined);

export const makeNamedImportClause = (
  identifier: ts.Identifier,
): ts.ImportClause =>
  ts.factory.createImportClause(
    false,
    undefined,
    ts.factory.createNamedImports([
      ts.factory.createImportSpecifier(false, undefined, identifier),
    ]),
  );

export const getExportedFunctionParams = (
  exportAssignment: ts.ExportAssignment,
  typeChecker: ts.TypeChecker,
): ts.Identifier[] => {
  const exportExpression = exportAssignment.expression;
  if (!ts.isArrowFunction(exportExpression)) {
    throw new Error('Entrypoint is not a function');
  }

  const types = exportExpression.parameters.map((parameter) => {
    const typeNode = parameter.type;
    if (!typeNode || !ts.isTypeReferenceNode(typeNode)) {
      throw new Error(
        `Unable to resolve type [${typeNode?.getText()}] for argument [${parameter.name.getText()}]`,
      );
    }

    const symbol = typeNodeToSymbol(typeNode, typeChecker);
    const importOrder = gatherValueImport(symbol);

    console.log(
      `we should import ${importOrder.moduleExportIdentifier.getText()} from ${importOrder.moduleFilename}`,
    );

    return importOrder.moduleExportIdentifier;
  });

  return types;
};

export const importIdentifier = (
  identifier: ts.Identifier,
  importTo: string,
): ts.ImportDeclaration | null => {
  const importOrder = relativizeImportOrder(
    gatherIdentifierImport(identifier),
    importTo,
  );

  if (!importOrder.moduleFilename) {
    return null;
  }

  return ts.factory.createImportDeclaration(
    undefined,
    makeNamedImportClause(importOrder.moduleExportIdentifier),
    ts.factory.createStringLiteral(importOrder.moduleFilename),
  );
};

export const relativizeImportOrder = (
  importOrder: ImportOrder,
  importTo: string,
): ImportOrder => ({
  ...importOrder,
  moduleFilename:
    './' + path.relative(path.dirname(importTo), importOrder.moduleFilename),
});

const typeNodeToSymbol = (
  typeNode: ts.TypeNode,
  context: ts.TypeChecker,
): ts.Symbol => {
  const localIdentifier = typeNode.getChildAt(0);

  if (!ts.isIdentifier(localIdentifier)) {
    throw new Error(
      `TypeNode [${typeNode.getText()}] does not contain identifier as first child`,
    );
  }

  const symbol = context.getSymbolAtLocation(localIdentifier);

  if (!symbol) {
    throw new Error(
      `Symbol not found by TypeChecker for identifier [${localIdentifier.getText()}]`,
    );
  }

  return symbol;
};

export type ImportOrder = {
  moduleFilename: string;
  moduleExportIdentifier: ts.Identifier;
};

/**
 * Get information for importing a requested value
 * @param symbol Symbol of value
 */
const gatherValueImport = (symbol: ts.Symbol): ImportOrder => {
  const identifier = getIdentifier(symbol);

  if (!identifier) {
    throw new Error(
      `Identifier not found in registry for symbol [${symbol.escapedName}]`,
    );
  }

  const value = getValue(symbol);

  if (!value) {
    throw new Error(
      `Value not found in registry for symbol [${symbol.escapedName}]`,
    );
  }

  const sourceFile = value.getSourceFile();
  const moduleFilename = sourceFile.fileName;

  const valueIdentifier = value.name;

  if (!ts.isIdentifier(valueIdentifier)) {
    // TODO future: support values exported like 'export { foo } = x'
    throw new Error(
      `Export binding declarations are not supported [${valueIdentifier.getText()}]`,
    );
  }

  return {
    moduleExportIdentifier: valueIdentifier,
    moduleFilename,
  };
};

export const gatherIdentifierImport = (
  identifier: ts.Identifier,
): ImportOrder => {
  const sourceFile = identifier.getSourceFile();
  const moduleFilename = path.basename(sourceFile.fileName, '.ts');

  return {
    moduleExportIdentifier: identifier,
    moduleFilename,
  };
};
