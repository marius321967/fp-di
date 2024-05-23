import * as fs from 'fs';
import path from 'path';
import ts from 'typescript';
import {
  getExportedFunctionParams,
  makeDefaultImportClause,
} from './generator-tools';
import { ParseResult } from './parser';

export const generateStart = (
  parseResult: ParseResult,
  context: { entrypointPath: string },
): void => {
  const printer = ts.createPrinter();

  const entrypointIdentifier = ts.factory.createIdentifier('start');

  const startCall = ts.factory.createCallExpression(
    entrypointIdentifier,
    undefined,
    // TODO next: find where function arguments can be obtained
    getExportedFunctionParams(parseResult.entrypoint),
  );

  // const startFilename = process.cwd() + path.sep + 'start.ts';
  const startFilename = 'start.ts';
  const entrypointImportPath =
    './' +
    path.basename(
      path.relative('.', parseResult.entrypoint.getSourceFile().fileName),
      '.ts',
    );

  const imports = ts.factory.createImportDeclaration(
    undefined,
    makeDefaultImportClause(entrypointIdentifier),
    ts.factory.createStringLiteral(entrypointImportPath),
  );

  const nodes = ts.factory.createNodeArray([imports, startCall]);

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
