import ts from 'typescript';

export type FillFileSyntax = {
  fillExportNodes: ts.VariableStatement[];
  importNodes: ts.ImportDeclaration[];
};
