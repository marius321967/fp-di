import ts from 'typescript';
import {
  isExportedVariableDeclaration,
  isNamedExportDeclaration,
} from '../node.type-guards';
import {
  registerEligibleValueDeclarations,
  registerTypeDeclaration,
} from './index';
import { isEligibleBlueprint } from './isEligibleBlueprint';
import { namedExportElementEvaluator } from './namedExportElementEvaluator';
import { ParserSet } from './structs';

export const rootNodeWalker =
  (program: ts.Program, { blueprints, values }: ParserSet) =>
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
    // TODO: handle default exports
  };
