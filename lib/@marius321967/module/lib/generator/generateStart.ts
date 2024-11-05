import fs from 'fs';
import path from 'path';
import ts from 'typescript';
import { relativizeImportPath } from '../imports';
import { ParseResult } from '../parser/structs';
import {
  createEntrypointImport,
  createStartArgumentImports,
  createStatements,
} from './node-builders';
import { resolveFunctionParams } from './resolveFunctionParams';

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

  const startArgumentValues = resolveFunctionParams(
    parseResult.entrypoint.expression,
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
