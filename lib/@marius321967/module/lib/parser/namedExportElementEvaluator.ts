import ts from 'typescript';
import { exportedAsNamed } from '../helpers/structs';
import { findDeclarationOfExportedItem } from './findDeclarationOfExportedItem';
import { InterestProcessorContext } from './interest';
import { isEligibleValue } from './isEligibleValue';
import { registerTypeDeclaration } from './registerTypeDeclaration';
import { registerValueDeclaration } from './registerValueDeclaration';
import { DependencyContext } from './structs';

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
