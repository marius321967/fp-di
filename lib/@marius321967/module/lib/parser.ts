import ts from 'typescript';
import {
  combineBlueprintRepositories,
  createBlueprintRepository,
} from './blueprint-map';
import { isEntrypointDeclaration } from './helpers';
import { rooNodeWalker } from './parser/rootNodeWalker';
import { ParseResult, ParserSet } from './parser/structs';
import { combineValueRepositories, createValueRepository } from './value-map';

export const findProgramEntrypoint = (
  program: ts.Program,
  entrypointFile: string,
): ts.ExportAssignment | null => {
  const source = program.getSourceFile(entrypointFile);

  if (!source) {
    throw new Error('No source');
  }

  let entrypointDeclaration: ts.ExportAssignment | null = null;

  source.forEachChild((node) => {
    if (isEntrypointDeclaration(node)) {
      entrypointDeclaration = node;
    }
  });

  return entrypointDeclaration;
};

export const parseProgram = (
  programFiles: string[],
  entrypointFile: string,
  program: ts.Program,
): ParseResult => {
  const { blueprints, values } = programFiles.reduce(
    programParseReducer(program),
    {
      blueprints: createBlueprintRepository(program.getTypeChecker()),
      values: createValueRepository(program.getTypeChecker()),
    },
  );

  const entrypointDeclaration = findProgramEntrypoint(program, entrypointFile);

  if (!entrypointDeclaration) {
    throw new Error(
      'No entrypoint found. Must be arrow function exported as default.',
    );
  }

  return {
    entrypoint: entrypointDeclaration,
    blueprints,
    values,
  };
};

export const programParseReducer =
  (program: ts.Program) =>
  (acc: ParseResult, path: string): ParserSet => {
    const result = parseFile(path, program);

    return {
      blueprints: combineBlueprintRepositories(
        acc.blueprints,
        result.blueprints,
      ),
      values: combineValueRepositories(acc.values, result.values),
    };
  };

/**
 * TODO: parse exports instead of declarations
 */
export const parseFile = (path: string, program: ts.Program): ParserSet => {
  const source = program.getSourceFile(path);

  if (!source) {
    throw new Error(`Source file [${path}] not found`);
  }

  const blueprints = createBlueprintRepository(program.getTypeChecker());
  const values = createValueRepository(program.getTypeChecker());

  source.forEachChild(rooNodeWalker(program, { blueprints, values }));

  return { blueprints, values };
};
