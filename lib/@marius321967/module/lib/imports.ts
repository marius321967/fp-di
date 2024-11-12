import path from 'path';
import ts from 'typescript';
import { getDefaultImportName } from './generator/getDefaultImportName';
import {
  createDefaultImportClause,
  createImportDeclaration,
  createNamedImportClause,
} from './generator/node-builders';
import { Blueprint } from './repositories/blueprints';
import { Value } from './repositories/values';

export type ImportOrder = {
  /** Full abstract path */
  modulePath: string;
  moduleExportIdentifier: ts.Identifier;
};

/** @param identifier Origin module path will be taken from the identifier */
export const orderImportTo = (
  identifier: ts.Identifier,
  importTo: string,
): ImportOrder => {
  return {
    moduleExportIdentifier: identifier,
    modulePath: relativizeImportPath(
      identifier.getSourceFile().fileName,
      importTo,
    ),
  };
};

/** @param importFrom As opposed to `orderImportTo()`, origin module path will be taken from this argument */
export const orderImportFromTo = (
  importAs: ts.Identifier,
  importFrom: string,
  importTo: string,
): ImportOrder => {
  return {
    moduleExportIdentifier: importAs,
    modulePath: relativizeImportPath(importFrom, importTo),
  };
};

export const relativizeImportPath = (
  importFrom: string,
  importTo: string,
): string | '' =>
  './' + path.relative(path.dirname(importTo), importFrom).replace(/\.ts$/, '');

export const importEntrypoint = (
  importAs: ts.Identifier,
  importFrom: string,
  importTo: string,
): ts.ImportDeclaration => {
  const importOrder = orderImportFromTo(importAs, importFrom, importTo);

  return createImportDeclaration(
    createDefaultImportClause(importOrder.moduleExportIdentifier),
    importOrder.modulePath,
  );
};

export const importValue = (
  value: Value,
  importTo: string,
): ts.ImportDeclaration => {
  const importOrder =
    value.member.exportedAs.type === 'default'
      ? orderImportFromTo(
          ts.factory.createIdentifier(
            getDefaultImportName(value.member.filePath),
          ),
          value.member.filePath,
          importTo,
        )
      : orderImportTo(value.member.exportedAs.identifierNode, importTo);

  return createImportDeclaration(
    createNamedImportClause(importOrder.moduleExportIdentifier),
    importOrder.modulePath,
  );
};

export const importBlueprint = (
  blueprint: Blueprint,
  importTo: string,
): ts.ImportDeclaration => {
  const importOrder = orderImportTo(blueprint.exportIdentifier, importTo);

  return createImportDeclaration(
    createNamedImportClause(importOrder.moduleExportIdentifier),
    importOrder.modulePath,
  );
};
