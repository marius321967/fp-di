import ts from 'typescript';
import {
  isEntrypointDeclaration,
  isExportedTypeDeclaration,
  isExportedVariableDeclaration,
} from './helpers';
import {
  SymbolRepository,
  combineSymbolRepositories,
  createSymbolRepository,
} from './symbol-map';
import { registerTypeDeclaration, registerValueDeclarations } from './tools';
import {
  ValueRepository,
  combineValueRepositories,
  createValueRepository,
} from './value-map';

export type FileParseResult = {
  identifiers: SymbolRepository;
  values: ValueRepository;
};

export type ParseResult = {
  entrypoint: ts.ExportAssignment;
  identifiers: SymbolRepository;
  values: ValueRepository;
};

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
  const { identifiers, values } = programFiles.reduce(
    programParseReducer(program),
    {
      identifiers: createSymbolRepository(program.getTypeChecker()),
      values: createValueRepository(),
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
    identifiers,
    values,
  };
};

export const programParseReducer =
  (program: ts.Program) =>
  (acc: ParseResult, path: string): FileParseResult => {
    const result = parseFile(path, program);

    return {
      identifiers: combineSymbolRepositories(
        acc.identifiers,
        result.identifiers,
      ),
      values: combineValueRepositories(acc.values, result.values),
    };
  };

export const parseFile = (
  path: string,
  program: ts.Program,
): FileParseResult => {
  const source = program.getSourceFile(path);

  if (!source) {
    throw new Error(`Source file [${path}] not found`);
  }

  const symbolRepository = createSymbolRepository(program.getTypeChecker());
  const valueRepository = createValueRepository();

  source.forEachChild((node) => {
    if (isExportedTypeDeclaration(node)) {
      registerTypeDeclaration(
        node,
        program.getTypeChecker(),
        symbolRepository.addSymbol,
      );
    }

    if (isExportedVariableDeclaration(node)) {
      registerValueDeclarations(
        node,
        program.getTypeChecker(),
        valueRepository.addValue,
      );
    }
  });

  return { identifiers: symbolRepository, values: valueRepository };
};
