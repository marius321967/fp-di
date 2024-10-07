import ts from 'typescript';
import { createBlueprintRepository } from '../repositories/blueprints';
import { createValueRepository } from '../repositories/values';
import { assertIsPresent } from '../tools';
import { rootNodeWalker } from './rootNodeWalker';
import { ParserSet } from './structs';

export const parseFile = (path: string, program: ts.Program): ParserSet => {
  const source = program.getSourceFile(path);
  assertIsPresent(source, `File [${path}] not found in program`);

  const blueprints = createBlueprintRepository(program.getTypeChecker());
  const values = createValueRepository(program.getTypeChecker());

  source.forEachChild(rootNodeWalker(program, { blueprints, values }));

  return { blueprints, values };
};
