import ts from 'typescript';
import { ValueAdder } from '../repositories/values';

export const valueDeclarationRegistrator =
  (addValue: ValueAdder, typeChecker: ts.TypeChecker) =>
  (node: ts.VariableDeclaration & { type: ts.TypeReferenceNode }): void => {
    const localIdentifier = node.type.typeName;
    const typeSymbol = typeChecker.getSymbolAtLocation(localIdentifier);

    if (!typeSymbol) {
      throw new Error(`Type symbol [${localIdentifier.getText()}] not found`);
    }

    addValue(typeSymbol, node);
  };
