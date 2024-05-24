import * as fs from 'fs';
import path from 'path';
import ts from 'typescript';
import {
  getExportedFunctionParams,
  importIdentifier,
  makeDefaultImportClause,
} from './generator-tools';
import { ParseResult } from './parser';

export const generateStart = (
  parseResult: ParseResult,
  context: { entrypointPath: string; typeChecker: ts.TypeChecker },
): void => {
  const startFilename = process.cwd() + path.sep + 'start.ts';
  // const startFilename = 'start.ts';
  const printer = ts.createPrinter();

  const entrypointIdentifier = ts.factory.createIdentifier('start');

  const startArguments = getExportedFunctionParams(
    parseResult.entrypoint,
    context.typeChecker,
  );

  const startCall = ts.factory.createCallExpression(
    entrypointIdentifier,
    undefined,
    startArguments,
  );

  const startArgumentImports = startArguments
    .map((argumentIdentifier) =>
      importIdentifier(argumentIdentifier, startFilename),
    )
    .filter(
      (declaration): declaration is ts.ImportDeclaration =>
        declaration !== null && ts.isImportDeclaration(declaration),
    );

  const entrypointImportPath =
    './' +
    path.basename(
      path.relative('.', parseResult.entrypoint.getSourceFile().fileName),
      '.ts',
    );

  const entrypointImport = ts.factory.createImportDeclaration(
    undefined,
    makeDefaultImportClause(entrypointIdentifier),
    ts.factory.createStringLiteral(entrypointImportPath),
  );

  const nodes = ts.factory.createNodeArray([
    ...startArgumentImports,
    entrypointImport,
    startCall,
  ]);

  // Create a source file
  const sourceFile = ts.createSourceFile(
    startFilename,
    '',
    ts.ScriptTarget.Latest,
    false,
    ts.ScriptKind.TS,
  );

  const result = printer.printList(ts.ListFormat.MultiLine, nodes, sourceFile);

  fs.writeFileSync(startFilename, result);
  console.log(result);
};
