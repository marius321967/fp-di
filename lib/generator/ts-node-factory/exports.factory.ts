import ts from 'typescript';

export const createSingleExportStatement = (
  name: string,
  initializer: ts.Expression,
  typeNode: ts.TypeNode | undefined,
): ts.VariableStatement =>
  ts.factory.createVariableStatement(
    [ts.factory.createToken(ts.SyntaxKind.ExportKeyword)],
    ts.factory.createVariableDeclarationList(
      [
        ts.factory.createVariableDeclaration(
          ts.factory.createIdentifier(name),
          undefined,
          typeNode,
          initializer,
        ),
      ],
      ts.NodeFlags.Const,
    ),
  );
