import ts from 'typescript';
import { registerTypeDeclaration, registerValueDeclaration } from '.';
import { findDeclarationOfExportedItem } from './findDeclarationOfExportedItem';
import { isEligibleValue } from './isEligibleValue';
import { ParserSet } from './structs';

export const namedExportElementEvaluator =
  (typeChecker: ts.TypeChecker, { blueprints, values }: ParserSet) =>
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
      registerValueDeclaration(declarationNode, typeChecker, values.addValue);
    }

    if (ts.isTypeAliasDeclaration(declarationNode)) {
      registerTypeDeclaration(
        declarationNode,
        typeChecker,
        blueprints.addBlueprint,
      );
    }
  };
