import ts from 'typescript';
import { ValueAdder } from '../repositories/values';

export const valueDeclarationRegistrator =
  (addValue: ValueAdder, typeChecker: ts.TypeChecker) =>
  (node: ts.VariableDeclaration): void => {
    if (node.type === undefined) return;

    const variableBroadType = node.type;

    // FUTURE: handle union types as well
    if (!ts.isTypeReferenceNode(variableBroadType)) return;

    const localIdentifier = variableBroadType.typeName;
    const typeSymbol = typeChecker.getSymbolAtLocation(localIdentifier);

    if (!typeSymbol)
      throw new Error(`Type symbol [${localIdentifier.getText()}] not found`);

    addValue(typeSymbol, node);
  };
