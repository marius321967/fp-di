import path from 'path';
import ts from 'typescript';
import { FilledFunction } from './generator/fills/structs';
import {
  createImportDeclaration,
  createNamedImportClause,
} from './generator/node-builders';
import { Value } from './repositories/values';

export type ImportOrder = {
  /** Full abstract path */
  modulePath: string;
  moduleExportIdentifier: ts.Identifier;
};

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

export const relativizeImportPath = (
  importFrom: string,
  importTo: string,
): string | '' =>
  './' + path.relative(path.dirname(importTo), importFrom).replace(/\.ts$/, '');

export const importValue = (
  value: Value,
  importTo: string,
): ts.ImportDeclaration => {
  const importOrder = orderImportTo(value.exportIdentifier, importTo);

  return createImportDeclaration(
    createNamedImportClause(importOrder.moduleExportIdentifier),
    importOrder.modulePath,
  );
};

export const importFilledFunction = (
  fill: FilledFunction,
  importTo: string,
): ts.ImportDeclaration => {
  const importOrder = orderImportTo(fill.exportIdentifier, importTo);

  return createImportDeclaration(
    createNamedImportClause(importOrder.moduleExportIdentifier),
    importOrder.modulePath,
  );
};
