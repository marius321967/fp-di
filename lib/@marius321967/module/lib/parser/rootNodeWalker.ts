import ts from 'typescript';
import {
  isExportedTypeDeclaration,
  isExportedVariableDeclaration,
} from '../helpers';
import { registerTypeDeclaration, registerValueDeclarations } from './index';
import { ParserSet } from './structs';

export const rooNodeWalker =
  (
    program: ts.Program,
    {
      blueprints,
      values,
    }: ParserSet,
  ) =>
  (node: ts.Node): void => {
    if (isExportedTypeDeclaration(node)) {
      registerTypeDeclaration(
        node,
        program.getTypeChecker(),
        blueprints.addBlueprint,
      );
    }

    if (isExportedVariableDeclaration(node)) {
      registerValueDeclarations(
        node,
        program.getTypeChecker(),
        values.addValue,
      );
    }
  };
