import ts from 'typescript';
import {
  TypedFunctionFill,
  TypedFunctionFillMember,
} from '../../parser/fills/structs.js';
import { ModuleMember } from '../../types.js';
import { createFillInitializer } from './createFillInitializer.js';
import { generateFillModulePath, generateFillName } from './fill-naming.js';

export const introduceFunctionFill = (
  fill: TypedFunctionFill,
): TypedFunctionFillMember => ({
  ...fill,
  member: makeMemberForFill(fill),
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
