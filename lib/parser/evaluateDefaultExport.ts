import ts from 'typescript';
import { exportedAsDefault } from '../helpers/structs.js';
import { InterestProcessorContext } from './interest.js';
import { isEligibleBlueprint } from './isEligibleBlueprint.js';
import { isEligibleValue } from './isEligibleValue.js';
import { registerTypeDeclaration } from './registerTypeDeclaration.js';
import { registerValueDeclaration } from './registerValueDeclaration.js';

// TODO reuse common functionality with namedExportElementEvaluator()
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
