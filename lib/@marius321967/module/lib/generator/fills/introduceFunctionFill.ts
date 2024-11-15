import ts from 'typescript';
import {
  TypedFunctionFill,
  TypedFunctionFillMember,
} from '../../parser/fills/structs';
import { ModuleMember } from '../../types';
import { createFillInitializer } from './createFillInitializer';
import { generateFillModulePath, generateFillName } from './fill-naming';

export const introduceFunctionFill = (
  fill: TypedFunctionFill,
): TypedFunctionFillMember => ({
  ...fill,
  exportedAs: makeMemberForFill(fill),
});

const makeMemberForFill = (
  fill: TypedFunctionFill,
): ModuleMember<ts.CallExpression> => ({
  expression: createFillInitializer(fill),
  exportedAs: {
    type: 'named',
    name: generateFillName(fill.target.exportedAs),
  },
  filePath: generateFillModulePath(fill.target.filePath),
});
