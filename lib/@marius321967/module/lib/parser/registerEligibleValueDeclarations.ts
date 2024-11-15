import ts from 'typescript';
import { ValueAdder } from '../repositories/values';
import { isEligibleValue } from './isEligibleValue';
import { valueDeclarationRegistrator } from './valueDeclarationRegistrator';

export const registerEligibleValueDeclarations = (
  node: ts.VariableStatement,
  typeChecker: ts.TypeChecker,
  addValue: ValueAdder,
): void => {
  node.declarationList.declarations
    .filter(isEligibleValue)
    .forEach(valueDeclarationRegistrator(addValue, typeChecker));
};
