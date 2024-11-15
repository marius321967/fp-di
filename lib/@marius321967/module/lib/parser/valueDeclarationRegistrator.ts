import ts from 'typescript';
import { getSymbolAtLocation } from '../helpers/symbols';
import { ValueAdder } from '../repositories/values';
import { variableDeclarationToExportAs } from './fills/tryExtractFillable';
import { toOfferedTypes } from './toOfferedTypes';

export const valueDeclarationRegistrator =
  (addValue: ValueAdder, typeChecker: ts.TypeChecker) =>
  (
    node: ts.VariableDeclaration & {
      type: ts.TypeReferenceNode | ts.IntersectionTypeNode;
    },
  ): void => {
    const localTypeSymbols = toOfferedTypes(node.type).map((typeReference) =>
      getSymbolAtLocation(typeReference.typeName, typeChecker),
    );

    addValue(localTypeSymbols, {
      expression: node.initializer,
      filePath: node.getSourceFile().fileName,
      exportedAs: variableDeclarationToExportAs(node),
    });
  };
