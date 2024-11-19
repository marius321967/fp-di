import ts from 'typescript';
import { exportedAsNamed } from '../helpers/structs';
import { ValueAdder } from '../repositories/values';
import { isEligibleValue } from './isEligibleValue';
import { registerValueDeclaration } from './registerValueDeclaration';

export const registerEligibleValueDeclarations = (
  node: ts.VariableStatement,
  typeChecker: ts.TypeChecker,
  addValue: ValueAdder,
): void => {
  node.declarationList.declarations.filter(isEligibleValue).forEach((node) => {
    registerValueDeclaration(
      addValue,
      typeChecker,
      node,
      exportedAsNamed(node.name.getText()),
    );
  });
};
