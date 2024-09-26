import * as fs from 'fs';
import path from 'path';
import ts from 'typescript';
import {
  makeDefaultImportClause,
  resolveExportedFunctionParams,
} from './generator-tools';
import { importValue, relativizeImportPath } from './imports';
import { ParseResult } from './parser/structs';
import { ValueMapEntry } from './value-map';

const filterNotNull = <T>(value: T | null): value is T => value !== null;

const createStartArgumentImports = (
  startArguments: ValueMapEntry[],
  startFilename: string,
): ts.ImportDeclaration[] => {
  return startArguments
    .map((argumentIdentifier) => importValue(argumentIdentifier, startFilename))
    .filter(filterNotNull);
};

const createEntrypointImport = (
  entrypointIdentifier: ts.Identifier,
  entrypointImportPath: string,
): ts.ImportDeclaration => {
  return ts.factory.createImportDeclaration(
    undefined,
    makeDefaultImportClause(entrypointIdentifier),
    ts.factory.createStringLiteral(entrypointImportPath),
  );
};

const createStatements = (
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

export const generateStart = (
  parseResult: ParseResult,
  context: {
    entrypointPath: string;
    program: ts.Program;
    typeChecker: ts.TypeChecker;
  },
): void => {
  const startFilePath = process.cwd() + path.sep + 'start.ts';
  const printer = ts.createPrinter();

  const entrypointIdentifier = ts.factory.createIdentifier('start');

  const startArgumentValues = resolveExportedFunctionParams(
    parseResult.entrypoint,
    context.typeChecker,
    parseResult.blueprints.getBlueprint,
    parseResult.values.getValue,
  );

  const startCall = ts.factory.createCallExpression(
    entrypointIdentifier,
    undefined,
    startArgumentValues.map(({ exportedAs }) =>
      ts.factory.createIdentifier(exportedAs),
    ),
  );

  const entrypointImportPath = relativizeImportPath(
    context.entrypointPath,
    startFilePath,
  );

  const statements = createStatements(
    createStartArgumentImports(startArgumentValues, startFilePath),
    createEntrypointImport(entrypointIdentifier, entrypointImportPath),
    startCall,
  );

  const sourceFile = ts.factory.createSourceFile(
    statements,
    ts.factory.createToken(ts.SyntaxKind.EndOfFileToken),
    ts.NodeFlags.None,
  );
  sourceFile.fileName = startFilePath;

  const result = printer.printFile(sourceFile);

  fs.writeFileSync(startFilePath, result);

  console.log(result);
};
