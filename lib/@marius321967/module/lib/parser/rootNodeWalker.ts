import ts from 'typescript';
import {
  isExportedTypeDeclaration,
  isExportedVariableDeclaration,
  isNamedExportDeclaration,
} from '../node.type-guards';
import { registerTypeDeclaration, registerValueDeclarations } from './index';
import { namedExportElementEvaluator } from './namedExportElementEvaluator';
import { ParserSet } from './structs';

export const rootNodeWalker =
  (program: ts.Program, { blueprints, values }: ParserSet) =>
  (node: ts.Node): void => {
    // export type Foo = string | number;
    if (isExportedTypeDeclaration(node)) {
      registerTypeDeclaration(
        node,
        program.getTypeChecker(),
        blueprints.addBlueprint,
      );
    }

    // export const x: Foo = 'foo';
    if (isExportedVariableDeclaration(node)) {
      registerValueDeclarations(
        node,
        program.getTypeChecker(),
        values.addValue,
      );
    }

    // export {x, y};
    if (isNamedExportDeclaration(node)) {
      node.exportClause.elements.forEach(
        namedExportElementEvaluator(program.getTypeChecker(), {
          blueprints,
          values,
        }),
      );
    }
  };
