import * as fs from 'fs';
import path from 'path';
import ts from 'typescript';
import {
  importIdentifier,
  makeDefaultImportClause,
  relativizeImportPath,
  resolveExportedFunctionParams,
} from './generator-tools';
import { ParseResult } from './parser';

const createStartArgumentImports = (
  startArguments: ts.Identifier[],
  startFilename: string,
): ts.ImportDeclaration[] => {
  return startArguments
    .map((argumentIdentifier) =>
      importIdentifier(argumentIdentifier, startFilename),
    )
    .filter(
      (declaration): declaration is ts.ImportDeclaration =>
        declaration !== null && ts.isImportDeclaration(declaration),
    );
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

  const startArguments = resolveExportedFunctionParams(
    parseResult.entrypoint,
    context.typeChecker,
    parseResult.identifiers.getIdentifier,
    parseResult.values.getValue,
  );

  const startCall = ts.factory.createCallExpression(
    entrypointIdentifier,
    undefined,
    startArguments,
  );

  const entrypointImportPath = relativizeImportPath(
    context.entrypointPath,
    startFilePath,
  );

  const statements = createStatements(
    createStartArgumentImports(startArguments, startFilePath),
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
