import ts from 'typescript';
import { Value } from '../../repositories/values';
import { FunctionLikeNode } from '../../types';

export type FilledFunction = {
  exportedAs: string;
  exportIdentifier: ts.Identifier;
  functionNode: FunctionLikeNode;
  parameterValues: Value[];
};

export type FillSyntax = {
  functionExportNode: ts.VariableStatement;
  importNodes: ts.ImportDeclaration[];
};
