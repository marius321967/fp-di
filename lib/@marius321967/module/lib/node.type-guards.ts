import ts from 'typescript';
import { ProgramEntrypointExport } from './parser/structs';

export const isExportedTypeDeclaration = (
  node: ts.Node,
): node is ts.TypeAliasDeclaration => {
  return (
    ts.isTypeAliasDeclaration(node) &&
    node.getChildAt(0).kind === ts.SyntaxKind.SyntaxList &&
    node.getChildAt(0).getChildAt(0).kind === ts.SyntaxKind.ExportKeyword
  );
};

export const isExportedVariableDeclaration = (
  node: ts.Node,
): node is ts.VariableStatement => {
  return (
    ts.isVariableStatement(node) &&
    !!node.modifiers?.some(
      (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword,
    )
  );
};

export const isNamedExportDeclaration = (
  node: ts.Node,
): node is ts.ExportDeclaration & { exportClause: ts.NamedExports } => {
  return (
    ts.isExportDeclaration(node) &&
    !!node.exportClause &&
    ts.isNamedExports(node.exportClause)
  );
};

export const isEntrypointExport = (
  node: ts.Node,
): node is ProgramEntrypointExport => {
  return ts.isExportAssignment(node) && ts.isArrowFunction(node.expression);
};
