import ts from 'typescript';
import { ValueAdder } from '../repositories/values';
import { assertIsPresent } from '../tools';

export const valueDeclarationRegistrator =
  (addValue: ValueAdder, typeChecker: ts.TypeChecker) =>
  (node: ts.VariableDeclaration & { type: ts.TypeReferenceNode }): void => {
    const localIdentifier = node.type.typeName;
    const typeSymbol = typeChecker.getSymbolAtLocation(localIdentifier);

    assertIsPresent(
      typeSymbol,
      `Type symbol [${localIdentifier.getText()}] not found`,
    );

    addValue(typeSymbol, node);
  };
