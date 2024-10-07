import ts, { TypeReferenceNode } from 'typescript';
import { BlueprintAdder } from '../repositories/blueprints';
import { ValueAdder } from '../repositories/values';
import { isEligibleValue } from './isEligibleValue';
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

export const registerEligibleValueDeclarations = (
  node: ts.VariableStatement,
  typeChecker: ts.TypeChecker,
  addValue: ValueAdder,
): void => {
  node.declarationList.declarations
    .filter(isEligibleValue)
    .forEach(valueDeclarationRegistrator(addValue, typeChecker));
};

export const registerValueDeclaration = (
  node: ts.VariableDeclaration & { type: TypeReferenceNode },
  addValue: ValueAdder,
  typeChecker: ts.TypeChecker,
): void => valueDeclarationRegistrator(addValue, typeChecker)(node);
