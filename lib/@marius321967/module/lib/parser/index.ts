import ts from 'typescript';
import { assertIsPresent } from '../helpers/assert';
import {
  combineBlueprintRepositories,
  createBlueprintRepository,
} from '../repositories/blueprints';
import {
  combineValueRepositories,
  createValueRepository,
} from '../repositories/values';
import { PreparedProgram } from '../types';
import { probeFillable } from './fills/tryExtractFillable';
import { findProgramEntrypoint } from './findProgramEntrypoint';
import { parseFile } from './parseFile';
import { DependencyContext, ParseResult } from './structs';

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
      exportedAs: entrypoint,
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
