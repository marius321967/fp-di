import ts from 'typescript';
import { ValueMapEntry } from '../../repositories/values';

export type FilledFunction = {
  functionNode: ts.ArrowFunction;
  parameterValues: ValueMapEntry[];
};
