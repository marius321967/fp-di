import ts from 'typescript';
import { FunctionLikeNode, ModuleMember } from '../../types';
import { generateFillableDefaultImportIdentifier } from './fill-naming';

export const createFillableIdentifier = (
  fillable: ModuleMember<FunctionLikeNode>,
): ts.Identifier =>
  fillable.exportedAs.type === 'default'
    ? generateFillableDefaultImportIdentifier()
    : ts.factory.createIdentifier(fillable.exportedAs.name);
