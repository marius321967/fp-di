import path from 'path';
import ts from 'typescript';
import { createFillableIdentifier } from './generator/fills/createFillableIdentifier';
import { getDefaultImportName } from './generator/getDefaultImportName';
import {
  createDefaultImportClause,
  createImportDeclaration,
  createNamedImportClause,
} from './generator/node-builders';
import { Blueprint } from './repositories/blueprints';
import { Value } from './repositories/values';
import { FunctionLikeNode, ModuleMember } from './types';

// TODO rethink import orders. Does not specify whether target is default or named
export type ImportOrder = {
  /** Full abstract path */
  modulePath: string;
  moduleExportIdentifier: ts.Identifier;
};

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

export const importValue = (
  value: Value,
  importTo: string,
): ts.ImportDeclaration => {
  const importOrder = orderImportFromTo(
    value.member.exportedAs.type === 'default'
      ? ts.factory.createIdentifier(getDefaultImportName(value.member.filePath))
      : ts.factory.createIdentifier(value.member.exportedAs.name),
    value.member.filePath,
    importTo,
  );

  return createImportDeclaration(
    createNamedImportClause(importOrder.moduleExportIdentifier),
    importOrder.modulePath,
  );
};

export const importBlueprint = (
  blueprint: Blueprint,
  importTo: string,
): ts.ImportDeclaration => {
  const importOrder = orderImportFromTo(
    blueprint.exportIdentifier,
    blueprint.filename,
    importTo,
  );

  return createImportDeclaration(
    createNamedImportClause(importOrder.moduleExportIdentifier),
    importOrder.modulePath,
  );
};

export const importFillable = (
  fillable: ModuleMember<FunctionLikeNode>,
  importTo: string,
): ts.ImportDeclaration => {
  const importOrder = orderImportFromTo(
    createFillableIdentifier(fillable),
    fillable.expression.getSourceFile().fileName,
    importTo,
  );

  const importClause =
    fillable.exportedAs.type === 'default'
      ? createDefaultImportClause(importOrder.moduleExportIdentifier)
      : createNamedImportClause(importOrder.moduleExportIdentifier);

  return createImportDeclaration(importClause, importOrder.modulePath);
};
