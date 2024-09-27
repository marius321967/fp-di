import ts from 'typescript';
import { BlueprintGetter } from './blueprint-map';
import { ValueGetter, ValueMapEntry } from './value-map';

export const makeDefaultImportClause = (
  identifier: ts.Identifier,
): ts.ImportClause =>
  ts.factory.createImportClause(false, identifier, undefined);

export const getArrowFunctionParamTypeSymbols = (
  arrowFunction: ts.ArrowFunction,
  typeChecker: ts.TypeChecker,
  getBlueprint: BlueprintGetter,
): ts.Symbol[] => {
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

    return blueprint.originalSymbol;
  });
};

export const getExportedFunctionParamTypes = (
  exportAssignment: ts.ExportAssignment,
  typeChecker: ts.TypeChecker,
  getBlueprint: BlueprintGetter,
): ts.Symbol[] => {
  const exportExpression = exportAssignment.expression;
  if (!ts.isArrowFunction(exportExpression)) {
    throw new Error('Entrypoint is not a function');
  }

  return getArrowFunctionParamTypeSymbols(
    exportExpression,
    typeChecker,
    getBlueprint,
  );
};

export const resolveExportedFunctionParams = (
  exportAssignment: ts.ExportAssignment,
  typeChecker: ts.TypeChecker,
  getSymbol: BlueprintGetter,
  getValue: ValueGetter,
): ValueMapEntry[] => {
  const paramTypes = getExportedFunctionParamTypes(
    exportAssignment,
    typeChecker,
    getSymbol,
  );

  return paramTypes.map((paramType) => {
    const valueDeclaration = getValue(paramType);

    if (!valueDeclaration) {
      throw new Error(`Value not found for type [${paramType.name}]`);
    }

    return valueDeclaration;
  });
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
