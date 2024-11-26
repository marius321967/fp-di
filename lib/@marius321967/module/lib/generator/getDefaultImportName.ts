import { basename, extname } from 'path';
import ts from 'typescript';
import { ModuleMember } from '../types.js';

export const getDefaultImportName = (filePath: string): string => {
  const moduleName = basename(filePath, extname(filePath));

  return `default_${moduleName}`;
};

export const getMemberImportIdentifier = (
  member: ModuleMember<unknown>,
): ts.Identifier =>
  member.exportedAs.type === 'default'
    ? ts.factory.createIdentifier(getDefaultImportName(member.filePath))
    : // Not using identifierNode because it's for export, not import
      ts.factory.createIdentifier(member.exportedAs.name);
