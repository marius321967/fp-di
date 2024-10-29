import ts from 'typescript';
import { Value } from '../../repositories/values';
import { Blueprints, FunctionLikeNode } from '../../types';

export type FilledFunction = {
  exportedAs: string;
  exportIdentifier: ts.Identifier;
  blueprints: Blueprints;
  functionNode: FunctionLikeNode;
  parameterValues: Value[];
};

export type FillSyntax = {
  fillExportNode: ts.VariableStatement;
  importNodes: ts.ImportDeclaration[];
};

export type FillFileSyntax = {
  fillExportNodes: ts.VariableStatement[];
  importNodes: ts.ImportDeclaration[];
};
