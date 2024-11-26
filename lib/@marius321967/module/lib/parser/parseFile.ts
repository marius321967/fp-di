import ts from 'typescript';
import { assertIsPresent } from '../helpers/assert.js';
import { createBlueprintRepository } from '../repositories/blueprints.js';
import { createValueRepository } from '../repositories/values.js';
import { interestIterator } from './interestIterator.js';
import { ROOT_NODE_INTERESTS } from './interestRegistry.js';
import { DependencyContext } from './structs.js';

export const parseFile = (
  path: string,
  program: ts.Program,
): DependencyContext => {
  const source = program.getSourceFile(path);
  assertIsPresent(source, `File [${path}] not found in program`);

  const blueprints = createBlueprintRepository(program.getTypeChecker());
  const values = createValueRepository(program.getTypeChecker());

  // source.forEachChild(rootNodeWalker(program, { blueprints, values }));
  source.forEachChild(
    interestIterator(ROOT_NODE_INTERESTS, {
      blueprints,
      values,
      typeChecker: program.getTypeChecker(),
    }),
  );

  return { blueprints, values };
};
