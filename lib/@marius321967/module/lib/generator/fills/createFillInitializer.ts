import ts from 'typescript';
import { FunctionFill } from '../../parser/fills/structs';
import { createFillableCallExpression } from '../node-builders';
import { createFillableIdentifier } from './createFillableIdentifier';

export const createFillInitializer = ({
  target,
  values,
}: FunctionFill): ts.CallExpression =>
  createFillableCallExpression(createFillableIdentifier(target), values);
