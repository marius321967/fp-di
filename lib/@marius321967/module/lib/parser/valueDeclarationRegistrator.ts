import ts from 'typescript';
import { getSymbolAtLocation } from '../helpers/symbols';
import { ValueAdder } from '../repositories/values';
import { variableDeclarationToExportAs } from './fills/tryExtractEligibleFillable';

export const valueDeclarationRegistrator =
  (addValue: ValueAdder, typeChecker: ts.TypeChecker) =>
  (node: ts.VariableDeclaration & { type: ts.TypeReferenceNode }): void => {
    const localIdentifier = node.type.typeName;
    const typeSymbol = getSymbolAtLocation(localIdentifier, typeChecker);

    addValue(typeSymbol, {
      expression: node.initializer,
      filePath: node.getSourceFile().fileName,
      exportedAs: variableDeclarationToExportAs(node),
    });
  };
