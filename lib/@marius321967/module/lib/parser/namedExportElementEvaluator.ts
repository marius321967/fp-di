import ts from 'typescript';
import { registerValueDeclaration } from '.';
import { resolveOriginalSymbol } from '../symbol-tools';
import { ParserSet } from './structs';

export const namedExportElementEvaluator =
  (program: ts.Program, { blueprints, values }: ParserSet) =>
  (node: ts.ExportSpecifier): void => {
    const symbol = program.getTypeChecker().getSymbolAtLocation(node.name);

    if (!symbol) {
      throw new Error('No symbol found');
    }

    const originalSymbol = resolveOriginalSymbol(
      symbol,
      program.getTypeChecker(),
    );

    if (!originalSymbol.declarations) {
      throw new Error(
        `No declarations found for symbol [${originalSymbol.name}]`,
      );
    }

    const declarationNode = originalSymbol.declarations[0];

    if (!declarationNode) {
      throw new Error(
        `No declaration found for original symbol [${originalSymbol.name}]`,
      );
    }

    const isDeclaredInThisFile =
      originalSymbol.declarations[0].getSourceFile() === node.getSourceFile();

    if (!isDeclaredInThisFile || !ts.isVariableDeclaration(declarationNode)) {
      return;
    }

    registerValueDeclaration(
      values.addValue,
      program.getTypeChecker(),
    )(declarationNode);

    // TODO handle type exports
  };
