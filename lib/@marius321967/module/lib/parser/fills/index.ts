import ts from 'typescript';
import { assertIsPresent } from '../../helpers/assert';
import { DependencyContext } from '../structs';
import { fillParseReducer } from './fillParseReducer';
import { TypedFunctionFill } from './structs';

export const parseFile = (
  modulePath: string,
  program: ts.Program,
  context: DependencyContext,
): TypedFunctionFill[] => {
  const source = program.getSourceFile(modulePath);
  assertIsPresent(source, `File [${modulePath}] not found in program`);

  return source
    .getChildren()
    .map((node) => node.getChildren())
    .reduce((acc, children) => [...acc, ...children], [])
    .reduce(fillParseReducer(program.getTypeChecker(), context), []);
};
