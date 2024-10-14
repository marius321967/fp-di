import path from 'path';
import ts from 'typescript';
import { importValue } from '../imports';
import { Value } from '../repositories/values';

const isImportNeeded = (value: Value, importTo: string): boolean =>
  path.relative(value.filename, importTo) !== '';

export const createStartArgumentImports = (
  startArguments: Value[],
  startFilename: string,
): ts.ImportDeclaration[] => {
  return startArguments
    .filter((value) => isImportNeeded(value, startFilename))
    .map((argumentIdentifier) =>
      importValue(argumentIdentifier, startFilename),
    );
};

export const createEntrypointImport = (
  entrypointIdentifier: ts.Identifier,
  entrypointImportPath: string,
): ts.ImportDeclaration => {
  return ts.factory.createImportDeclaration(
    undefined,
    createDefaultImportClause(entrypointIdentifier),
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

export const createDefaultImportClause = (
  identifier: ts.Identifier,
): ts.ImportClause =>
  ts.factory.createImportClause(false, identifier, undefined);

/** @returns Import clause with single identifier, eg., { x } */
export const createNamedImportClause = (
  identifier: ts.Identifier,
): ts.ImportClause =>
  ts.factory.createImportClause(
    false,
    undefined,
    ts.factory.createNamedImports([
      ts.factory.createImportSpecifier(false, undefined, identifier),
    ]),
  );

export const createImportDeclaration = (
  clause: ts.ImportClause,
  modulePath: string,
): ts.ImportDeclaration =>
  ts.factory.createImportDeclaration(
    undefined,
    clause,
    ts.factory.createStringLiteral(modulePath),
  );
