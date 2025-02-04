import path from 'path';
import { ImportContext } from './import-context.js';
import { ExportAs } from './types.js';

/** Orders import with same name as exported */
export const orderNamedImport = (
  exportedAs: ExportAs & { type: 'named' },
  importFrom: string,
  importTo: string,
): ImportContext => ({
  importAs: exportedAs.name,
  exportedAs,
  modulePath: relativizeImportPath(importFrom, importTo),
});

export const orderDefaultImport = (
  importAs: string,
  importFrom: string,
  importTo: string,
): ImportContext => ({
  importAs: importAs,
  exportedAs: { type: 'default' },
  modulePath: relativizeImportPath(importFrom, importTo),
});

export const relativizeImportPath = (
  importFrom: string,
  importTo: string,
): string | '' =>
  './' + path.relative(path.dirname(importTo), importFrom).replace(/\.ts$/, '');
