import ts from 'typescript';
import { registerTypeDeclaration, registerValueDeclaration } from '.';
import { findDeclarationOfExportedItem } from './findDeclarationOfExportedItem';
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

    if (ts.isVariableDeclaration(declarationNode)) {
      registerValueDeclaration(declarationNode, values.addValue, typeChecker);
    }

    if (ts.isTypeAliasDeclaration(declarationNode)) {
      registerTypeDeclaration(
        declarationNode,
        typeChecker,
        blueprints.addBlueprint,
      );
    }
  };
