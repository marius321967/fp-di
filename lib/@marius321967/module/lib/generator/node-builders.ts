import path from 'path';
import ts from 'typescript';
import { importValue } from '../imports.js';
import { Value } from '../repositories/values.js';
import { Blueprints } from '../types.js';
import { getMemberImportIdentifier } from './getDefaultImportName.js';

const isImportNeeded = (value: Value, importTo: string): boolean =>
  path.relative(value.member.filePath, importTo) !== '';

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

export const createIntersectionTypeFromBlueprints = (
  blueprints: Blueprints,
): ts.IntersectionTypeNode =>
  ts.factory.createIntersectionTypeNode(
    blueprints.map((blueprint) =>
      ts.factory.createTypeReferenceNode(blueprint.exportedAs),
    ),
  );

export const createFillableCallExpression = (
  fillableIdentifier: ts.Identifier,
  values: Value[],
): ts.CallExpression =>
  ts.factory.createCallExpression(
    fillableIdentifier,
    undefined,
    values.map(({ member }) => getMemberImportIdentifier(member)),
  );
