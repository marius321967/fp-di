import ts from 'typescript';
import { assertIsPresent } from '../../helpers/assert';
import { BlueprintGetter } from '../../repositories/blueprints';
import { fileEligibleFillableReducer } from './fileEligibleFillableReducer';
import { TypedEligibleFillableMember } from './structs';

export const parseEligibleFillables = (
  programFiles: string[],
  program: ts.Program,
  getBlueprint: BlueprintGetter,
): TypedEligibleFillableMember[] =>
  programFiles.reduce<TypedEligibleFillableMember[]>(
    (acc, path) => [
      ...acc,
      ...parseFileEligibleFillables(path, program, getBlueprint),
    ],
    [],
  );

export const parseFileEligibleFillables = (
  modulePath: string,
  program: ts.Program,
  getBlueprint: BlueprintGetter,
): TypedEligibleFillableMember[] => {
  const source = program.getSourceFile(modulePath);
  assertIsPresent(source, `File [${modulePath}] not found in program`);

  return source
    .getChildren()
    .map((node) => node.getChildren())
    .reduce((acc, children) => [...acc, ...children], [])
    .reduce(fileEligibleFillableReducer(program, getBlueprint), []);
};
