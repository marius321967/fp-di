import ts from 'typescript';
import {
  isDefaultExportDeclaration,
  isExportedVariableDeclaration,
  isNamedExportDeclaration,
} from '../node.type-guards';
import { evaluateDefaultExport } from './evaluateDefaultExport';
import { isEligibleBlueprint } from './isEligibleBlueprint';
import { processNamedExportDeclaration } from './namedExportElementEvaluator';
import { registerEligibleValueDeclarations } from './registerEligibleValueDeclarations';
import { registerTypeDeclaration } from './registerTypeDeclaration';
import { DependencyContext } from './structs';

/** @deprecated In favor of ROOT_NODE_INTERESTS */
export const rootNodeWalker =
  (program: ts.Program, { blueprints, values }: DependencyContext) =>
  (node: ts.Node): void => {
    // export type Foo = string | number;
    if (isEligibleBlueprint(node)) {
      registerTypeDeclaration(node, { blueprints, values });
    }

    // export const x: Foo = 'foo';
    if (isExportedVariableDeclaration(node)) {
      registerEligibleValueDeclarations(node, {
        typeChecker: program.getTypeChecker(),
        blueprints,
        values,
      });
    }

    // export {x, y};
    if (isNamedExportDeclaration(node)) {
      processNamedExportDeclaration(node, {
        blueprints,
        values,
        typeChecker: program.getTypeChecker(),
      });
    }

    // export default x;
    if (isDefaultExportDeclaration(node)) {
      evaluateDefaultExport(node, {
        blueprints,
        values,
        typeChecker: program.getTypeChecker(),
      });
    }
  };
