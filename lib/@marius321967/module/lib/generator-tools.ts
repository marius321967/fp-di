import ts from 'typescript';
import { BlueprintGetter } from './blueprint-map';
import { ImportOrder, relativizeImportOrder } from './imports';
import { resolveOriginalSymbol } from './symbol-tools';
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

export const getArrowFunctionParamTypes = (
  arrowFunction: ts.ArrowFunction,
  typeChecker: ts.TypeChecker,
  getBlueprint: BlueprintGetter,
): ts.Identifier[] => {
  return arrowFunction.parameters.map((parameter) => {
    const typeNode = parameter.type;

    if (!typeNode || !ts.isTypeReferenceNode(typeNode)) {
      throw new Error(
        `Unable to resolve type [${typeNode?.getText()}] for argument [${parameter.name.getText()}]`,
      );
    }

    const symbol = typeNodeToSymbol(typeNode, typeChecker);
    const blueprint = getBlueprint(symbol);

    if (!blueprint) {
      throw new Error(
        `Type declaration not found for symbol [${symbol.escapedName}]`,
      );
    }

    return blueprint.identifier;
  });
};

export const getExportedFunctionParamTypes = (
  exportAssignment: ts.ExportAssignment,
  typeChecker: ts.TypeChecker,
  getSymbol: BlueprintGetter,
): ts.Identifier[] => {
  const exportExpression = exportAssignment.expression;
  if (!ts.isArrowFunction(exportExpression)) {
    throw new Error('Entrypoint is not a function');
  }

  return getArrowFunctionParamTypes(exportExpression, typeChecker, getSymbol);
};

export const resolveExportedFunctionParams = (
  exportAssignment: ts.ExportAssignment,
  typeChecker: ts.TypeChecker,
  getSymbol: BlueprintGetter,
  getValue: ValueGetter,
): ts.Identifier[] => {
  const paramTypes = getExportedFunctionParamTypes(
    exportAssignment,
    typeChecker,
    getSymbol,
  );

  return paramTypes.map((paramType) => {
    const typeSymbol = typeChecker.getSymbolAtLocation(paramType);

    if (!typeSymbol) {
      throw new Error(
        `Unable to resolve symbol for type [${paramType.getText()}]`,
      );
    }

    const valueDeclaration = getValue(
      resolveOriginalSymbol(typeSymbol, typeChecker),
    );

    if (!valueDeclaration) {
      throw new Error(`Value not found for type [${paramType.getText()}]`);
    }

    const valueIdentifier = valueDeclaration.name;

    if (!ts.isIdentifier(valueIdentifier)) {
      throw new Error(
        `Value declaration name [${valueDeclaration.getText()}] is not an identifier`,
      );
    }

    return valueIdentifier;
  });
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
