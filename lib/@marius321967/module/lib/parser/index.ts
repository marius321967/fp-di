import ts from 'typescript';
import { BlueprintAdder } from '../repositories/blueprints';
import { ValueAdder } from '../repositories/values';

export const registerTypeDeclaration = (
  node: ts.TypeAliasDeclaration,
  typeChecker: ts.TypeChecker,
  addBlueprint: BlueprintAdder,
): void => {
  const localSymbol = typeChecker.getSymbolAtLocation(node.name);

  if (!localSymbol) {
    throw new Error('symbol not found');
  }

  addBlueprint(localSymbol, node.name.getText(), node.getSourceFile().fileName);
};

export const registerValueDeclarations = (
  node: ts.VariableStatement,
  typeChecker: ts.TypeChecker,
  addValue: ValueAdder,
): void => {
  node.declarationList.declarations.forEach(
    registerValueDeclaration(addValue, typeChecker),
  );
};

export const registerValueDeclaration =
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
