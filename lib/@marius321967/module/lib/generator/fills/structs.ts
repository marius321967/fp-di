import ts from 'typescript';
import { Value } from '../../repositories/values';

export type FilledFunction = {
  functionNode: ts.ArrowFunction;
  parameterValues: Value[];
};

export type FillSyntax = {
  functionExportNode: ts.VariableStatement;
  importNodes: ts.ImportDeclaration[];
};
