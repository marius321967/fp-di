import ts from 'typescript';
import { importValue } from '../imports';
import { ValueMapEntry } from '../repositories/values';

export const makeDefaultImportClause = (
  identifier: ts.Identifier,
): ts.ImportClause =>
  ts.factory.createImportClause(false, identifier, undefined);

export const createStartArgumentImports = (
  startArguments: ValueMapEntry[],
  startFilename: string,
): ts.ImportDeclaration[] => {
  return startArguments
    .map((argumentIdentifier) => importValue(argumentIdentifier, startFilename))
    .filter(importDeclaration => importDeclaration !== null);
};

export const createEntrypointImport = (
  entrypointIdentifier: ts.Identifier,
  entrypointImportPath: string,
): ts.ImportDeclaration => {
  return ts.factory.createImportDeclaration(
    undefined,
    makeDefaultImportClause(entrypointIdentifier),
    ts.factory.createStringLiteral(entrypointImportPath),
  );
};

export const createStatements = (
  startArgumentImports: ts.ImportDeclaration[],
  entrypointImport: ts.ImportDeclaration,
  startCall: ts.CallExpression,
): ts.Statement[] => {
  return [
    ...startArgumentImports,
    entrypointImport,
    ts.factory.createExpressionStatement(startCall),
  ];
};
