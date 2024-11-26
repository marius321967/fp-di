import ts from 'typescript';
import { DependencyContext } from './structs.js';

export const registerTypeDeclaration = (
  node: ts.TypeAliasDeclaration,
  dependencyContext: DependencyContext,
): void => {
  dependencyContext.blueprints.addBlueprint(node);
};
