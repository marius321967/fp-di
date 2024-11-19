import ts from 'typescript';
import { exportedAsNamed } from '../helpers/structs';
import { InterestProcessorContext } from './interest';
import { isEligibleValue } from './isEligibleValue';
import { registerValueDeclaration } from './registerValueDeclaration';

export const registerEligibleValueDeclarations = (
  node: ts.VariableStatement,
  { typeChecker, values }: InterestProcessorContext,
): void => {
  node.declarationList.declarations.filter(isEligibleValue).forEach((node) => {
    registerValueDeclaration(
      values.addValue,
      typeChecker,
      node,
      exportedAsNamed(node.name.getText()),
    );
  });
};
