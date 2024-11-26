import ts from 'typescript';
import { exportedAsNamed } from '../helpers/structs.js';
import { findDeclarationOfExportedItem } from './findDeclarationOfExportedItem.js';
import { InterestProcessorContext } from './interest.js';
import { isEligibleValue } from './isEligibleValue.js';
import { registerTypeDeclaration } from './registerTypeDeclaration.js';
import { registerValueDeclaration } from './registerValueDeclaration.js';
import { DependencyContext } from './structs.js';

export const processNamedExportDeclaration = (
  node: ts.ExportDeclaration & {
    exportClause: ts.NamedExports;
  },
  context: InterestProcessorContext,
) => {
  node.exportClause.elements.forEach(
    namedExportElementEvaluator(context.typeChecker, context),
  );
};

export const namedExportElementEvaluator =
  (typeChecker: ts.TypeChecker, { blueprints, values }: DependencyContext) =>
  (exportNode: ts.ExportSpecifier): void => {
    const declarationNode = findDeclarationOfExportedItem(
      exportNode,
      typeChecker,
    );

    const isDeclaredInThisFile =
      declarationNode.getSourceFile() === exportNode.getSourceFile();

    if (!isDeclaredInThisFile) {
      return;
    }

    if (
      ts.isVariableDeclaration(declarationNode) &&
      isEligibleValue(declarationNode)
    ) {
      registerValueDeclaration(
        values.addValue,
        typeChecker,
        declarationNode,
        exportedAsNamed(exportNode.name.getText()),
      );
    }

    if (ts.isTypeAliasDeclaration(declarationNode)) {
      registerTypeDeclaration(declarationNode, { blueprints, values });
    }
  };
