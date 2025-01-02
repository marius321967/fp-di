import ts from 'typescript';
import { exportedAsNamed } from '../helpers/structs.js';
import { InterestProcessorContext } from './interest.js';
import { isEligibleValue } from './isEligibleValue.js';
import { registerValueDeclaration } from './registerValueDeclaration.js';

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
