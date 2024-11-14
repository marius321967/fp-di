import ts from 'typescript';
import {
  generateFillModulePath,
  generateFillName,
} from '../../generator/fills/fill-naming';
import { createFillInitializer } from '../../generator/fills/generateFillSyntax';
import { ModuleMember } from '../../types';
import { TypedFunctionFill, TypedFunctionFillMember } from './structs';

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
