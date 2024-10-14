import path from 'path';
import ts from 'typescript';
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

export const relativizeImportOrder = (
  importOrder: ImportOrder,
  importTo: string,
): ImportOrder => {
  return {
    ...importOrder,
    modulePath: relativizeImportPath(importOrder.modulePath, importTo),
  };
};

export const relativizeImportPath = (
  importFrom: string,
  importTo: string,
): string | '' =>
  './' + path.relative(path.dirname(importTo), importFrom).replace(/\.ts$/, '');

export const gatherIdentifierImport = (
  identifier: ts.Identifier,
): ImportOrder => {
  const sourceFile = identifier.getSourceFile();
  // const modulePath = path.basename(sourceFile.fileName, '.ts');
  const modulePath = sourceFile.fileName;

  return {
    moduleExportIdentifier: identifier,
    modulePath,
  };
};

export const importValue = (
  value: Value,
  importTo: string,
): ts.ImportDeclaration => {
  const importOrder = relativizeImportOrder(
    gatherIdentifierImport(value.exportIdentifier),
    importTo,
  );

  return createImportDeclaration(
    createNamedImportClause(importOrder.moduleExportIdentifier),
    importOrder.modulePath,
  );
};
