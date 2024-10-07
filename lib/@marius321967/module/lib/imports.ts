import path from 'path';
import ts from 'typescript';
import { createNamedImportClause } from './generator/node-builders';
import { BlueprintGetter } from './repositories/blueprints';
import { ValueGetter, ValueMapEntry } from './repositories/values';
import { assertIsPresent } from './tools';

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
  value: ValueMapEntry,
  importTo: string,
): ts.ImportDeclaration => {
  const importOrder = relativizeImportOrder(
    gatherIdentifierImport(value.exportIdentifier),
    importTo,
  );

  return ts.factory.createImportDeclaration(
    undefined,
    createNamedImportClause(importOrder.moduleExportIdentifier),
    ts.factory.createStringLiteral(importOrder.modulePath),
  );
};

/**
 * Get information for importing a requested value
 * @param symbol Symbol of value
 */
const gatherValueImport = (
  symbol: ts.Symbol,
  getBlueprint: BlueprintGetter,
  getValue: ValueGetter,
): ImportOrder => {
  const blueprint = getBlueprint(symbol);
  assertIsPresent(
    blueprint,
    `Blueprint not found in registry for symbol [${symbol.escapedName}]`,
  );

  const value = getValue(symbol);
  assertIsPresent(
    value,
    `Value not found in registry for symbol [${symbol.escapedName}]`,
  );

  const sourceFile = value.valueDeclaration.getSourceFile();
  const moduleFilename = sourceFile.fileName;

  // if (!ts.isIdentifier(value)) {
  //   // TODO future: support values exported like 'export { foo } = x'
  //   throw new Error(
  //     `Export binding declarations are not supported [${value.getText()}]`,
  //   );
  // }

  // return {
  //   moduleExportIdentifier: value,
  //   modulePath: moduleFilename,
  // };
  return {} as any;
};
