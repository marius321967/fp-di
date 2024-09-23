import path from 'path';
import ts from 'typescript';
import { BlueprintGetter } from './blueprint-map';
import { ValueGetter } from './value-map';

export type ImportOrder = {
  /** Full abstract path */
  modulePath: string;
  moduleExportIdentifier: ts.Identifier;
};

export const relativizeImportOrder = (
  importOrder: ImportOrder,
  importTo: string,
): ImportOrder => ({
  ...importOrder,
  modulePath: relativizeImportPath(importOrder.modulePath, importTo),
});

export const relativizeImportPath = (
  modulePath: string,
  importTo: string,
): string =>
  './' + path.relative(path.dirname(importTo), modulePath).replace(/\.ts$/, '');

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

  if (!blueprint) {
    throw new Error(
      `Identifier not found in registry for symbol [${symbol.escapedName}]`,
    );
  }

  const value = getValue(symbol);

  if (!value) {
    throw new Error(
      `Value not found in registry for symbol [${symbol.escapedName}]`,
    );
  }

  const sourceFile = value.getSourceFile();
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
