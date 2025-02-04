import ts from 'typescript';
import { FunctionFill } from '../../parser/fills/structs.js';
import { createFillableCallExpression } from '../ts-node-factory/expression.factory.js';
import { createFillableIdentifier } from './createFillableIdentifier.js';

export const createFillInitializer = ({
  target,
  values,
}: FunctionFill): ts.CallExpression =>
  createFillableCallExpression(createFillableIdentifier(target), values);
