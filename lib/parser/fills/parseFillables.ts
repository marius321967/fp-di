import ts from 'typescript';
import { assertIsPresent } from '../../helpers/assert.js';
import { BlueprintGetter } from '../../repositories/blueprints.js';
import { fileFillableReducer } from './fileFillableReducer.js';
import { TypedFillableMember } from './structs.js';

export const parseFillables = (
  programFiles: string[],
  program: ts.Program,
  getBlueprint: BlueprintGetter,
): TypedFillableMember[] =>
  programFiles.reduce<TypedFillableMember[]>(
    (acc, path) => [...acc, ...parseFileFillables(path, program, getBlueprint)],
    [],
  );

export const parseFileFillables = (
  modulePath: string,
  program: ts.Program,
  getBlueprint: BlueprintGetter,
): TypedFillableMember[] => {
  const source = program.getSourceFile(modulePath);
  assertIsPresent(source, `File [${modulePath}] not found in program`);

  return source
    .getChildren()
    .map((node) => node.getChildren())
    .reduce((acc, children) => [...acc, ...children], [])
    .reduce(fileFillableReducer(program, getBlueprint), []);
};
