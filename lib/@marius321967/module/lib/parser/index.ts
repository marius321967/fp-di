import ts from 'typescript';
import { BlueprintAdder } from '../repositories/blueprints';
import { ValueAdder } from '../repositories/values';
import { valueDeclarationRegistrator } from './valueDeclarationRegistrator';

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
    valueDeclarationRegistrator(addValue, typeChecker),
  );
};

export const registerValueDeclaration = (
  node: ts.VariableDeclaration,
  addValue: ValueAdder,
  typeChecker: ts.TypeChecker,
) => valueDeclarationRegistrator(addValue, typeChecker)(node);
