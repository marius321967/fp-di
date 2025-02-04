import ts from 'typescript';
import { FunctionFill } from '../../parser/fills/structs.js';
import { createFillableCallExpression } from '../ts-node-factory/expression.factory.js';
import { createFillableIdentifier } from './createFillableIdentifier.js';
import { generateFillImports } from './generateFillImports.js';

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
