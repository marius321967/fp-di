import ts from 'typescript';
import { FunctionFill } from '../../parser/fills/structs';
import { createFillableCallExpression } from '../node-builders';
import { createFillableIdentifier } from './createFillableIdentifier';
import { generateFillImports } from './generateFillImports';

type StartSyntax = {
  importNodes: ts.ImportDeclaration[];
  entrypointCallNode: ts.ExpressionStatement;
};

export const generateStartSyntax = (
  entrypointFill: FunctionFill,
  startPath: string,
): StartSyntax => {
  const startCall = createFillableCallExpression(
    createFillableIdentifier(entrypointFill.target),
    entrypointFill.values,
  );

  return {
    importNodes: generateFillImports(entrypointFill, startPath),
    entrypointCallNode: ts.factory.createExpressionStatement(startCall),
  };
};
