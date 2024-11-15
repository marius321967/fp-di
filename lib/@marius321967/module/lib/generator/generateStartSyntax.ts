import ts from 'typescript';
import { unique } from '../helpers/structs';
import { importEntrypoint, importValue } from '../imports';
import { FunctionFill } from '../parser/fills/structs';
import { getMemberImportIdentifier } from './getDefaultImportName';

type StartSyntax = {
  importNodes: ts.ImportDeclaration[];
  entrypointCallNode: ts.ExpressionStatement;
};

export const generateStartSyntax = (
  entrypointFill: FunctionFill,
  startPath: string,
): StartSyntax => {
  const entrypointImportIdentifier = ts.factory.createIdentifier('start');
  const entrypointPath = entrypointFill.target.filePath;

  const valueImports = unique(entrypointFill.values).map((value) =>
    importValue(value, startPath),
  );
  const entrypointImport = importEntrypoint(
    entrypointImportIdentifier,
    entrypointPath,
    startPath,
  );

  const startCall = ts.factory.createCallExpression(
    entrypointImportIdentifier,
    undefined,
    entrypointFill.values.map(({ member }) =>
      getMemberImportIdentifier(member),
    ),
  );

  return {
    importNodes: [entrypointImport, ...valueImports],
    entrypointCallNode: ts.factory.createExpressionStatement(startCall),
  };
};
