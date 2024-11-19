import ts from 'typescript';
import {
  isDefaultExportDeclaration,
  isExportedVariableDeclaration,
  isNamedExportDeclaration,
} from '../node.type-guards';
import { evaluateDefaultExport } from './evaluateDefaultExport';
import { isEligibleBlueprint } from './isEligibleBlueprint';
import { namedExportElementEvaluator } from './namedExportElementEvaluator';
import { registerEligibleValueDeclarations } from './registerEligibleValueDeclarations';
import { registerTypeDeclaration } from './registerTypeDeclaration';
import { DependencyContext } from './structs';

export const rootNodeWalker =
  (program: ts.Program, { blueprints, values }: DependencyContext) =>
  (node: ts.Node): void => {
    // export type Foo = string | number;
    if (isEligibleBlueprint(node)) {
      registerTypeDeclaration(node, blueprints.addBlueprint);
    }

    // export const x: Foo = 'foo';
    if (isExportedVariableDeclaration(node)) {
      registerEligibleValueDeclarations(
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

    // export default x;
    if (isDefaultExportDeclaration(node)) {
      evaluateDefaultExport(node, program.getTypeChecker(), {
        blueprints,
        values,
      });
    }
  };
