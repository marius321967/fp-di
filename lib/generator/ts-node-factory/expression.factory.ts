import ts from 'typescript';
import { Value } from '../../repositories/values.js';
import { getMemberImportIdentifier } from '../getDefaultImportName.js';

export const createFillableCallExpression = (
  fillableIdentifier: ts.Identifier,
  values: Value[],
): ts.CallExpression =>
  ts.factory.createCallExpression(
    fillableIdentifier,
    undefined,
    values.map(({ member }) => getMemberImportIdentifier(member)),
  );
