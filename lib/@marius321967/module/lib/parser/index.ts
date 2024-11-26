import ts from 'typescript';
import { assertIsPresent } from '../helpers/assert.js';
import {
  combineBlueprintRepositories,
  createBlueprintRepository,
} from '../repositories/blueprints.js';
import {
  combineValueRepositories,
  createValueRepository,
} from '../repositories/values.js';
import { PreparedProgram } from '../types.js';
import { probeFillable } from './fills/tryExtractFillable.js';
import { findProgramEntrypoint } from './findProgramEntrypoint.js';
import { parseFile } from './parseFile.js';
import { DependencyContext, ParseResult } from './structs.js';

export const parseProgram = ({
  program,
  programFiles,
  programEntrypointPath,
}: PreparedProgram): ParseResult => {
  const dependencyContext = programFiles.reduce(programParseReducer(program), {
    blueprints: createBlueprintRepository(program.getTypeChecker()),
    values: createValueRepository(program.getTypeChecker()),
  });

  const entrypoint = findProgramEntrypoint(program, programEntrypointPath);

  assertIsPresent(
    entrypoint,
    'No entrypoint found. Must be arrow function exported as default.',
  );

  const entrypointFillable = probeFillable(
    entrypoint.expression,
    program.getTypeChecker(),
    dependencyContext.blueprints.getBlueprint,
  );

  assertIsPresent(
    entrypointFillable,
    'Entrypoint function cannot be injected with Values',
  );

  return {
    ...dependencyContext,
    entrypoint: {
      ...entrypointFillable,
      member: entrypoint,
    },
  };
};

export const programParseReducer =
  (program: ts.Program) =>
  (acc: ParseResult, path: string): DependencyContext => {
    const result = parseFile(path, program);

    return {
      blueprints: combineBlueprintRepositories(
        acc.blueprints,
        result.blueprints,
      ),
      values: combineValueRepositories(acc.values, result.values),
    };
  };
