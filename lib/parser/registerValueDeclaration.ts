import ts from 'typescript';
import { getSymbolAtLocation } from '../helpers/symbols.js';
import { ValueAdder } from '../repositories/values.js';
import { ExportAs } from '../types.js';
import { toOfferedTypes } from './toOfferedTypes.js';

export const registerValueDeclaration = (
  addValue: ValueAdder,
  typeChecker: ts.TypeChecker,
  node: ts.VariableDeclaration & {
    type: ts.TypeReferenceNode | ts.IntersectionTypeNode;
  },
  exportedAs: ExportAs,
): void => {
  const localTypeSymbols = toOfferedTypes(node.type).map((typeReference) =>
    getSymbolAtLocation(typeReference.typeName, typeChecker),
  );

  addValue(localTypeSymbols, {
    expression: node.initializer,
    filePath: node.getSourceFile().fileName,
    exportedAs,
  });
};
