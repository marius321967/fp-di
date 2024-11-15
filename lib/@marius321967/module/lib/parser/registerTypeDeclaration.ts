import ts from 'typescript';
import { BlueprintAdder } from '../repositories/blueprints';

export const registerTypeDeclaration = (
  node: ts.TypeAliasDeclaration,
  addBlueprint: BlueprintAdder,
): void => {
  addBlueprint(node);
};
