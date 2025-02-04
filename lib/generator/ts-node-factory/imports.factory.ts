import ts from 'typescript';
import { ImportContext } from '../../import-context.js';

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

/** @returns Import clause with single identifier, eg., { originalIdentifier as importIdentifier } */
export const createRenamedImportClause = (
  originalIdentifier: ts.Identifier,
  importIdentifier: ts.Identifier,
): ts.ImportClause =>
  ts.factory.createImportClause(
    false,
    undefined,
    ts.factory.createNamedImports([
      ts.factory.createImportSpecifier(
        false,
        originalIdentifier,
        importIdentifier,
      ),
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

export const createImportDeclarationFromOrder = (
  context: ImportContext,
): ts.ImportDeclaration => {
  return createImportDeclaration(
    createImportClauseFromContext(context),
    context.modulePath,
  );
};

export const createImportClauseFromContext = ({
  importAs,
  exportedAs,
}: Pick<ImportContext, 'importAs' | 'exportedAs'>): ts.ImportClause => {
  if (exportedAs.type === 'default') {
    return createDefaultImportClause(ts.factory.createIdentifier(importAs));
  }

  return exportedAs.name === importAs
    ? createNamedImportClause(ts.factory.createIdentifier(importAs))
    : createRenamedImportClause(
        ts.factory.createIdentifier(exportedAs.name),
        ts.factory.createIdentifier(importAs),
      );
};
