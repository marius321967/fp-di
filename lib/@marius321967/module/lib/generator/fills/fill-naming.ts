import path from 'path';
import ts from 'typescript';
import { ExportAs } from '../../types';

export const generateFillModulePath = (targetPath: string): string => {
  const targetDir = path.dirname(targetPath);
  const moduleName = path.basename(targetPath, '.ts');
  return `${targetDir}/${moduleName}.fill.ts`;
};

export const generateFillName = (fillableExportedAs: ExportAs): string => {
  return (
    'fill_' +
    (fillableExportedAs.type === 'named' ? fillableExportedAs.name : 'default')
  );
};

export const generateFillableDefaultImportName = (): string => {
  return 'fill_default';
};

export const generateFillableDefaultImportIdentifier = (): ts.Identifier =>
  ts.factory.createIdentifier(generateFillableDefaultImportName());
