import ts from 'typescript';

export type EntrypointSyntax = ModularSyntax & {
  /** Has ExpressionNode inside */
  expressionNode: ts.ExpressionStatement;
};

export type FillSyntax = ModularSyntax & {
  /** Has ExpressionNode inside */
  fillExportNode: ts.VariableStatement;
};

/** Base for any syntax container that imports members from other modules */
export type ModularSyntax = {
  importNodes: ts.ImportDeclaration[];
};
