import ts from 'typescript';
import { orderDefaultImport, orderNamedImport } from '../../imports.js';
import { Blueprint } from '../../repositories/blueprints.js';
import { Value } from '../../repositories/values.js';
import { FunctionLikeNode, ModuleMember } from '../../types.js';
import { createImportDeclarationFromContext } from '../ts-node-factory/imports.factory.js';
import { getFillableImportName } from './createFillableIdentifier.js';

export const importValue = (
  value: Value,
  importTo: string,
): ts.ImportDeclaration => {
  if (value.member.exportedAs.type !== 'named') {
    throw new Error(
      'Imports of Values that are exported as default is not implemented',
    );
  }

  const importOrder = orderNamedImport(
    value.member.exportedAs,
    value.member.filePath,
    importTo,
  );

  return createImportDeclarationFromContext(importOrder);
};

export const importBlueprint = (
  blueprint: Blueprint,
  importTo: string,
): ts.ImportDeclaration => {
  const importOrder = orderNamedImport(
    { type: 'named', name: blueprint.exportedAs },
    blueprint.filename,
    importTo,
  );

  return createImportDeclarationFromContext(importOrder);
};

export const importFillable = (
  fillable: ModuleMember<FunctionLikeNode>,
  importTo: string,
): ts.ImportDeclaration => {
  const importOrder =
    fillable.exportedAs.type === 'default'
      ? orderDefaultImport(
          getFillableImportName(fillable),
          fillable.expression.getSourceFile().fileName,
          importTo,
        )
      : orderNamedImport(fillable.exportedAs, fillable.filePath, importTo);

  return createImportDeclarationFromContext(importOrder);
};
