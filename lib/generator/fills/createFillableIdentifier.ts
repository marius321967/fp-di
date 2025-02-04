import ts from 'typescript';
import { FunctionLikeNode, ModuleMember } from '../../types.js';
import {
  generateFillableDefaultImportIdentifier,
  generateFillableDefaultImportName,
} from './fill-naming.js';

export const createFillableIdentifier = (
  fillable: ModuleMember<FunctionLikeNode>,
): ts.Identifier =>
  fillable.exportedAs.type === 'default'
    ? generateFillableDefaultImportIdentifier()
    : ts.factory.createIdentifier(fillable.exportedAs.name);

export const getFillableImportName = (
  fillable: ModuleMember<FunctionLikeNode>,
): string =>
  fillable.exportedAs.type === 'default'
    ? generateFillableDefaultImportName()
    : fillable.exportedAs.name;
