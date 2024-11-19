import ts from 'typescript';
import { exportedAsDefault } from '../helpers/structs';
import { InterestProcessorContext } from './interest';
import { isEligibleBlueprint } from './isEligibleBlueprint';
import { isEligibleValue } from './isEligibleValue';
import { registerTypeDeclaration } from './registerTypeDeclaration';
import { registerValueDeclaration } from './registerValueDeclaration';

export const evaluateDefaultExport = (
  exportNode: ts.ExportAssignment,
  { blueprints, values, typeChecker }: InterestProcessorContext,
): void => {
  const expression = exportNode.expression;
  if (ts.isIdentifier(expression)) {
    const sym = typeChecker.getSymbolAtLocation(expression);
    if (sym && sym.declarations && sym.declarations.length > 0) {
      if (sym.declarations.length > 1) {
        throw new Error(
          `Unable to handle multiple declarations for symbol [${sym.escapedName}] within same module.`,
        );
      }

      const declaration = sym.declarations[0];
      if (isEligibleBlueprint(declaration)) {
        registerTypeDeclaration(declaration, { blueprints, values });
      }

      if (
        ts.isVariableDeclaration(declaration) &&
        isEligibleValue(declaration)
      ) {
        registerValueDeclaration(
          values.addValue,
          typeChecker,
          declaration,
          exportedAsDefault(),
        );
      }
    }
  }
};
