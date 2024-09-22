import path from 'path';
import ts from 'typescript';
import { SymbolGetter } from './symbol-map';
import { ValueGetter } from './value-map';

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

export const getArrowFunctionParams = (
  arrowFunction: ts.ArrowFunction,
  typeChecker: ts.TypeChecker,
  getSymbol: SymbolGetter,
): ts.Identifier[] => {
  return arrowFunction.parameters.map((parameter) => {
    const typeNode = parameter.type;

    if (!typeNode || !ts.isTypeReferenceNode(typeNode)) {
      throw new Error(
        `Unable to resolve type [${typeNode?.getText()}] for argument [${parameter.name.getText()}]`,
      );
    }

    const symbol = typeNodeToSymbol(typeNode, typeChecker);
    const typeDeclaration = getSymbol(symbol);

    if (!typeDeclaration) {
      throw new Error(
        `Type declaration not found for symbol [${symbol.escapedName}]`,
      );
    }

    return typeDeclaration;
  });
};

export const getExportedFunctionParams = (
  exportAssignment: ts.ExportAssignment,
  typeChecker: ts.TypeChecker,
  getSymbol: SymbolGetter,
): ts.Identifier[] => {
  const exportExpression = exportAssignment.expression;
  if (!ts.isArrowFunction(exportExpression)) {
    throw new Error('Entrypoint is not a function');
  }

  return getArrowFunctionParams(exportExpression, typeChecker, getSymbol);
};

export const importIdentifier = (
  identifier: ts.Identifier,
  importTo: string,
): ts.ImportDeclaration | null => {
  const importOrder = relativizeImportOrder(
    gatherIdentifierImport(identifier),
    importTo,
  );

  if (!importOrder.modulePath) {
    return null;
  }

  return ts.factory.createImportDeclaration(
    undefined,
    makeNamedImportClause(importOrder.moduleExportIdentifier),
    ts.factory.createStringLiteral(importOrder.modulePath),
  );
};

export const relativizeImportOrder = (
  importOrder: ImportOrder,
  importTo: string,
): ImportOrder => ({
  ...importOrder,
  modulePath:
    './' + path.relative(path.dirname(importTo), importOrder.modulePath),
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
  /** Full abstract path */
  modulePath: string;
  moduleExportIdentifier: ts.Identifier;
};

/**
 * Get information for importing a requested value
 * @param symbol Symbol of value
 */
const gatherValueImport = (
  symbol: ts.Symbol,
  getIdentifier: SymbolGetter,
  getValue: ValueGetter,
): ImportOrder => {
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
    modulePath: moduleFilename,
  };
};

export const gatherIdentifierImport = (
  identifier: ts.Identifier,
): ImportOrder => {
  const sourceFile = identifier.getSourceFile();
  // const modulePath = path.basename(sourceFile.fileName, '.ts');
  const modulePath = sourceFile.fileName;

  return {
    moduleExportIdentifier: identifier,
    modulePath,
  };
};
